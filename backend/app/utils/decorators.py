import time
from functools import wraps
from flask import request, jsonify, current_app
import jwt
from app import db
from app.models.admin import Admin
from app.models.student import Student

# In-memory rate limiting tracker: {ip_or_key: [timestamps]}
_rate_limits = {}

def rate_limit(max_requests=20, window_seconds=60):
    """Simple sliding-window in-memory rate limiter per IP/route."""
    def decorator(f):
        @wraps(f)
        def wrapper(*args, **kwargs):
            ip = request.headers.get("X-Forwarded-For", request.remote_addr or "127.0.0.1").split(",")[0].strip()
            key = f"{ip}:{request.endpoint}"
            now = time.time()
            timestamps = _rate_limits.setdefault(key, [])
            # Prune old timestamps
            _rate_limits[key] = [t for t in timestamps if now - t < window_seconds]
            if len(_rate_limits[key]) >= max_requests:
                return jsonify({
                    "success": False,
                    "error": "Rate limit exceeded. Please try again shortly."
                }), 429
            _rate_limits[key].append(now)
            return f(*args, **kwargs)
        return wrapper
    return decorator

def token_required(f):
    """Requires a valid JWT Bearer token in the Authorization header."""
    @wraps(f)
    def decorated(*args, **kwargs):
        auth_header = request.headers.get("Authorization")
        if not auth_header or not auth_header.startswith("Bearer "):
            return jsonify({"success": False, "error": "Authorization token missing or malformed"}), 401
        
        token = auth_header.split(" ")[1]
        try:
            payload = jwt.decode(token, current_app.config["JWT_SECRET_KEY"], algorithms=["HS256"])
        except jwt.ExpiredSignatureError:
            return jsonify({"success": False, "error": "Token has expired"}), 401
        except jwt.InvalidTokenError:
            return jsonify({"success": False, "error": "Invalid token"}), 401

        request.user = payload
        return f(*args, **kwargs)
    return decorated

def admin_required(f):
    """Requires user to be an active Admin or Super Admin."""
    @wraps(f)
    @token_required
    def decorated(*args, **kwargs):
        user = getattr(request, "user", {})
        if user.get("type") != "admin":
            return jsonify({"success": False, "error": "Admin privileges required"}), 403
        
        admin = db.session.get(Admin, user.get("id"))
        if not admin or not admin.is_active:
            return jsonify({"success": False, "error": "Admin account not found or deactivated"}), 403
        
        request.admin = admin
        return f(*args, **kwargs)
    return decorated

def student_required(f):
    """Requires user to be an approved Student."""
    @wraps(f)
    @token_required
    def decorated(*args, **kwargs):
        user = getattr(request, "user", {})
        if user.get("type") != "student":
            return jsonify({"success": False, "error": "Student privileges required"}), 403
        
        student = db.session.get(Student, user.get("id"))
        if not student or student.status != "Approved":
            return jsonify({"success": False, "error": "Student account not found or not approved"}), 403
        
        request.student = student
        return f(*args, **kwargs)
    return decorated

from datetime import datetime, timedelta, timezone
import secrets
import hashlib
import jwt
from flask import current_app
from werkzeug.security import generate_password_hash
from app.models.db import db
from app.models.admin import Admin
from app.models.student import Student
from app.models.password_reset import PasswordResetToken

def create_access_token(user_id: int, user_type: str, role: str = None, full_name: str = None) -> str:
    expires_in = current_app.config.get("JWT_ACCESS_TOKEN_EXPIRES", timedelta(hours=24))
    exp = datetime.now(timezone.utc) + expires_in
    payload = {
        "id": user_id,
        "type": user_type,  # 'admin' or 'student'
        "role": role or ("Admin" if user_type == "admin" else "Student"),
        "full_name": full_name or "",
        "exp": exp,
        "iat": datetime.now(timezone.utc),
    }
    token = jwt.encode(payload, current_app.config["JWT_SECRET_KEY"], algorithm="HS256")
    return token

def create_reset_token(user_type: str, user_id: int) -> str:
    raw_token = secrets.token_urlsafe(32)
    token_hash = hashlib.sha256(raw_token.encode("utf-8")).hexdigest()
    expires_at = datetime.now(timezone.utc) + timedelta(hours=2)

    reset_token = PasswordResetToken(
        user_type=user_type,
        user_id=user_id,
        token_hash=token_hash,
        expires_at=expires_at
    )
    db.session.add(reset_token)
    db.session.commit()
    return raw_token

def consume_reset_token(raw_token: str, new_password: str) -> tuple[bool, str]:
    token_hash = hashlib.sha256(raw_token.encode("utf-8")).hexdigest()
    token_entry = PasswordResetToken.query.filter_by(token_hash=token_hash).first()

    if not token_entry or not token_entry.is_valid():
        return False, "Invalid or expired reset token"

    if token_entry.user_type == "admin":
        user = Admin.query.get(token_entry.user_id)
    else:
        user = Student.query.get(token_entry.user_id)

    if not user:
        return False, "User not found"

    user.password_hash = generate_password_hash(new_password)
    token_entry.used_at = datetime.now(timezone.utc)
    db.session.commit()
    return True, "Password reset successfully"

def ensure_admin_initialized():
    import os
    admin = Admin.query.filter_by(username="admin").first()
    if not admin:
        initial_pwd = os.environ.get("INITIAL_ADMIN_PASSWORD", "admin123")
        admin = Admin(
            full_name="System Administrator",
            username="admin",
            email="admin@sblms.library",
            role="Super Admin",
            is_active=True
        )
        admin.set_password(initial_pwd)
        db.session.add(admin)
        db.session.commit()


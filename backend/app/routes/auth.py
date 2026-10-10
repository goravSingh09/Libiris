from flask import Blueprint, request, jsonify
from app.models.db import db
from app.models.admin import Admin
from app.models.student import Student
from app.services.auth_service import create_access_token, create_reset_token, consume_reset_token
from app.utils.decorators import token_required, rate_limit
from app.services.audit_service import log_audit

auth_bp = Blueprint("auth", __name__)

@auth_bp.route("/admin/login", methods=["POST"])
@rate_limit(max_requests=10, window_seconds=60)
def admin_login():
    data = request.get_json() or {}
    username = data.get("username", "").strip()
    password = data.get("password", "")

    if not username or not password:
        return jsonify({"success": False, "error": "Username and password are required"}), 400

    admin = Admin.query.filter((Admin.username == username) | (Admin.email == username)).first()
    if not admin or not admin.check_password(password):
        return jsonify({"success": False, "error": "Invalid username or password"}), 401

    if not admin.is_active:
        return jsonify({"success": False, "error": "Admin account is deactivated"}), 403

    token = create_access_token(admin.id, "admin", admin.role, admin.full_name)
    log_audit("ADMIN_LOGIN", "Admin", str(admin.id), {"username": admin.username}, admin.id)

    return jsonify({
        "success": True,
        "token": token,
        "user": admin.to_dict()
    })

@auth_bp.route("/student/login", methods=["POST"])
@rate_limit(max_requests=10, window_seconds=60)
def student_login():
    data = request.get_json() or {}
    identifier = data.get("identifier", "").strip()  # email, mobile, or student_id
    password = data.get("password", "")

    if not identifier or not password:
        return jsonify({"success": False, "error": "Email/Mobile/ID and password are required"}), 400

    student = Student.query.filter(
        (Student.email == identifier) |
        (Student.mobile == identifier) |
        (Student.student_id == identifier)
    ).first()

    if not student:
        return jsonify({"success": False, "error": "Student account not found"}), 401

    if student.status != "Approved":
        return jsonify({
            "success": False,
            "error": f"Your admission status is currently '{student.status}'. Access is granted after admin approval."
        }), 403

    if not student.password_hash:
        return jsonify({
            "success": False,
            "error": "Password not set. Please activate your account first."
        }), 403

    if not student.check_password(password):
        return jsonify({"success": False, "error": "Invalid credentials"}), 401

    token = create_access_token(student.id, "student", "Student", student.full_name)
    return jsonify({
        "success": True,
        "token": token,
        "user": student.to_dict()
    })

@auth_bp.route("/me", methods=["GET"])
@token_required
def get_current_user():
    user_info = request.user
    user_type = user_info.get("type")
    user_id = user_info.get("id")

    if user_type == "admin":
        admin = Admin.query.get(user_id)
        if not admin:
            return jsonify({"success": False, "error": "Admin not found"}), 404
        return jsonify({"success": True, "type": "admin", "user": admin.to_dict()})
    elif user_type == "student":
        student = Student.query.get(user_id)
        if not student:
            return jsonify({"success": False, "error": "Student not found"}), 404
        return jsonify({"success": True, "type": "student", "user": student.to_dict()})

    return jsonify({"success": False, "error": "Invalid token type"}), 400

@auth_bp.route("/change-password", methods=["POST"])
@token_required
def change_password():
    data = request.get_json() or {}
    old_pwd = data.get("old_password", "")
    new_pwd = data.get("new_password", "")

    if len(new_pwd) < 6:
        return jsonify({"success": False, "error": "New password must be at least 6 characters"}), 400

    user_info = request.user
    if user_info.get("type") == "admin":
        user = Admin.query.get(user_info.get("id"))
    else:
        user = Student.query.get(user_info.get("id"))

    if not user or not user.check_password(old_pwd):
        return jsonify({"success": False, "error": "Current password is incorrect"}), 400

    user.set_password(new_pwd)
    db.session.commit()
    return jsonify({"success": True, "message": "Password changed successfully"})

@auth_bp.route("/forgot-password", methods=["POST"])
@rate_limit(max_requests=5, window_seconds=60)
def forgot_password():
    data = request.get_json() or {}
    email_or_id = data.get("identifier", "").strip()

    admin = Admin.query.filter((Admin.email == email_or_id) | (Admin.username == email_or_id)).first()
    if admin:
        token = create_reset_token("admin", admin.id)
        return jsonify({
            "success": True,
            "message": "Reset instructions generated.",
            "reset_token": token  # Returned for easy testing/dev environment
        })

    student = Student.query.filter((Student.email == email_or_id) | (Student.mobile == email_or_id) | (Student.student_id == email_or_id)).first()
    if student:
        token = create_reset_token("student", student.id)
        return jsonify({
            "success": True,
            "message": "Reset instructions generated.",
            "reset_token": token
        })

    return jsonify({"success": True, "message": "If an account matches, reset instructions have been issued."})

@auth_bp.route("/reset-password", methods=["POST"])
def reset_password():
    data = request.get_json() or {}
    token = data.get("token", "").strip()
    new_pwd = data.get("new_password", "")

    if not token or len(new_pwd) < 6:
        return jsonify({"success": False, "error": "Valid token and new password (min 6 chars) required"}), 400

    success, msg = consume_reset_token(token, new_pwd)
    if not success:
        return jsonify({"success": False, "error": msg}), 400

    return jsonify({"success": True, "message": msg})

@auth_bp.route("/student/activate", methods=["POST"])
def activate_student():
    """Allows approved students without a password to set their initial password."""
    data = request.get_json() or {}
    student_id = data.get("student_id", "").strip()
    mobile = data.get("mobile", "").strip()
    password = data.get("password", "")

    if not student_id or not mobile or len(password) < 6:
        return jsonify({"success": False, "error": "Student ID, registered mobile, and password (min 6 chars) required"}), 400

    student = Student.query.filter_by(student_id=student_id, mobile=mobile).first()
    if not student:
        return jsonify({"success": False, "error": "Matching student record not found"}), 404

    if student.status != "Approved":
        return jsonify({"success": False, "error": "Your admission is not yet approved by admin."}), 403

    student.set_password(password)
    db.session.commit()
    return jsonify({"success": True, "message": "Account activated successfully! You can now log in."})

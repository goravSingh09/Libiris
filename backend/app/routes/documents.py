import os
from flask import Blueprint, request, jsonify, send_file
from app import db
from app.models.student import Student
from app.utils.decorators import token_required
from app.utils.file_storage import resolve_private_path

documents_bp = Blueprint("documents", __name__)

@documents_bp.route("/<int:id>/documents/<doc_type>", methods=["GET"])
@token_required
def get_student_document(id, doc_type):
    """
    Secure document streaming endpoint for photos and Aadhaar documents.
    Strictly authorized to:
    1. Active Admins
    2. The authenticated student who owns this document
    """
    student = db.session.get(Student, id)
    if not student:
        return jsonify({"success": False, "error": "Student not found"}), 404
    user = request.user

    # Authorization Check
    is_admin = user.get("type") == "admin"
    is_owner = user.get("type") == "student" and user.get("id") == student.id

    if not (is_admin or is_owner):
        return jsonify({
            "success": False,
            "error": "Access denied. You do not have permission to view this confidential student document."
        }), 403

    if doc_type == "photo":
        rel_path = student.photo
    elif doc_type == "aadhaar":
        rel_path = student.aadhaar_photo
    else:
        return jsonify({"success": False, "error": "Invalid document type. Expected 'photo' or 'aadhaar'."}), 400

    if not rel_path:
        return jsonify({"success": False, "error": "No document recorded for this student."}), 404

    try:
        full_path = resolve_private_path(rel_path)
        if not os.path.exists(full_path):
            return jsonify({"success": False, "error": "Document file not found in storage."}), 404

        ext = os.path.splitext(full_path)[1].lower()
        mime_map = {
            ".png": "image/png",
            ".jpg": "image/jpeg",
            ".jpeg": "image/jpeg",
            ".pdf": "application/pdf"
        }
        mimetype = mime_map.get(ext, "application/octet-stream")

        return send_file(full_path, mimetype=mimetype)

    except PermissionError:
        return jsonify({"success": False, "error": "Invalid storage path detected."}), 403
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

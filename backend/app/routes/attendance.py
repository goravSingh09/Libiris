from datetime import datetime, date
from flask import Blueprint, request, jsonify
from app.services.attendance_service import (
    mark_attendance_record,
    bulk_mark_attendance,
    get_daily_attendance_summary,
    get_student_attendance_stats
)
from app.utils.decorators import admin_required, token_required

attendance_bp = Blueprint("attendance", __name__)

@attendance_bp.route("", methods=["GET"])
@admin_required
def get_attendance():
    date_str = request.args.get("date")
    target_date = date.today()
    if date_str:
        try:
            target_date = datetime.strptime(date_str, "%Y-%m-%d").date()
        except ValueError:
            return jsonify({"success": False, "error": "Invalid date format. Use YYYY-MM-DD"}), 400

    data = get_daily_attendance_summary(target_date)
    return jsonify({
        "success": True,
        "data": data
    })

@attendance_bp.route("/mark", methods=["POST"])
@admin_required
def mark_single():
    body = request.get_json() or {}
    student_id = body.get("student_id")
    status = body.get("status", "Present")
    check_in_time = body.get("check_in_time")
    notes = body.get("notes")
    date_str = body.get("date")

    target_date = date.today()
    if date_str:
        try:
            target_date = datetime.strptime(date_str, "%Y-%m-%d").date()
        except ValueError:
            return jsonify({"success": False, "error": "Invalid date format (YYYY-MM-DD)"}), 400

    if not student_id:
        return jsonify({"success": False, "error": "student_id is required"}), 400

    try:
        record = mark_attendance_record(
            int(student_id), target_date, status,
            admin_id=request.admin.id, check_in_time=check_in_time, notes=notes
        )
        return jsonify({
            "success": True,
            "message": "Attendance marked successfully",
            "attendance": record.to_dict()
        })
    except ValueError as ve:
        return jsonify({"success": False, "error": str(ve)}), 400
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@attendance_bp.route("/bulk", methods=["POST"])
@admin_required
def mark_bulk():
    body = request.get_json() or {}
    entries = body.get("entries", [])
    date_str = body.get("date")

    target_date = date.today()
    if date_str:
        try:
            target_date = datetime.strptime(date_str, "%Y-%m-%d").date()
        except ValueError:
            return jsonify({"success": False, "error": "Invalid date format (YYYY-MM-DD)"}), 400

    if not entries:
        return jsonify({"success": False, "error": "entries list cannot be empty"}), 400

    try:
        count = bulk_mark_attendance(target_date, entries, admin_id=request.admin.id)
        return jsonify({
            "success": True,
            "message": f"Successfully updated attendance for {count} students",
            "count": count
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@attendance_bp.route("/student/<int:id>", methods=["GET"])
@token_required
def get_student_attendance(id):
    user = request.user
    if user.get("type") == "student" and user.get("id") != id:
        return jsonify({"success": False, "error": "Unauthorized to view this student's attendance"}), 403

    try:
        stats = get_student_attendance_stats(id)
        return jsonify({
            "success": True,
            "data": stats
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

from flask import Blueprint, request, jsonify
from app.services.seat_service import get_seats_data, assign_seat, release_seat
from app.utils.decorators import admin_required, token_required

seats_bp = Blueprint("seats", __name__)

@seats_bp.route("", methods=["GET"])
@token_required
def get_seats():
    data = get_seats_data()
    return jsonify({
        "success": True,
        "data": data
    })

@seats_bp.route("/assign", methods=["POST"])
@admin_required
def assign_student_seat():
    body = request.get_json() or {}
    seat_number = body.get("seat_number")
    student_id = body.get("student_id")
    notes = body.get("notes")

    if not seat_number or not student_id:
        return jsonify({"success": False, "error": "seat_number and student_id are required"}), 400

    try:
        seat = assign_seat(seat_number, student_id, notes, admin_id=request.admin.id)
        return jsonify({
            "success": True,
            "message": f"Seat {seat_number} successfully assigned.",
            "seat": seat.to_dict()
        })
    except ValueError as ve:
        return jsonify({"success": False, "error": str(ve)}), 400
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@seats_bp.route("/release", methods=["POST"])
@admin_required
def release_student_seat():
    body = request.get_json() or {}
    seat_number = body.get("seat_number")

    if not seat_number:
        return jsonify({"success": False, "error": "seat_number is required"}), 400

    try:
        seat = release_seat(seat_number, admin_id=request.admin.id)
        return jsonify({
            "success": True,
            "message": f"Seat {seat_number} successfully released.",
            "seat": seat.to_dict()
        })
    except ValueError as ve:
        return jsonify({"success": False, "error": str(ve)}), 400
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

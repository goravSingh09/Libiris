from datetime import datetime, date
from flask import Blueprint, request, jsonify
from app.models.db import db
from app.models.student import Student
from app.models.seat import Seat
from app.models.invoice import Invoice
from app.services.student_service import generate_student_id, check_duplicate_student, approve_student_admission
from app.services.audit_service import log_audit
from app.utils.decorators import admin_required, token_required
from app.utils.file_storage import save_private_document

students_bp = Blueprint("students", __name__)

@students_bp.route("", methods=["GET"])
@admin_required
def list_students():
    search = request.args.get("search", "").strip()
    status = request.args.get("status", "").strip()
    seat_status = request.args.get("seat_status", "").strip()
    page = int(request.args.get("page", 1))
    per_page = int(request.args.get("per_page", 20))

    query = Student.query
    if search:
        query = query.filter(
            (Student.full_name.ilike(f"%{search}%")) |
            (Student.student_id.ilike(f"%{search}%")) |
            (Student.mobile.ilike(f"%{search}%")) |
            (Student.email.ilike(f"%{search}%"))
        )

    if status:
        query = query.filter(Student.status == status)

    if seat_status == "allocated":
        query = query.filter(Student.seat_number.isnot(None))
    elif seat_status == "unallocated":
        query = query.filter(Student.seat_number.is_(None))

    pagination = query.order_by(Student.id.desc()).paginate(page=page, per_page=per_page, error_out=False)

    return jsonify({
        "success": True,
        "students": [s.to_dict(include_sensitive=False) for s in pagination.items],
        "pagination": {
            "total": pagination.total,
            "pages": pagination.pages,
            "page": page,
            "per_page": per_page,
            "has_next": pagination.has_next,
            "has_prev": pagination.has_prev
        }
    })

@students_bp.route("/admission", methods=["POST"])
def submit_admission():
    """
    Public student admission application submission with photo & Aadhaar upload.
    Expects multipart/form-data.
    """
    try:
        full_name = request.form.get("full_name", "").strip()
        father_name = request.form.get("father_name", "").strip()
        mother_name = request.form.get("mother_name", "").strip()
        mobile = request.form.get("mobile", "").strip()
        email = request.form.get("email", "").strip()
        password = request.form.get("password", "")
        whatsapp = request.form.get("whatsapp", "").strip() or mobile
        emergency_contact = request.form.get("emergency_contact", "").strip()
        aadhaar_number = request.form.get("aadhaar_number", "").strip().replace(" ", "").replace("-", "")
        dob_str = request.form.get("dob", "").strip()
        gender = request.form.get("gender", "Male").strip()
        address = request.form.get("address", "").strip()
        preparing_for = request.form.get("preparing_for", "Competitive Exams").strip()

        # Validate required text fields
        if not (full_name and father_name and mother_name and mobile and email and aadhaar_number and dob_str and address):
            return jsonify({"success": False, "error": "Please fill in all mandatory personal and contact fields."}), 400

        if len(mobile) != 10 or not mobile.isdigit():
            return jsonify({"success": False, "error": "Mobile number must be exactly 10 digits."}), 400

        if len(aadhaar_number) != 12 or not aadhaar_number.isdigit():
            return jsonify({"success": False, "error": "Aadhaar number must be exactly 12 digits."}), 400

        # Check duplicates
        dup_err = check_duplicate_student(mobile, email, aadhaar_number)
        if dup_err:
            return jsonify({"success": False, "error": dup_err}), 409

        # Parse DOB
        try:
            dob = datetime.strptime(dob_str, "%Y-%m-%d").date()
        except ValueError:
            return jsonify({"success": False, "error": "Date of Birth must be in YYYY-MM-DD format."}), 400

        # Validate and save uploaded documents
        photo_file = request.files.get("photo")
        aadhaar_file = request.files.get("aadhaar_photo")

        if not photo_file:
            return jsonify({"success": False, "error": "Student photograph is required."}), 400
        if not aadhaar_file:
            return jsonify({"success": False, "error": "Aadhaar document copy is required."}), 400

        photo_path = save_private_document(photo_file, "photos")
        aadhaar_path = save_private_document(aadhaar_file, "aadhaar")

        new_student_id = generate_student_id()

        student = Student(
            student_id=new_student_id,
            full_name=full_name,
            father_name=father_name,
            mother_name=mother_name,
            mobile=mobile,
            email=email,
            whatsapp=whatsapp,
            emergency_contact=emergency_contact or mobile,
            aadhaar_number=aadhaar_number,
            dob=dob,
            gender=gender,
            address=address,
            preparing_for=preparing_for,
            photo=photo_path,
            aadhaar_photo=aadhaar_path,
            status="Pending Approval",
            fee_status="Pending",
            monthly_fee=500.0,
            joining_date=date.today()
        )

        if password and len(password) >= 6:
            student.set_password(password)

        db.session.add(student)
        db.session.commit()

        return jsonify({
            "success": True,
            "message": "Admission application submitted successfully! Your application is pending admin approval.",
            "student_id": new_student_id,
            "student": student.to_dict()
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"success": False, "error": str(e)}), 400

@students_bp.route("/<int:id>", methods=["GET"])
@token_required
def get_student(id):
    student = Student.query.get_or_404(id)
    user_info = request.user

    # Only authorized admin OR the student themselves
    if user_info.get("type") == "student" and user_info.get("id") != student.id:
        return jsonify({"success": False, "error": "Unauthorized to view this student profile"}), 403

    is_admin = user_info.get("type") == "admin"
    return jsonify({
        "success": True,
        "student": student.to_dict(include_sensitive=is_admin)
    })

@students_bp.route("/<int:id>", methods=["PUT"])
@admin_required
def update_student(id):
    student = Student.query.get_or_404(id)
    data = request.get_json() or {}

    # Update personal fields
    for field in ["full_name", "father_name", "mother_name", "whatsapp", "emergency_contact", "address", "preparing_for", "gender"]:
        if field in data:
            setattr(student, field, data[field].strip() if isinstance(data[field], str) else data[field])

    if "monthly_fee" in data:
        student.monthly_fee = float(data["monthly_fee"])

    # Seat number update
    if "seat_number" in data:
        new_seat = str(data["seat_number"]).strip() if data["seat_number"] else None
        if new_seat != student.seat_number:
            if new_seat:
                # Check target seat
                seat_obj = Seat.query.filter_by(seat_number=new_seat).first()
                if seat_obj and seat_obj.assigned_student_id and seat_obj.assigned_student_id != student.id:
                    return jsonify({"success": False, "error": f"Seat {new_seat} is already occupied"}), 400
                # Release old
                if student.seat_number:
                    old_s = Seat.query.filter_by(seat_number=student.seat_number).first()
                    if old_s:
                        old_s.assigned_student_id = None
                        old_s.status = "Available"
                if seat_obj:
                    seat_obj.assigned_student_id = student.id
                    seat_obj.status = "Occupied"
                student.seat_number = new_seat
            else:
                if student.seat_number:
                    old_s = Seat.query.filter_by(seat_number=student.seat_number).first()
                    if old_s:
                        old_s.assigned_student_id = None
                        old_s.status = "Available"
                student.seat_number = None

    if "status" in data and data["status"] in ("Pending Approval", "Approved", "Rejected", "Archived"):
        student.status = data["status"]

    db.session.commit()
    log_audit("UPDATE_STUDENT", "Student", str(student.id), data, request.admin.id)

    return jsonify({
        "success": True,
        "message": "Student details updated successfully",
        "student": student.to_dict(include_sensitive=True)
    })

@students_bp.route("/<int:id>/approve", methods=["POST"])
@admin_required
def approve_student(id):
    data = request.get_json() or {}
    seat_number = data.get("seat_number")
    monthly_fee = data.get("monthly_fee")

    try:
        student = approve_student_admission(id, seat_number, monthly_fee, admin_id=request.admin.id)
        return jsonify({
            "success": True,
            "message": f"Student {student.student_id} approved successfully!",
            "student": student.to_dict(include_sensitive=True)
        })
    except Exception as e:
        db.session.rollback()
        return jsonify({"success": False, "error": str(e)}), 400

@students_bp.route("/<int:id>/reject", methods=["POST"])
@admin_required
def reject_student(id):
    student = Student.query.get_or_404(id)
    student.status = "Rejected"
    
    # Release any seat held
    if student.seat_number:
        seat_obj = Seat.query.filter_by(seat_number=student.seat_number).first()
        if seat_obj:
            seat_obj.assigned_student_id = None
            seat_obj.status = "Available"
        student.seat_number = None

    db.session.commit()
    log_audit("REJECT_STUDENT", "Student", str(student.id), {"reason": request.get_json().get("reason") if request.get_json() else ""}, request.admin.id)

    return jsonify({
        "success": True,
        "message": f"Student {student.student_id} admission rejected.",
        "student": student.to_dict(include_sensitive=True)
    })

@students_bp.route("/<int:id>", methods=["DELETE"])
@admin_required
def delete_student(id):
    student = Student.query.get_or_404(id)
    
    # Release seat before deleting
    if student.seat_number:
        seat_obj = Seat.query.filter_by(seat_number=student.seat_number).first()
        if seat_obj:
            seat_obj.assigned_student_id = None
            seat_obj.status = "Available"

    student_uid = student.student_id
    db.session.delete(student)
    db.session.commit()
    log_audit("DELETE_STUDENT", "Student", str(id), {"student_id": student_uid}, request.admin.id)

    return jsonify({"success": True, "message": f"Student {student_uid} deleted successfully."})

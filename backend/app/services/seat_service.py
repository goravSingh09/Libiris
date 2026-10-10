from app.models.db import db
from app.models.seat import Seat
from app.models.student import Student
from app.services.audit_service import log_audit

def ensure_seats_initialized(capacity: int = 120):
    existing_count = Seat.query.count()
    if existing_count < capacity:
        existing_numbers = {s.seat_number for s in Seat.query.all()}
        for i in range(1, capacity + 1):
            s_num = str(i)
            if s_num not in existing_numbers:
                seat = Seat(seat_number=s_num, status="Available")
                db.session.add(seat)
        db.session.commit()

def get_seats_data():
    ensure_seats_initialized()
    seats = Seat.query.order_by(db.cast(Seat.seat_number, db.Integer)).all()
    total = len(seats)
    occupied = sum(1 for s in seats if s.status == "Occupied")
    available = sum(1 for s in seats if s.status == "Available")
    maintenance = sum(1 for s in seats if s.status == "Maintenance")
    return {
        "seats": [s.to_dict() for s in seats],
        "metrics": {
            "total": total,
            "occupied": occupied,
            "available": available,
            "maintenance": maintenance,
            "occupancy_rate": round((occupied / total * 100), 1) if total > 0 else 0
        }
    }

def assign_seat(seat_number: str, student_id: int, notes: str = None, admin_id: int = None):
    student = Student.query.get_or_404(student_id)
    if student.status != "Approved":
        raise ValueError("Cannot assign seat to a student whose admission is not approved.")

    seat = Seat.query.filter_by(seat_number=str(seat_number)).first()
    if not seat:
        seat = Seat(seat_number=str(seat_number), status="Available")
        db.session.add(seat)

    if seat.assigned_student_id and seat.assigned_student_id != student.id:
        raise ValueError(f"Seat {seat_number} is already occupied by student #{seat.assigned_student_id}.")

    # Release any prior seat held by this student
    prior_seat = Seat.query.filter(Seat.assigned_student_id == student.id, Seat.seat_number != str(seat_number)).first()
    if prior_seat:
        prior_seat.assigned_student_id = None
        prior_seat.status = "Available"

    seat.assigned_student_id = student.id
    seat.status = "Occupied"
    if notes:
        seat.notes = notes
    student.seat_number = str(seat_number)
    db.session.commit()

    log_audit("ASSIGN_SEAT", "Seat", str(seat.id), {"seat_number": seat_number, "student_id": student.student_id}, admin_id)
    return seat

def release_seat(seat_number: str, admin_id: int = None):
    seat = Seat.query.filter_by(seat_number=str(seat_number)).first()
    if not seat:
        raise ValueError(f"Seat {seat_number} not found.")

    assigned_id = seat.assigned_student_id
    if assigned_id:
        student = db.session.get(Student, assigned_id)
        if student:
            student.seat_number = None

    seat.assigned_student_id = None
    seat.status = "Available"
    seat.notes = None
    db.session.commit()

    log_audit("RELEASE_SEAT", "Seat", str(seat.id), {"seat_number": seat_number, "released_from_student_id": assigned_id}, admin_id)
    return seat

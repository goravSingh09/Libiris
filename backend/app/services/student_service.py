from datetime import date
import re
from app.models.db import db
from app.models.student import Student
from app.models.seat import Seat
from app.models.invoice import Invoice
from app.services.audit_service import log_audit

def generate_student_id() -> str:
    """Generates sequential Student ID: SBL0001, SBL0002, etc."""
    students = Student.query.filter(Student.student_id.like("SBL%")).all()
    max_num = 0
    for s in students:
        match = re.search(r"SBL(\d+)", s.student_id)
        if match:
            num = int(match.group(1))
            if num > max_num:
                max_num = num
    
    next_num = max_num + 1
    return f"SBL{next_num:04d}"

def check_duplicate_student(mobile: str, email: str, aadhaar_number: str, exclude_id: int = None):
    query = Student.query
    if exclude_id:
        query = query.filter(Student.id != exclude_id)
        
    if query.filter_by(mobile=mobile).first():
        return "A student with this mobile number already exists."
    if query.filter_by(email=email).first():
        return "A student with this email address already exists."
    if query.filter_by(aadhaar_number=aadhaar_number).first():
        return "A student with this Aadhaar number already exists."
    return None

def approve_student_admission(student_id: int, seat_number: str = None, monthly_fee: float = None, admin_id: int = None) -> Student:
    student = Student.query.get_or_404(student_id)
    student.status = "Approved"
    if not student.joining_date:
        student.joining_date = date.today()
    if monthly_fee is not None:
        student.monthly_fee = float(monthly_fee)
    
    # Assign seat if provided
    if seat_number:
        # Check if seat is already occupied by someone else
        existing_seat = Seat.query.filter_by(seat_number=seat_number).first()
        if existing_seat and existing_seat.assigned_student_id and existing_seat.assigned_student_id != student.id:
            raise ValueError(f"Seat {seat_number} is already occupied by student #{existing_seat.assigned_student_id}")
        
        # Release any previously held seat
        old_seat = Seat.query.filter_by(assigned_student_id=student.id).first()
        if old_seat and old_seat.seat_number != seat_number:
            old_seat.assigned_student_id = None
            old_seat.status = "Available"
            
        if existing_seat:
            existing_seat.assigned_student_id = student.id
            existing_seat.status = "Occupied"
        else:
            new_seat = Seat(seat_number=seat_number, status="Occupied", assigned_student_id=student.id)
            db.session.add(new_seat)
        student.seat_number = seat_number

    # Generate initial invoice for current month if none exists
    current_month = date.today().strftime("%B %Y")
    existing_invoice = Invoice.query.filter_by(student_id=student.id, billing_month=current_month).first()
    if not existing_invoice and (student.monthly_fee or 0) > 0:
        inv_num = f"INV-{date.today().strftime('%Y%m')}-{student.student_id}"
        initial_invoice = Invoice(
            invoice_number=inv_num,
            student_id=student.id,
            billing_month=current_month,
            due_date=date.today(),
            total_amount=student.monthly_fee,
            paid_amount=0.0,
            balance_amount=student.monthly_fee,
            status="Pending"
        )
        db.session.add(initial_invoice)
        student.fee_status = "Pending"

    db.session.commit()
    log_audit("APPROVE_STUDENT", "Student", str(student.id), {"student_id": student.student_id, "seat": seat_number}, admin_id)
    return student

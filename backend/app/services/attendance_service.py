from datetime import date
from app.models.db import db
from app.models.student import Student
from app.models.attendance import Attendance

def mark_attendance_record(student_id: int, att_date: date, status: str, admin_id: int = None, check_in_time: str = None, notes: str = None) -> Attendance:
    student = Student.query.get_or_404(student_id)
    if student.status != "Approved":
        raise ValueError("Cannot mark attendance for unapproved student.")
    
    if status not in ("Present", "Absent", "Leave"):
        raise ValueError("Status must be Present, Absent, or Leave.")

    record = Attendance.query.filter_by(student_id=student.id, date=att_date).first()
    if record:
        record.status = status
        record.marked_by_admin_id = admin_id
        if check_in_time:
            record.check_in_time = check_in_time
        if notes:
            record.notes = notes
    else:
        record = Attendance(
            student_id=student.id,
            date=att_date,
            status=status,
            marked_by_admin_id=admin_id,
            check_in_time=check_in_time,
            notes=notes
        )
        db.session.add(record)
    
    db.session.commit()
    return record

def bulk_mark_attendance(att_date: date, entries: list[dict], admin_id: int = None) -> int:
    """
    entries: list of dicts: [{'student_id': 1, 'status': 'Present', 'check_in_time': '09:00 AM'}]
    """
    count = 0
    for item in entries:
        s_id = item.get("student_id")
        stat = item.get("status", "Present")
        c_time = item.get("check_in_time")
        note = item.get("notes")
        mark_attendance_record(s_id, att_date, stat, admin_id, c_time, note)
        count += 1
    return count

def get_daily_attendance_summary(att_date: date = None) -> dict:
    target_date = att_date or date.today()
    approved_students = Student.query.filter_by(status="Approved").all()
    total_approved = len(approved_students)
    
    records = Attendance.query.filter_by(date=target_date).all()
    status_map = {r.student_id: r for r in records}

    present = sum(1 for r in records if r.status == "Present")
    absent = sum(1 for r in records if r.status == "Absent")
    leave = sum(1 for r in records if r.status == "Leave")
    unmarked = total_approved - len(records)
    rate = round((present / total_approved * 100), 1) if total_approved > 0 else 0

    student_list = []
    for s in approved_students:
        rec = status_map.get(s.id)
        student_list.append({
            "student_id": s.id,
            "student_uid": s.student_id,
            "full_name": s.full_name,
            "seat_number": s.seat_number,
            "status": rec.status if rec else "Unmarked",
            "check_in_time": rec.check_in_time if rec else None,
            "notes": rec.notes if rec else None,
        })

    return {
        "date": target_date.isoformat(),
        "total_approved": total_approved,
        "present": present,
        "absent": absent,
        "leave": leave,
        "unmarked": max(0, unmarked),
        "attendance_rate": rate,
        "students": student_list
    }

def get_student_attendance_stats(student_id: int) -> dict:
    student = Student.query.get_or_404(student_id)
    records = Attendance.query.filter_by(student_id=student.id).order_by(Attendance.date.desc()).all()
    total = len(records)
    present = sum(1 for r in records if r.status == "Present")
    absent = sum(1 for r in records if r.status == "Absent")
    leave = sum(1 for r in records if r.status == "Leave")
    rate = round((present / total * 100), 1) if total > 0 else 0

    return {
        "student_id": student.id,
        "student_uid": student.student_id,
        "total_days_tracked": total,
        "present_days": present,
        "absent_days": absent,
        "leave_days": leave,
        "attendance_rate": rate,
        "history": [r.to_dict() for r in records]
    }

import io
import csv
from datetime import date
from app.models.student import Student
from app.models.payment import Payment
from app.models.invoice import Invoice
from app.models.attendance import Attendance

def export_students_csv(include_aadhaar=False) -> io.StringIO:
    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow([
        "Student ID", "Full Name", "Father's Name", "Mother's Name",
        "Mobile", "Email", "WhatsApp", "Gender", "DOB",
        "Seat Number", "Monthly Fee", "Fee Status", "Admission Status", "Joining Date"
    ])
    
    students = Student.query.order_by(Student.id.asc()).all()
    for s in students:
        writer.writerow([
            s.student_id, s.full_name, s.father_name, s.mother_name,
            s.mobile, s.email, s.whatsapp, s.gender, s.dob.isoformat() if s.dob else "",
            s.seat_number or "Unallocated", s.monthly_fee or 0.0, s.fee_status, s.status,
            s.joining_date.isoformat() if s.joining_date else ""
        ])
    output.seek(0)
    return output

def export_cash_collections_csv(start_date: date = None, end_date: date = None) -> io.StringIO:
    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow([
        "Receipt Number", "Payment Date", "Student ID", "Student Name",
        "Billing Month", "Amount (INR)", "Payment Method", "Cashier", "Notes"
    ])
    
    query = Payment.query.filter_by(is_reversal=False)
    if start_date:
        query = query.filter(Payment.payment_date >= start_date)
    if end_date:
        query = query.filter(Payment.payment_date <= end_date)
        
    payments = query.order_by(Payment.payment_date.desc(), Payment.id.desc()).all()
    for p in payments:
        writer.writerow([
            p.receipt_number,
            p.payment_date.isoformat() if p.payment_date else "",
            p.student.student_id if p.student else "",
            p.student.full_name if p.student else "",
            p.invoice.billing_month if p.invoice else "",
            f"{p.amount:.2f}",
            p.payment_method,
            p.admin.full_name if p.admin else "System",
            p.notes or ""
        ])
    output.seek(0)
    return output

def export_fee_dues_csv() -> io.StringIO:
    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow([
        "Invoice Number", "Student ID", "Student Name", "Mobile",
        "Billing Month", "Due Date", "Total Fee", "Paid Amount", "Outstanding Balance", "Status"
    ])
    
    invoices = Invoice.query.filter(Invoice.balance_amount > 0).order_by(Invoice.due_date.asc()).all()
    for inv in invoices:
        writer.writerow([
            inv.invoice_number,
            inv.student.student_id if inv.student else "",
            inv.student.full_name if inv.student else "",
            inv.student.mobile if inv.student else "",
            inv.billing_month,
            inv.due_date.isoformat() if inv.due_date else "",
            f"{inv.total_amount:.2f}",
            f"{inv.paid_amount:.2f}",
            f"{inv.balance_amount:.2f}",
            inv.status
        ])
    output.seek(0)
    return output

def export_attendance_csv(start_date: date = None, end_date: date = None) -> io.StringIO:
    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow([
        "Date", "Student ID", "Student Name", "Seat Number", "Status", "Check-in Time", "Notes"
    ])
    
    query = Attendance.query
    if start_date:
        query = query.filter(Attendance.date >= start_date)
    if end_date:
        query = query.filter(Attendance.date <= end_date)
        
    records = query.order_by(Attendance.date.desc(), Attendance.id.asc()).all()
    for a in records:
        writer.writerow([
            a.date.isoformat(),
            a.student.student_id if a.student else "",
            a.student.full_name if a.student else "",
            a.student.seat_number if a.student else "",
            a.status,
            a.check_in_time or "",
            a.notes or ""
        ])
    output.seek(0)
    return output

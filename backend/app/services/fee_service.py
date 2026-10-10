from datetime import date
import re
from app.models.db import db
from app.models.student import Student
from app.models.invoice import Invoice
from app.models.payment import Payment
from app.services.audit_service import log_audit

def generate_receipt_number() -> str:
    """Generates unique sequential receipt number: REC-YYYYMM-XXXX"""
    prefix = f"REC-{date.today().strftime('%Y%m')}"
    latest = Payment.query.filter(Payment.receipt_number.like(f"{prefix}-%")).order_by(Payment.id.desc()).first()
    if not latest:
        return f"{prefix}-0001"
    match = re.search(r"-(\d+)$", latest.receipt_number)
    next_num = int(match.group(1)) + 1 if match else 1
    return f"{prefix}-{next_num:04d}"

def record_cash_payment(invoice_id: int, amount: float, admin_id: int, payment_date: date = None, notes: str = None) -> Payment:
    if amount <= 0:
        raise ValueError("Payment amount must be greater than zero.")

    invoice = Invoice.query.get_or_404(invoice_id)
    if amount > invoice.balance_amount:
        raise ValueError(f"Payment amount (Rs. {amount:.2f}) cannot exceed outstanding balance (Rs. {invoice.balance_amount:.2f}).")

    receipt_num = generate_receipt_number()
    payment = Payment(
        receipt_number=receipt_num,
        invoice_id=invoice.id,
        student_id=invoice.student_id,
        admin_id=admin_id,
        amount=round(float(amount), 2),
        payment_method="Cash",  # Strictly Cash
        payment_date=payment_date or date.today(),
        notes=notes
    )
    db.session.add(payment)
    db.session.flush()

    # Recalculate invoice
    invoice.recalculate()

    # Update student overall fee status
    student = db.session.get(Student, invoice.student_id)
    if student:
        has_overdue = Invoice.query.filter_by(student_id=student.id, status="Overdue").first()
        has_pending = Invoice.query.filter(Invoice.student_id == student.id, Invoice.status.in_(["Pending", "Partially Paid"])).first()
        if has_overdue:
            student.fee_status = "Overdue"
        elif has_pending:
            student.fee_status = "Partially Paid" if has_pending.status == "Partially Paid" else "Pending"
        else:
            student.fee_status = "Paid"

    db.session.commit()
    log_audit("RECORD_CASH_PAYMENT", "Payment", str(payment.id), {
        "receipt_number": receipt_num,
        "amount": amount,
        "student_id": invoice.student.student_id,
        "billing_month": invoice.billing_month
    }, admin_id)
    return payment

def reverse_cash_payment(payment_id: int, admin_id: int, reason: str = "") -> Payment:
    payment = Invoice.query.get_or_404(payment_id) if False else db.session.get(Payment, payment_id)
    if not payment:
        raise ValueError("Payment record not found.")
    if payment.is_reversal:
        raise ValueError("Payment has already been reversed.")

    payment.is_reversal = True
    if reason:
        payment.notes = f"{payment.notes or ''} [REVERSED: {reason}]".strip()

    invoice = db.session.get(Invoice, payment.invoice_id)
    if invoice:
        invoice.recalculate()
        student = db.session.get(Student, invoice.student_id)
        if student:
            has_pending = Invoice.query.filter(Invoice.student_id == student.id, Invoice.status.in_(["Pending", "Partially Paid", "Overdue"])).first()
            student.fee_status = has_pending.status if has_pending else "Paid"

    db.session.commit()
    log_audit("REVERSE_PAYMENT", "Payment", str(payment.id), {
        "receipt_number": payment.receipt_number,
        "amount": payment.amount,
        "reason": reason
    }, admin_id)
    return payment

def generate_monthly_invoices(billing_month: str = None, due_date: date = None) -> list[Invoice]:
    """Generates monthly invoices for all approved active students."""
    month = billing_month or date.today().strftime("%B %Y")
    due = due_date or date.today()
    students = Student.query.filter_by(status="Approved").all()
    created = []

    for s in students:
        existing = Invoice.query.filter_by(student_id=s.id, billing_month=month).first()
        if not existing and (s.monthly_fee or 0) > 0:
            inv_num = f"INV-{due.strftime('%Y%m')}-{s.student_id}"
            inv = Invoice(
                invoice_number=inv_num,
                student_id=s.id,
                billing_month=month,
                due_date=due,
                total_amount=s.monthly_fee,
                paid_amount=0.0,
                balance_amount=s.monthly_fee,
                status="Pending"
            )
            db.session.add(inv)
            created.append(inv)
            s.fee_status = "Pending"
    
    db.session.commit()
    return created

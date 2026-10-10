from datetime import datetime, date, timezone
from app.models.db import db

class Payment(db.Model):
    __tablename__ = "payments"

    id = db.Column(db.Integer, primary_key=True)
    receipt_number = db.Column(db.String(50), unique=True, nullable=False, index=True)
    invoice_id = db.Column(db.Integer, db.ForeignKey("invoices.id", ondelete="CASCADE"), nullable=False, index=True)
    student_id = db.Column(db.Integer, db.ForeignKey("students.id", ondelete="CASCADE"), nullable=False, index=True)
    admin_id = db.Column(db.Integer, db.ForeignKey("admins.id", ondelete="SET NULL"), nullable=True)

    amount = db.Column(db.Float, nullable=False)
    payment_method = db.Column(db.String(30), default="Cash", nullable=False)  # Strictly Cash
    payment_date = db.Column(db.Date, default=date.today, nullable=False, index=True)
    notes = db.Column(db.String(255), nullable=True)

    # Auditable correction/reversal
    is_reversal = db.Column(db.Boolean, default=False, nullable=False)
    original_payment_id = db.Column(db.Integer, nullable=True)

    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

    admin = db.relationship("Admin", backref=db.backref("recorded_payments", lazy="dynamic"))

    def to_dict(self):
        return {
            "id": self.id,
            "receipt_number": self.receipt_number,
            "invoice_id": self.invoice_id,
            "student_id": self.student_id,
            "student_uid": self.student.student_id if self.student else None,
            "student_name": self.student.full_name if self.student else None,
            "billing_month": self.invoice.billing_month if self.invoice else None,
            "admin_id": self.admin_id,
            "recorded_by": self.admin.full_name if self.admin else "System Administrator",
            "amount": round(self.amount, 2),
            "payment_method": self.payment_method,
            "payment_date": self.payment_date.isoformat() if self.payment_date else None,
            "notes": self.notes,
            "is_reversal": self.is_reversal,
            "original_payment_id": self.original_payment_id,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }

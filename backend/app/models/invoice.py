from datetime import datetime, date, timezone
from app.models.db import db

class Invoice(db.Model):
    __tablename__ = "invoices"

    id = db.Column(db.Integer, primary_key=True)
    invoice_number = db.Column(db.String(50), unique=True, nullable=False, index=True)
    student_id = db.Column(db.Integer, db.ForeignKey("students.id", ondelete="CASCADE"), nullable=False, index=True)
    billing_month = db.Column(db.String(30), nullable=False, index=True)  # e.g. "October 2026"
    due_date = db.Column(db.Date, nullable=False)
    total_amount = db.Column(db.Float, nullable=False)
    paid_amount = db.Column(db.Float, default=0.0, nullable=False)
    balance_amount = db.Column(db.Float, nullable=False)
    status = db.Column(db.String(30), default="Pending", nullable=False)  # Pending, Partially Paid, Paid, Overdue
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    payments = db.relationship("Payment", backref="invoice", cascade="all, delete-orphan", lazy="dynamic")

    def recalculate(self):
        """Recalculate paid_amount, balance_amount, and status based on recorded non-reversed payments."""
        total_paid = sum(p.amount for p in self.payments if not p.is_reversal)
        self.paid_amount = round(total_paid, 2)
        self.balance_amount = round(max(0.0, self.total_amount - self.paid_amount), 2)
        if self.balance_amount <= 0:
            self.status = "Paid"
        elif self.paid_amount > 0:
            self.status = "Partially Paid"
        elif self.due_date and self.due_date < date.today():
            self.status = "Overdue"
        else:
            self.status = "Pending"

    def to_dict(self):
        return {
            "id": self.id,
            "invoice_number": self.invoice_number,
            "student_id": self.student_id,
            "student_uid": self.student.student_id if self.student else None,
            "student_name": self.student.full_name if self.student else None,
            "billing_month": self.billing_month,
            "due_date": self.due_date.isoformat() if self.due_date else None,
            "total_amount": round(self.total_amount, 2),
            "paid_amount": round(self.paid_amount, 2),
            "balance_amount": round(self.balance_amount, 2),
            "status": self.status,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
        }

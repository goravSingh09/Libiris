from app.models.db import db
from app.models.admin import Admin
from app.models.student import Student
from app.models.seat import Seat
from app.models.invoice import Invoice
from app.models.payment import Payment
from app.models.attendance import Attendance
from app.models.password_reset import PasswordResetToken
from app.models.audit_log import AuditLog
from app.models.setting import Setting

__all__ = [
    "db",
    "Admin",
    "Student",
    "Seat",
    "Invoice",
    "Payment",
    "Attendance",
    "PasswordResetToken",
    "AuditLog",
    "Setting",
]

from datetime import datetime, date, timezone
from werkzeug.security import generate_password_hash, check_password_hash
from app.models.db import db

class Student(db.Model):
    __tablename__ = "students"

    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.String(20), unique=True, nullable=False, index=True)

    # Personal details
    full_name = db.Column(db.String(100), nullable=False)
    father_name = db.Column(db.String(100), nullable=False)
    mother_name = db.Column(db.String(100), nullable=False)

    # Contact details
    mobile = db.Column(db.String(15), unique=True, nullable=False, index=True)
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    whatsapp = db.Column(db.String(15), nullable=False)
    emergency_contact = db.Column(db.String(15), nullable=False)

    # Identity & demographics
    aadhaar_number = db.Column(db.String(12), unique=True, nullable=False, index=True)
    dob = db.Column(db.Date, nullable=False)
    gender = db.Column(db.String(20), nullable=False)
    address = db.Column(db.Text, nullable=False)
    preparing_for = db.Column(db.String(100), nullable=False)

    # Private document paths (stored securely in backend/storage/uploads)
    photo = db.Column(db.String(255), nullable=False)
    aadhaar_photo = db.Column(db.String(255), nullable=False)

    # Authentication
    password_hash = db.Column(db.String(255), nullable=True)

    # Library allocation & status
    seat_number = db.Column(db.String(20), nullable=True)
    monthly_fee = db.Column(db.Float, default=500.0, nullable=True)
    fee_status = db.Column(db.String(20), default="Pending", nullable=False)  # Pending, Partially Paid, Paid, Overdue
    status = db.Column(db.String(30), default="Pending Approval", nullable=False)  # Pending Approval, Approved, Rejected, Archived
    joining_date = db.Column(db.Date, nullable=True)

    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    # Relationships
    invoices = db.relationship("Invoice", backref="student", cascade="all, delete-orphan", lazy="dynamic")
    payments = db.relationship("Payment", backref="student", cascade="all, delete-orphan", lazy="dynamic")
    attendances = db.relationship("Attendance", backref="student", cascade="all, delete-orphan", lazy="dynamic")

    def set_password(self, password: str):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password: str) -> bool:
        if not self.password_hash:
            return False
        return check_password_hash(self.password_hash, password)

    def to_dict(self, include_sensitive: bool = False):
        masked_aadhaar = f"XXXX-XXXX-{self.aadhaar_number[-4:]}" if self.aadhaar_number and len(self.aadhaar_number) >= 4 else self.aadhaar_number
        data = {
            "id": self.id,
            "student_id": self.student_id,
            "full_name": self.full_name,
            "father_name": self.father_name,
            "mother_name": self.mother_name,
            "mobile": self.mobile,
            "email": self.email,
            "whatsapp": self.whatsapp,
            "emergency_contact": self.emergency_contact,
            "aadhaar_number": self.aadhaar_number if include_sensitive else masked_aadhaar,
            "dob": self.dob.isoformat() if self.dob else None,
            "gender": self.gender,
            "address": self.address,
            "preparing_for": self.preparing_for,
            "has_photo": bool(self.photo),
            "has_aadhaar": bool(self.aadhaar_photo),
            "has_password": bool(self.password_hash),
            "seat_number": self.seat_number,
            "monthly_fee": self.monthly_fee or 0.0,
            "fee_status": self.fee_status,
            "status": self.status,
            "joining_date": self.joining_date.isoformat() if self.joining_date else None,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
        }
        return data

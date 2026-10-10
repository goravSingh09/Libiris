from datetime import datetime, timezone
from app.models.db import db

class Seat(db.Model):
    __tablename__ = "seats"

    id = db.Column(db.Integer, primary_key=True)
    seat_number = db.Column(db.String(20), unique=True, nullable=False, index=True)
    status = db.Column(db.String(20), default="Available", nullable=False)  # Available, Occupied, Maintenance
    assigned_student_id = db.Column(db.Integer, db.ForeignKey("students.id", ondelete="SET NULL"), unique=True, nullable=True)
    notes = db.Column(db.String(255), nullable=True)
    updated_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    assigned_student = db.relationship("Student", backref=db.backref("seat_assignment", uselist=False))

    def to_dict(self):
        return {
            "id": self.id,
            "seat_number": self.seat_number,
            "status": self.status,
            "assigned_student_id": self.assigned_student_id,
            "assigned_student_name": self.assigned_student.full_name if self.assigned_student else None,
            "assigned_student_uid": self.assigned_student.student_id if self.assigned_student else None,
            "notes": self.notes,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
        }

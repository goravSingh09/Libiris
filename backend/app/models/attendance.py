from datetime import datetime, date, timezone
from app.models.db import db

class Attendance(db.Model):
    __tablename__ = "attendance"

    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey("students.id", ondelete="CASCADE"), nullable=False, index=True)
    date = db.Column(db.Date, default=date.today, nullable=False, index=True)
    status = db.Column(db.String(20), nullable=False)  # Present, Absent, Leave
    marked_by_admin_id = db.Column(db.Integer, db.ForeignKey("admins.id", ondelete="SET NULL"), nullable=True)
    check_in_time = db.Column(db.String(20), nullable=True)
    notes = db.Column(db.String(255), nullable=True)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

    __table_args__ = (
        db.UniqueConstraint("student_id", "date", name="uq_student_date_attendance"),
    )

    marked_by = db.relationship("Admin", backref=db.backref("marked_attendances", lazy="dynamic"))

    def to_dict(self):
        return {
            "id": self.id,
            "student_id": self.student_id,
            "student_uid": self.student.student_id if self.student else None,
            "student_name": self.student.full_name if self.student else None,
            "date": self.date.isoformat() if self.date else None,
            "status": self.status,
            "check_in_time": self.check_in_time,
            "marked_by_admin_id": self.marked_by_admin_id,
            "marked_by_name": self.marked_by.full_name if self.marked_by else None,
            "notes": self.notes,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }

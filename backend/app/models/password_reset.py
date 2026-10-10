from datetime import datetime, timezone
from app.models.db import db

class PasswordResetToken(db.Model):
    __tablename__ = "password_reset_tokens"

    id = db.Column(db.Integer, primary_key=True)
    user_type = db.Column(db.String(20), nullable=False)  # Admin or Student
    user_id = db.Column(db.Integer, nullable=False, index=True)
    token_hash = db.Column(db.String(255), unique=True, nullable=False, index=True)
    expires_at = db.Column(db.DateTime, nullable=False)
    used_at = db.Column(db.DateTime, nullable=True)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

    def is_valid(self) -> bool:
        return self.used_at is None and datetime.now(timezone.utc) < self.expires_at.replace(tzinfo=timezone.utc) if self.expires_at.tzinfo is None else (self.used_at is None and datetime.now(timezone.utc) < self.expires_at)

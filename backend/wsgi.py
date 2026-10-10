from app import create_app
from app.models.db import db
from app.services.seat_service import ensure_seats_initialized

app = create_app()

with app.app_context():
    db.create_all()
    ensure_seats_initialized()

if __name__ == "__main__":
    app.run()

import os
from app import create_app
from app.models.db import db
from app.services.seat_service import ensure_seats_initialized
from app.services.auth_service import ensure_admin_initialized

app = create_app()

with app.app_context():
    db.create_all()
    ensure_seats_initialized()
    ensure_admin_initialized()

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    debug = os.environ.get("FLASK_DEBUG", "false").lower() in ("true", "1")
    app.run(host="0.0.0.0", port=port, debug=debug)

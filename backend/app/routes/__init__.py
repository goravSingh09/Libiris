from app.routes.auth import auth_bp
from app.routes.students import students_bp
from app.routes.documents import documents_bp
from app.routes.seats import seats_bp
from app.routes.fees import fees_bp
from app.routes.receipts import receipts_bp
from app.routes.attendance import attendance_bp
from app.routes.reports import reports_bp
from app.routes.dashboard import dashboard_bp
from app.routes.health import health_bp

__all__ = [
    "auth_bp",
    "students_bp",
    "documents_bp",
    "seats_bp",
    "fees_bp",
    "receipts_bp",
    "attendance_bp",
    "reports_bp",
    "dashboard_bp",
    "health_bp",
]

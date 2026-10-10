from datetime import datetime, timezone
from flask import Blueprint, jsonify
from app.models.db import db
from sqlalchemy import text

health_bp = Blueprint("health", __name__)

@health_bp.route("/health", methods=["GET"])
@health_bp.route("", methods=["GET"])
def check_health():
    db_status = "connected"
    try:
        db.session.execute(text("SELECT 1"))
    except Exception as e:
        db_status = f"error: {str(e)}"

    return jsonify({
        "status": "healthy" if db_status == "connected" else "degraded",
        "service": "SBLMS API",
        "database": db_status,
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "version": "1.0.0"
    })

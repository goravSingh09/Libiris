import json
from flask import request
from app.models.db import db
from app.models.audit_log import AuditLog

def log_audit(action: str, target_type: str, target_id: str = None, details = None, admin_id: int = None):
    try:
        ip = request.headers.get("X-Forwarded-For", request.remote_addr or "127.0.0.1").split(",")[0].strip() if request else "127.0.0.1"
    except Exception:
        ip = "127.0.0.1"

    if isinstance(details, (dict, list)):
        details_str = json.dumps(details)
    else:
        details_str = str(details) if details else None

    entry = AuditLog(
        admin_id=admin_id,
        action=action,
        target_type=target_type,
        target_id=str(target_id) if target_id is not None else None,
        details=details_str,
        ip_address=ip
    )
    db.session.add(entry)
    db.session.commit()

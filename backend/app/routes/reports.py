from datetime import datetime
from flask import Blueprint, request, jsonify, Response
from app.models.audit_log import AuditLog
from app.services.report_service import (
    export_students_csv,
    export_cash_collections_csv,
    export_fee_dues_csv,
    export_attendance_csv
)
from app.utils.decorators import admin_required

reports_bp = Blueprint("reports", __name__)

@reports_bp.route("/export/students", methods=["GET"])
@admin_required
def download_students_csv():
    csv_stream = export_students_csv()
    return Response(
        csv_stream.getvalue(),
        mimetype="text/csv",
        headers={"Content-Disposition": "attachment; filename=students_master_list.csv"}
    )

@reports_bp.route("/export/cash-collections", methods=["GET"])
@admin_required
def download_cash_collections_csv():
    start_str = request.args.get("start_date")
    end_str = request.args.get("end_date")
    start_date = datetime.strptime(start_str, "%Y-%m-%d").date() if start_str else None
    end_date = datetime.strptime(end_str, "%Y-%m-%d").date() if end_str else None

    csv_stream = export_cash_collections_csv(start_date, end_date)
    return Response(
        csv_stream.getvalue(),
        mimetype="text/csv",
        headers={"Content-Disposition": "attachment; filename=cash_collections_report.csv"}
    )

@reports_bp.route("/export/dues", methods=["GET"])
@admin_required
def download_fee_dues_csv():
    csv_stream = export_fee_dues_csv()
    return Response(
        csv_stream.getvalue(),
        mimetype="text/csv",
        headers={"Content-Disposition": "attachment; filename=fee_dues_defaulters_report.csv"}
    )

@reports_bp.route("/export/attendance", methods=["GET"])
@admin_required
def download_attendance_csv():
    start_str = request.args.get("start_date")
    end_str = request.args.get("end_date")
    start_date = datetime.strptime(start_str, "%Y-%m-%d").date() if start_str else None
    end_date = datetime.strptime(end_str, "%Y-%m-%d").date() if end_str else None

    csv_stream = export_attendance_csv(start_date, end_date)
    return Response(
        csv_stream.getvalue(),
        mimetype="text/csv",
        headers={"Content-Disposition": "attachment; filename=attendance_report.csv"}
    )

@reports_bp.route("/audit-logs", methods=["GET"])
@admin_required
def get_audit_logs():
    limit = int(request.args.get("limit", 100))
    logs = AuditLog.query.order_by(AuditLog.id.desc()).limit(limit).all()
    return jsonify({
        "success": True,
        "logs": [l.to_dict() for l in logs]
    })

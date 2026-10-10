from datetime import datetime, date, timedelta
from flask import Blueprint, jsonify, request
from sqlalchemy import func
from app.models.db import db
from app.models.student import Student
from app.models.seat import Seat
from app.models.invoice import Invoice
from app.models.payment import Payment
from app.models.attendance import Attendance
from app.services.attendance_service import get_daily_attendance_summary
from app.utils.decorators import admin_required, token_required

dashboard_bp = Blueprint("dashboard", __name__)

@dashboard_bp.route("/admin", methods=["GET"])
@admin_required
def get_admin_dashboard():
    # 1. Student Status Metrics
    total_students = Student.query.count()
    approved_students = Student.query.filter_by(status="Approved").count()
    pending_admissions = Student.query.filter_by(status="Pending Approval").count()
    rejected_admissions = Student.query.filter_by(status="Rejected").count()

    # 2. Seat Metrics
    total_seats = Seat.query.count() or 120
    occupied_seats = Seat.query.filter_by(status="Occupied").count()
    available_seats = max(0, total_seats - occupied_seats)

    # 3. Today's Attendance
    today = date.today()
    today_att = get_daily_attendance_summary(today)

    # 4. Cash Fee Metrics (Real queries)
    # Cash collected this month
    start_of_month = today.replace(day=1)
    month_payments = Payment.query.filter(
        Payment.payment_date >= start_of_month,
        Payment.is_reversal == False
    ).all()
    cash_collected_this_month = sum(p.amount for p in month_payments)

    # Outstanding Fees across all open invoices
    all_open_invoices = Invoice.query.filter(Invoice.balance_amount > 0).all()
    outstanding_fees = sum(inv.balance_amount for inv in all_open_invoices)

    # Overdue Invoices
    overdue_invoices_count = Invoice.query.filter(
        Invoice.balance_amount > 0,
        Invoice.due_date < today
    ).count()

    # 5. Charts Data
    # 5a. Monthly cash collection (last 6 months)
    collection_chart = []
    for i in range(5, -1, -1):
        target_month_date = (today.replace(day=1) - timedelta(days=i * 28)).replace(day=1)
        next_month_date = (target_month_date + timedelta(days=32)).replace(day=1)
        m_name = target_month_date.strftime("%b %Y")
        m_sum = db.session.query(func.coalesce(func.sum(Payment.amount), 0.0)).filter(
            Payment.payment_date >= target_month_date,
            Payment.payment_date < next_month_date,
            Payment.is_reversal == False
        ).scalar()
        collection_chart.append({
            "month": m_name,
            "collected": round(float(m_sum), 2)
        })

    # 5b. Fee Status Breakdown
    paid_count = Invoice.query.filter_by(status="Paid").count()
    partial_count = Invoice.query.filter_by(status="Partially Paid").count()
    pending_count = Invoice.query.filter_by(status="Pending").count()
    overdue_count = Invoice.query.filter_by(status="Overdue").count()
    fee_breakdown_chart = [
        {"name": "Paid", "count": paid_count, "color": "#10B981"},
        {"name": "Partially Paid", "count": partial_count, "color": "#06B6D4"},
        {"name": "Pending", "count": pending_count, "color": "#F59E0B"},
        {"name": "Overdue", "count": overdue_count, "color": "#EF4444"},
    ]

    # 5c. Daily Attendance Trend (Last 7 days)
    attendance_trend = []
    for d in range(6, -1, -1):
        dt = today - timedelta(days=d)
        p_count = Attendance.query.filter_by(date=dt, status="Present").count()
        a_count = Attendance.query.filter_by(date=dt, status="Absent").count()
        attendance_trend.append({
            "date": dt.strftime("%a %d"),
            "present": p_count,
            "absent": a_count
        })

    # 6. Recent Admissions (last 5)
    recent_students = Student.query.order_by(Student.id.desc()).limit(5).all()

    # 7. Recent Cash Receipts (last 5)
    recent_payments = Payment.query.filter_by(is_reversal=False).order_by(Payment.payment_date.desc(), Payment.id.desc()).limit(5).all()

    return jsonify({
        "success": True,
        "metrics": {
            "total_students": total_students,
            "approved_students": approved_students,
            "pending_admissions": pending_admissions,
            "rejected_admissions": rejected_admissions,
            "total_seats": total_seats,
            "occupied_seats": occupied_seats,
            "available_seats": available_seats,
            "seat_occupancy_rate": round((occupied_seats / total_seats * 100), 1) if total_seats > 0 else 0,
            "today_attendance_present": today_att["present"],
            "today_attendance_rate": today_att["attendance_rate"],
            "cash_collected_this_month": round(cash_collected_this_month, 2),
            "outstanding_fees": round(outstanding_fees, 2),
            "overdue_invoices_count": overdue_invoices_count,
        },
        "charts": {
            "collection_trend": collection_chart,
            "fee_breakdown": fee_breakdown_chart,
            "attendance_trend": attendance_trend
        },
        "recent_admissions": [s.to_dict() for s in recent_students],
        "recent_receipts": [p.to_dict() for p in recent_payments]
    })

@dashboard_bp.route("/student", methods=["GET"])
@token_required
def get_student_dashboard():
    user = request.user
    if user.get("type") != "student":
        return jsonify({"success": False, "error": "Student access required"}), 403

    student = Student.query.get_or_404(user.get("id"))
    
    # Invoices & balances
    invoices = Invoice.query.filter_by(student_id=student.id).order_by(Invoice.due_date.desc()).all()
    total_outstanding = sum(inv.balance_amount for inv in invoices)

    # Current month invoice
    current_month = date.today().strftime("%B %Y")
    current_inv = next((inv for inv in invoices if inv.billing_month == current_month), None)

    # Recent payments
    recent_payments = Payment.query.filter_by(student_id=student.id, is_reversal=False).order_by(Payment.payment_date.desc(), Payment.id.desc()).limit(5).all()

    # Today's attendance
    today_att = Attendance.query.filter_by(student_id=student.id, date=date.today()).first()

    # Attendance overall
    all_att = Attendance.query.filter_by(student_id=student.id).all()
    present_days = sum(1 for a in all_att if a.status == "Present")
    att_rate = round((present_days / len(all_att) * 100), 1) if all_att else 0.0

    return jsonify({
        "success": True,
        "student": student.to_dict(),
        "seat": {
            "seat_number": student.seat_number,
            "status": "Allocated" if student.seat_number else "Pending Allocation"
        },
        "fee_summary": {
            "monthly_fee": student.monthly_fee or 0.0,
            "total_outstanding": round(total_outstanding, 2),
            "fee_status": student.fee_status,
            "current_month_invoice": current_inv.to_dict() if current_inv else None
        },
        "attendance_summary": {
            "today_status": today_att.status if today_att else "Unmarked",
            "attendance_rate": att_rate,
            "total_days": len(all_att),
            "present_days": present_days
        },
        "recent_receipts": [p.to_dict() for p in recent_payments]
    })

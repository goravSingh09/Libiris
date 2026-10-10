from datetime import datetime, date
from flask import Blueprint, request, jsonify
from app.models.db import db
from app.models.student import Student
from app.models.invoice import Invoice
from app.models.payment import Payment
from app.services.fee_service import record_cash_payment, reverse_cash_payment, generate_monthly_invoices
from app.utils.decorators import admin_required, token_required

fees_bp = Blueprint("fees", __name__)

@fees_bp.route("/invoices", methods=["GET"])
@admin_required
def list_invoices():
    student_id = request.args.get("student_id")
    status = request.args.get("status")
    month = request.args.get("month")

    query = Invoice.query
    if student_id:
        query = query.filter_by(student_id=int(student_id))
    if status:
        query = query.filter_by(status=status)
    if month:
        query = query.filter_by(billing_month=month)

    invoices = query.order_by(Invoice.id.desc()).all()
    return jsonify({
        "success": True,
        "invoices": [inv.to_dict() for inv in invoices]
    })

@fees_bp.route("/invoices/generate", methods=["POST"])
@admin_required
def bulk_generate_invoices():
    data = request.get_json() or {}
    month = data.get("billing_month")
    due_date_str = data.get("due_date")

    due_date = None
    if due_date_str:
        try:
            due_date = datetime.strptime(due_date_str, "%Y-%m-%d").date()
        except ValueError:
            return jsonify({"success": False, "error": "Invalid due_date format (YYYY-MM-DD)"}), 400

    created = generate_monthly_invoices(month, due_date)
    return jsonify({
        "success": True,
        "message": f"Generated {len(created)} invoices for {month or date.today().strftime('%B %Y')}",
        "count": len(created)
    })

@fees_bp.route("/payments/cash", methods=["POST"])
@admin_required
def record_cash():
    """
    STRICT CASH PAYMENT RECORDING
    Authorized Admin records cash received physically at the library desk.
    """
    data = request.get_json() or {}
    invoice_id = data.get("invoice_id")
    amount = data.get("amount")
    notes = data.get("notes")
    p_date_str = data.get("payment_date")

    if not invoice_id or amount is None:
        return jsonify({"success": False, "error": "invoice_id and amount are required"}), 400

    try:
        amount_float = float(amount)
    except (ValueError, TypeError):
        return jsonify({"success": False, "error": "Amount must be a valid number"}), 400

    payment_date = None
    if p_date_str:
        try:
            payment_date = datetime.strptime(p_date_str, "%Y-%m-%d").date()
        except ValueError:
            return jsonify({"success": False, "error": "Invalid payment_date format (YYYY-MM-DD)"}), 400

    try:
        payment = record_cash_payment(
            invoice_id=int(invoice_id),
            amount=amount_float,
            admin_id=request.admin.id,
            payment_date=payment_date,
            notes=notes
        )
        return jsonify({
            "success": True,
            "message": f"Cash payment of Rs. {amount_float:.2f} recorded successfully.",
            "payment": payment.to_dict(),
            "receipt_number": payment.receipt_number
        }), 201
    except ValueError as ve:
        return jsonify({"success": False, "error": str(ve)}), 400
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@fees_bp.route("/payments/reverse", methods=["POST"])
@admin_required
def reverse_payment():
    data = request.get_json() or {}
    payment_id = data.get("payment_id")
    reason = data.get("reason", "").strip()

    if not payment_id or not reason:
        return jsonify({"success": False, "error": "payment_id and reason are required for auditable reversal"}), 400

    try:
        payment = reverse_cash_payment(int(payment_id), request.admin.id, reason)
        return jsonify({
            "success": True,
            "message": f"Payment {payment.receipt_number} reversed successfully.",
            "payment": payment.to_dict()
        })
    except ValueError as ve:
        return jsonify({"success": False, "error": str(ve)}), 400
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@fees_bp.route("/payments", methods=["GET"])
@admin_required
def list_payments():
    student_id = request.args.get("student_id")
    limit = int(request.args.get("limit", 50))

    query = Payment.query.filter_by(is_reversal=False)
    if student_id:
        query = query.filter_by(student_id=int(student_id))

    payments = query.order_by(Payment.payment_date.desc(), Payment.id.desc()).limit(limit).all()
    return jsonify({
        "success": True,
        "payments": [p.to_dict() for p in payments]
    })

@fees_bp.route("/student/<int:id>", methods=["GET"])
@token_required
def get_student_fee_history(id):
    student = Student.query.get_or_404(id)
    user = request.user

    # Only authorized admin OR self student
    if user.get("type") == "student" and user.get("id") != student.id:
        return jsonify({"success": False, "error": "Unauthorized to view this student's fee ledger"}), 403

    invoices = Invoice.query.filter_by(student_id=student.id).order_by(Invoice.due_date.desc()).all()
    payments = Payment.query.filter_by(student_id=student.id).order_by(Payment.payment_date.desc(), Payment.id.desc()).all()

    total_billed = sum(inv.total_amount for inv in invoices)
    total_paid = sum(p.amount for p in payments if not p.is_reversal)
    total_outstanding = sum(inv.balance_amount for inv in invoices)

    return jsonify({
        "success": True,
        "student_id": student.id,
        "student_uid": student.student_id,
        "full_name": student.full_name,
        "seat_number": student.seat_number,
        "monthly_fee": student.monthly_fee or 0.0,
        "fee_status": student.fee_status,
        "total_billed": round(total_billed, 2),
        "total_paid": round(total_paid, 2),
        "total_outstanding": round(total_outstanding, 2),
        "invoices": [inv.to_dict() for inv in invoices],
        "payments": [p.to_dict() for p in payments]
    })

from flask import Blueprint, request, jsonify, send_file
from app.models.payment import Payment
from app.services.receipt_service import generate_pdf_receipt
from app.utils.decorators import token_required

receipts_bp = Blueprint("receipts", __name__)

@receipts_bp.route("/<receipt_number>/pdf", methods=["GET"])
@token_required
def download_pdf_receipt(receipt_number):
    payment = Payment.query.filter_by(receipt_number=receipt_number).first_or_404()
    user = request.user

    # Authorization Check: Admin OR the student recipient
    is_admin = user.get("type") == "admin"
    is_owner = user.get("type") == "student" and user.get("id") == payment.student_id

    if not (is_admin or is_owner):
        return jsonify({
            "success": False,
            "error": "Access denied. You cannot access another student's fee receipt."
        }), 403

    try:
        pdf_stream = generate_pdf_receipt(payment)
        return send_file(
            pdf_stream,
            mimetype="application/pdf",
            as_attachment=False,
            download_name=f"{payment.receipt_number}.pdf"
        )
    except Exception as e:
        return jsonify({"success": False, "error": f"Error generating PDF receipt: {str(e)}"}), 500

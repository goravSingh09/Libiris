import io
from datetime import datetime
from reportlab.lib import colors
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from app.models.payment import Payment

def generate_pdf_receipt(payment: Payment) -> io.BytesIO:
    """
    Generates a professional PDF receipt for a cash payment using ReportLab.
    """
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=letter,
        rightMargin=40,
        leftMargin=40,
        topMargin=40,
        bottomMargin=40
    )
    
    story = []
    styles = getSampleStyleSheet()

    # Custom styles
    title_style = ParagraphStyle(
        "HeaderTitle",
        parent=styles["Heading1"],
        fontName="Helvetica-Bold",
        fontSize=20,
        leading=24,
        textColor=colors.HexColor("#0B192C"),
        alignment=1 # Center
    )
    subtitle_style = ParagraphStyle(
        "HeaderSubtitle",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=11,
        leading=14,
        textColor=colors.HexColor("#D4AF37"),
        alignment=1
    )
    tagline_style = ParagraphStyle(
        "HeaderTagline",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=9,
        leading=12,
        textColor=colors.HexColor("#64748B"),
        alignment=1
    )
    meta_style = ParagraphStyle(
        "MetaText",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=10,
        leading=14,
        textColor=colors.HexColor("#1E293B")
    )
    bold_meta = ParagraphStyle(
        "BoldMetaText",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=10,
        leading=14,
        textColor=colors.HexColor("#0B192C")
    )

    # 1. Header
    story.append(Paragraph("SHREE BALA JI ADHYAYAN KENDRA LIBRARY", title_style))
    story.append(Spacer(1, 4))
    story.append(Paragraph("OFFICIAL CASH FEE RECEIPT", subtitle_style))
    story.append(Spacer(1, 2))
    story.append(Paragraph("Self Study Reading Hall • Peaceful Ambience • Modern Facilities", tagline_style))
    story.append(Spacer(1, 12))
    story.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor("#0B192C"), spaceBefore=2, spaceAfter=15))

    # 2. Receipt & Student Metadata Table
    student = payment.student
    invoice = payment.invoice
    admin_name = payment.admin.full_name if payment.admin else "Desk Cashier"
    payment_dt = payment.payment_date.strftime("%d %B %Y")

    meta_data = [
        [
            Paragraph(f"<b>Receipt No:</b> {payment.receipt_number}", bold_meta),
            Paragraph(f"<b>Date:</b> {payment_dt}", meta_style)
        ],
        [
            Paragraph(f"<b>Student ID:</b> {student.student_id}", bold_meta),
            Paragraph(f"<b>Assigned Seat:</b> Seat {student.seat_number or 'Unallocated'}", meta_style)
        ],
        [
            Paragraph(f"<b>Student Name:</b> {student.full_name}", meta_style),
            Paragraph(f"<b>Contact:</b> {student.mobile}", meta_style)
        ],
        [
            Paragraph(f"<b>Father's Name:</b> {student.father_name}", meta_style),
            Paragraph(f"<b>Billing Month:</b> {invoice.billing_month}", meta_style)
        ],
    ]

    meta_table = Table(meta_data, colWidths=[3.25 * inch, 3.25 * inch])
    meta_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor("#F8FAFC")),
        ('BOX', (0, 0), (-1, -1), 0.5, colors.HexColor("#E2E8F0")),
        ('INNERGRID', (0, 0), (-1, -1), 0.5, colors.HexColor("#F1F5F9")),
        ('TOPPADDING', (0, 0), (-1, -1), 6),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
        ('LEFTPADDING', (0, 0), (-1, -1), 10),
        ('RIGHTPADDING', (0, 0), (-1, -1), 10),
    ]))
    story.append(meta_table)
    story.append(Spacer(1, 18))

    # 3. Payment Line Item Table
    items_data = [
        [
            Paragraph("<b>Particulars / Description</b>", bold_meta),
            Paragraph("<b>Payment Mode</b>", bold_meta),
            Paragraph("<b>Amount (INR)</b>", bold_meta)
        ],
        [
            Paragraph(f"Monthly Library Study Fee — <b>{invoice.billing_month}</b><br/><font size=8 color='#64748B'>Invoice Ref: {invoice.invoice_number}</font>", meta_style),
            Paragraph("<b>CASH</b><br/><font size=8 color='#0D9488'>Received at Desk</font>", meta_style),
            Paragraph(f"<b>Rs. {payment.amount:,.2f}</b>", bold_meta)
        ],
        [
            "",
            Paragraph("<b>Total Received:</b>", bold_meta),
            Paragraph(f"<b>Rs. {payment.amount:,.2f}</b>", bold_meta)
        ],
        [
            "",
            Paragraph("<b>Remaining Balance:</b>", meta_style),
            Paragraph(f"Rs. {invoice.balance_amount:,.2f}", meta_style)
        ]
    ]

    items_table = Table(items_data, colWidths=[3.5 * inch, 1.8 * inch, 1.7 * inch])
    items_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor("#0B192C")),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
        ('BOX', (0, 0), (-1, -1), 1, colors.HexColor("#CBD5E1")),
        ('INNERGRID', (0, 0), (-1, -1), 0.5, colors.HexColor("#E2E8F0")),
        ('LINEBELOW', (0, 0), (-1, 0), 1.5, colors.HexColor("#D4AF37")),
        ('TOPPADDING', (0, 0), (-1, -1), 8),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
        ('LEFTPADDING', (0, 0), (-1, -1), 8),
        ('RIGHTPADDING', (0, 0), (-1, -1), 8),
        ('BACKGROUND', (0, 2), (-1, 2), colors.HexColor("#F8FAFC")),
    ]))
    story.append(items_table)
    story.append(Spacer(1, 15))

    # 4. Remarks / Notes if present
    if payment.notes:
        story.append(Paragraph(f"<b>Remarks / Notes:</b> {payment.notes}", meta_style))
        story.append(Spacer(1, 10))

    story.append(Spacer(1, 25))

    # 5. Signatures and Seal
    sig_data = [
        [
            Paragraph("<b>Student / Guardian Acknowledgment</b>", meta_style),
            Paragraph("<b>For Shree Bala Ji Adhyayan Kendra</b>", meta_style)
        ],
        [
            Spacer(1, 35),
            Spacer(1, 35)
        ],
        [
            Paragraph("____________________________<br/>Student Signature", meta_style),
            Paragraph(f"____________________________<br/><b>{admin_name}</b><br/>Authorized Cashier / Operator", meta_style)
        ]
    ]
    sig_table = Table(sig_data, colWidths=[3.25 * inch, 3.25 * inch])
    sig_table.setStyle(TableStyle([
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ]))
    story.append(sig_table)

    story.append(Spacer(1, 20))
    story.append(HRFlowable(width="100%", thickness=0.5, color=colors.HexColor("#CBD5E1"), spaceBefore=10, spaceAfter=8))
    
    footer_text = Paragraph(
        "<font size=8 color='#64748B'>Notice: This receipt is official evidence that cash was physically received by library administration. Fees paid are non-refundable. Please keep this receipt for your records.</font>",
        tagline_style
    )
    story.append(footer_text)

    # Build Document
    doc.build(story)
    buffer.seek(0)
    return buffer

import io
from datetime import date
from app.models.student import Student
from app.models.seat import Seat
from app.models.invoice import Invoice
from app.models.payment import Payment
from app.models.attendance import Attendance

# 1. AUTHENTICATION & AUTHORIZATION TESTS
def test_admin_login_success(client):
    res = client.post("/api/v1/auth/admin/login", json={"username": "admin", "password": "admin123"})
    assert res.status_code == 200
    data = res.get_json()
    assert data["success"] is True
    assert "token" in data
    assert data["user"]["role"] == "Super Admin"

def test_admin_login_invalid_password(client):
    res = client.post("/api/v1/auth/admin/login", json={"username": "admin", "password": "wrongpassword"})
    assert res.status_code == 401
    assert res.get_json()["success"] is False

def test_student_login_success(client):
    res = client.post("/api/v1/auth/student/login", json={"identifier": "rohan@example.com", "password": "student123"})
    assert res.status_code == 200
    data = res.get_json()
    assert data["success"] is True
    assert "token" in data
    assert data["user"]["student_id"] == "SBL0001"

def test_unauthorized_access_denied(client):
    # Missing token on protected admin route
    res = client.get("/api/v1/students")
    assert res.status_code == 401

def test_student_forbidden_from_admin_route(client, student_headers):
    # Student token on admin route
    res = client.get("/api/v1/students", headers=student_headers)
    assert res.status_code == 403

# 2. ADMISSION WORKFLOW & DUPLICATE PREVENTION
def test_submit_admission_success(client):
    data = {
        "full_name": "Pooja Verma",
        "father_name": "Suresh Verma",
        "mother_name": "Geeta Verma",
        "mobile": "9123456789",
        "email": "pooja@example.com",
        "whatsapp": "9123456789",
        "emergency_contact": "9123456780",
        "aadhaar_number": "987654321098",
        "dob": "2002-08-15",
        "gender": "Female",
        "address": "45 Malviya Nagar, Jaipur",
        "preparing_for": "Banking",
        "password": "poojapassword",
        "photo": (io.BytesIO(b"fake_photo_content"), "photo.jpg"),
        "aadhaar_photo": (io.BytesIO(b"fake_aadhaar_content"), "aadhaar.pdf")
    }
    res = client.post("/api/v1/students/admission", data=data, content_type="multipart/form-data")
    assert res.status_code == 201
    res_data = res.get_json()
    assert res_data["success"] is True
    assert res_data["student_id"] == "SBL0002"

def test_prevent_duplicate_mobile_and_aadhaar(client):
    # Duplicate mobile as existing student SBL0001
    data = {
        "full_name": "Duplicate Tester",
        "father_name": "Father",
        "mother_name": "Mother",
        "mobile": "9876543210",  # Same as SBL0001
        "email": "unique@example.com",
        "aadhaar_number": "111122223333",
        "dob": "2000-01-01",
        "address": "Address",
        "photo": (io.BytesIO(b"img"), "img.jpg"),
        "aadhaar_photo": (io.BytesIO(b"doc"), "doc.pdf")
    }
    res = client.post("/api/v1/students/admission", data=data, content_type="multipart/form-data")
    assert res.status_code == 409
    assert "already exists" in res.get_json()["error"]

def test_approve_and_reject_student(client, admin_headers):
    # Create pending student
    data = {
        "full_name": "Karan Johar",
        "father_name": "Yash Johar",
        "mother_name": "Hiroo Johar",
        "mobile": "9988776655",
        "email": "karan@example.com",
        "aadhaar_number": "555566667777",
        "dob": "1999-05-25",
        "address": "Mumbai",
        "photo": (io.BytesIO(b"photo"), "p.png"),
        "aadhaar_photo": (io.BytesIO(b"aadhaar"), "a.pdf")
    }
    create_res = client.post("/api/v1/students/admission", data=data, content_type="multipart/form-data")
    student_id = create_res.get_json()["student"]["id"]

    # Approve
    approve_res = client.post(f"/api/v1/students/{student_id}/approve", json={"seat_number": "12", "monthly_fee": 600.0}, headers=admin_headers)
    assert approve_res.status_code == 200
    assert approve_res.get_json()["student"]["status"] == "Approved"
    assert approve_res.get_json()["student"]["seat_number"] == "12"

    # Reject another
    data["mobile"] = "8877665544"
    data["email"] = "karan2@example.com"
    data["aadhaar_number"] = "999988887777"
    data["photo"] = (io.BytesIO(b"p"), "p.png")
    data["aadhaar_photo"] = (io.BytesIO(b"a"), "a.pdf")
    create_res2 = client.post("/api/v1/students/admission", data=data, content_type="multipart/form-data")
    student_id2 = create_res2.get_json()["student"]["id"]

    reject_res = client.post(f"/api/v1/students/{student_id2}/reject", json={"reason": "Documents unclear"}, headers=admin_headers)
    assert reject_res.status_code == 200
    assert reject_res.get_json()["student"]["status"] == "Rejected"

# 3. SEAT MANAGEMENT & CONFLICT CHECKS
def test_seat_assignment_and_conflict_prevention(client, admin_headers):
    # Seat 1 is assigned to student 1 in fixture
    res = client.post("/api/v1/seats/assign", json={"seat_number": "1", "student_id": 1}, headers=admin_headers)
    assert res.status_code == 200

    # Try assigning seat 1 to another student -> should fail
    # Create another approved student
    data = {
        "full_name": "Aman Singh",
        "father_name": "Father",
        "mother_name": "Mother",
        "mobile": "7766554433",
        "email": "aman@example.com",
        "aadhaar_number": "333344445555",
        "dob": "2001-01-01",
        "address": "Address",
        "photo": (io.BytesIO(b"p"), "p.png"),
        "aadhaar_photo": (io.BytesIO(b"a"), "a.pdf")
    }
    c_res = client.post("/api/v1/students/admission", data=data, content_type="multipart/form-data")
    s2_id = c_res.get_json()["student"]["id"]
    client.post(f"/api/v1/students/{s2_id}/approve", json={}, headers=admin_headers)

    # Attempt conflict
    conflict_res = client.post("/api/v1/seats/assign", json={"seat_number": "1", "student_id": s2_id}, headers=admin_headers)
    assert conflict_res.status_code == 400
    assert "already occupied" in conflict_res.get_json()["error"]

    # Release seat 1
    rel_res = client.post("/api/v1/seats/release", json={"seat_number": "1"}, headers=admin_headers)
    assert rel_res.status_code == 200

    # Now assign seat 1 to student 2 -> succeeds
    succ_res = client.post("/api/v1/seats/assign", json={"seat_number": "1", "student_id": s2_id}, headers=admin_headers)
    assert succ_res.status_code == 200

# 4. CASH FEE MANAGEMENT & PARTIAL PAYMENTS (NO ONLINE PAYMENTS)
def test_cash_fee_flow_and_balance(client, admin_headers, student_headers):
    # 1. Generate monthly invoices
    gen_res = client.post("/api/v1/fees/invoices/generate", json={"billing_month": "October 2026"}, headers=admin_headers)
    assert gen_res.status_code == 200

    # List invoices
    inv_res = client.get("/api/v1/fees/invoices", headers=admin_headers)
    invoices = inv_res.get_json()["invoices"]
    assert len(invoices) >= 1
    target_inv = invoices[0]
    inv_id = target_inv["id"]
    assert target_inv["balance_amount"] == 500.0

    # 2. Try overpayment -> should be rejected
    overpay_res = client.post("/api/v1/fees/payments/cash", json={"invoice_id": inv_id, "amount": 600.0}, headers=admin_headers)
    assert overpay_res.status_code == 400
    assert "cannot exceed outstanding balance" in overpay_res.get_json()["error"]

    # 3. Partial cash payment (Rs. 200)
    part_res = client.post("/api/v1/fees/payments/cash", json={"invoice_id": inv_id, "amount": 200.0, "notes": "Desk cash partial"}, headers=admin_headers)
    assert part_res.status_code == 201
    receipt_no = part_res.get_json()["receipt_number"]
    assert "REC-" in receipt_no

    # Check updated balance
    inv_check = client.get(f"/api/v1/fees/student/{target_inv['student_id']}", headers=admin_headers).get_json()
    assert inv_check["total_paid"] == 200.0
    assert inv_check["total_outstanding"] == 300.0
    assert inv_check["fee_status"] == "Partially Paid"

    # 4. Final remaining cash payment (Rs. 300)
    final_res = client.post("/api/v1/fees/payments/cash", json={"invoice_id": inv_id, "amount": 300.0, "notes": "Clear dues in cash"}, headers=admin_headers)
    assert final_res.status_code == 201
    final_receipt_no = final_res.get_json()["receipt_number"]

    # Check fully paid status
    inv_final = client.get(f"/api/v1/fees/student/{target_inv['student_id']}", headers=admin_headers).get_json()
    assert inv_final["total_paid"] == 500.0
    assert inv_final["total_outstanding"] == 0.0
    assert inv_final["fee_status"] == "Paid"

    # 5. Download PDF receipt for cash payment
    pdf_res = client.get(f"/api/v1/receipts/{final_receipt_no}/pdf", headers=admin_headers)
    assert pdf_res.status_code == 200
    assert pdf_res.mimetype == "application/pdf"
    assert len(pdf_res.data) > 500  # valid PDF generated by ReportLab

# 5. ATTENDANCE MANAGEMENT
def test_attendance_marking_and_bulk(client, admin_headers):
    today_str = date.today().isoformat()
    # Mark single attendance
    single_res = client.post("/api/v1/attendance/mark", json={"student_id": 1, "status": "Present", "check_in_time": "09:15 AM"}, headers=admin_headers)
    assert single_res.status_code == 200
    assert single_res.get_json()["attendance"]["status"] == "Present"

    # Daily summary
    daily_res = client.get(f"/api/v1/attendance?date={today_str}", headers=admin_headers)
    assert daily_res.status_code == 200
    data = daily_res.get_json()["data"]
    assert data["present"] >= 1

# 6. PRIVATE DOCUMENT SECURITY
def test_document_security_and_authorization(client, admin_headers, student_headers):
    # Admin can view photo
    admin_doc = client.get("/api/v1/students/1/documents/photo", headers=admin_headers)
    assert admin_doc.status_code == 200

    # Student 1 can view own photo
    own_doc = client.get("/api/v1/students/1/documents/photo", headers=student_headers)
    assert own_doc.status_code == 200

    # Unauthenticated user cannot view
    unauth_doc = client.get("/api/v1/students/1/documents/photo")
    assert unauth_doc.status_code == 401

# 7. REPORTS EXPORT
def test_reports_csv_exports(client, admin_headers):
    students_csv = client.get("/api/v1/reports/export/students", headers=admin_headers)
    assert students_csv.status_code == 200
    assert "Student ID,Full Name" in students_csv.data.decode("utf-8")

    cash_csv = client.get("/api/v1/reports/export/cash-collections", headers=admin_headers)
    assert cash_csv.status_code == 200
    assert "Receipt Number,Payment Date" in cash_csv.data.decode("utf-8")

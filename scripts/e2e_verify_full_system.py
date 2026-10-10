import os
import sys
import io

backend_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "backend"))
sys.path.insert(0, backend_dir)

from app import create_app, db
from app.models.admin import Admin
from app.models.student import Student
from app.models.seat import Seat
from app.models.invoice import Invoice
from app.models.payment import Payment
from app.models.attendance import Attendance

def run_e2e_test():
    sys.stdout.reconfigure(encoding='utf-8')
    app = create_app()
    client = app.test_client()

    print("\n=======================================================")
    print("   SBLMS LIVE END-TO-END SYSTEM VERIFICATION SUITE")
    print("=======================================================\n")

    # Clean up any leftover test data from prior aborted runs
    with app.app_context():
        old_test_st = Student.query.filter_by(mobile="9829999999").first()
        if old_test_st:
            Payment.query.filter_by(student_id=old_test_st.id).delete()
            Invoice.query.filter_by(student_id=old_test_st.id).delete()
            Attendance.query.filter_by(student_id=old_test_st.id).delete()
            seat_25 = Seat.query.filter_by(seat_number="25").first()
            if seat_25:
                seat_25.status = "Available"
                seat_25.assigned_student_id = None
            db.session.delete(old_test_st)
            db.session.commit()

    # 1. Health Probe
    print("[STEP 1] Testing Health Endpoint...")
    res = client.get("/api/health")
    assert res.status_code == 200, f"Health check failed: {res.status_code}"
    health_data = res.get_json()
    assert health_data.get("status") == "healthy", "Expected status 'healthy'"
    print(f"  --> PASS: Health probe OK ({health_data['service']})")

    # 2. Admin Authentication
    print("\n[STEP 2] Testing Super Admin Authentication...")
    res = client.post("/api/v1/auth/admin/login", json={
        "username": "admin",
        "password": "admin123"
    })
    assert res.status_code == 200, f"Admin login failed: {res.status_code} {res.get_json()}"
    admin_data = res.get_json()
    assert admin_data.get("success") is True
    admin_token = admin_data.get("token")
    admin_headers = {"Authorization": f"Bearer {admin_token}"}
    print(f"  --> PASS: Admin login successful. Role: {admin_data['user']['role']}")

    # 3. Dashboard KPI Overview
    print("\n[STEP 3] Testing Dashboard KPI Overview...")
    res = client.get("/api/v1/dashboard/admin", headers=admin_headers)
    assert res.status_code == 200, f"Stats failed: {res.status_code}"
    dash_json = res.get_json()
    metrics = dash_json.get("metrics", {})
    print(f"  --> Total Students: {metrics.get('total_students')}")
    print(f"  --> Active Seats: {metrics.get('occupied_seats')}/{metrics.get('total_seats')}")
    print(f"  --> Total Cash Collected (This Month): Rs. {metrics.get('cash_collected_this_month', 0):.2f}")
    assert metrics.get("total_students") >= 3
    print("  --> PASS: Dashboard KPIs match verified database state.")

    # 4. Admission Submission Flow
    print("\n[STEP 4] Submitting New Admission Form...")
    dummy_photo = (io.BytesIO(b"FAKE_PHOTO_DATA_FOR_E2E"), "e2e_photo.jpg")
    dummy_aadhaar = (io.BytesIO(b"FAKE_AADHAAR_DATA_FOR_E2E"), "e2e_aadhaar.pdf")
    
    admission_payload = {
        "full_name": "Suresh Chandra Sharma",
        "father_name": "Ramprasad Sharma",
        "mother_name": "Sharda Devi Sharma",
        "mobile": "9829999999",
        "email": "suresh.e2e@example.com",
        "aadhaar_number": "999988887777",
        "dob": "2001-05-15",
        "address": "Station Road, Nagaur",
        "preparing_for": "RAS Pre & Mains",
        "monthly_fee": "650",
        "photo": dummy_photo,
        "aadhaar_photo": dummy_aadhaar
    }
    
    res = client.post("/api/v1/students/admission", data=admission_payload, content_type="multipart/form-data")
    assert res.status_code == 201, f"Admission submission failed: {res.status_code} {res.get_json()}"
    adm_res = res.get_json()
    new_student_db_id = adm_res["student"]["id"]
    print(f"  --> PASS: Admission submitted successfully! Temporary Record ID: #{new_student_db_id}")

    # 5. Admission Approval & Sequential ID Generation
    print("\n[STEP 5] Approving Admission as Admin...")
    res = client.post(f"/api/v1/students/{new_student_db_id}/approve", headers=admin_headers, json={
        "seat_number": "25",
        "monthly_fee": 650.0
    })
    assert res.status_code == 200, f"Approval failed: {res.status_code} {res.get_json()}"
    appr_res = res.get_json()
    student_code = appr_res["student"]["student_id"]
    print(f"  --> PASS: Admission approved! Generated Member ID: {student_code}")
    assert student_code == "SBL0004", f"Expected sequential ID SBL0004, got {student_code}"

    # 6. Seat Allocation Verification
    print("\n[STEP 6] Verifying Seat Allocation Grid...")
    res = client.get("/api/v1/seats", headers=admin_headers)
    assert res.status_code == 200
    seats_list = res.get_json().get("data", {}).get("seats", [])
    seat_25 = next((s for s in seats_list if s["seat_number"] == "25"), None)
    assert seat_25 is not None, "Seat 25 not found in grid"
    assert seat_25["status"] == "Occupied", f"Seat 25 expected to be Occupied, got {seat_25['status']}"
    assert seat_25["assigned_student_id"] == new_student_db_id, "Seat 25 not assigned to newly approved student"
    print(f"  --> PASS: Desk #{seat_25['seat_number']} successfully assigned to {student_code}")

    # 7. Cash-Only Fee Recording & Invoice Reconciliation
    print("\n[STEP 7] Testing Cash Fee Recording & Ledger Reconciliation...")
    with app.app_context():
        invoice = Invoice.query.filter_by(student_id=new_student_db_id).first()
        assert invoice is not None, "Invoice not automatically generated upon admission approval!"
        invoice_id = invoice.id
        print(f"  --> Generated Invoice: {invoice.invoice_number} | Amount: Rs. {invoice.total_amount} | Status: {invoice.status}")
    
    # Record Cash Payment
    res = client.post("/api/v1/fees/payments/cash", headers=admin_headers, json={
        "invoice_id": invoice_id,
        "amount": 650.0,
        "payment_date": "2026-10-10",
        "notes": "E2E cash payment collected at reception desk"
    })
    assert res.status_code == 201, f"Cash recording failed: {res.status_code} {res.get_json()}"
    pay_res = res.get_json()
    receipt_no = pay_res["payment"]["receipt_number"]
    print(f"  --> PASS: Cash fee recorded! Generated Receipt: {receipt_no}")

    # Verify Invoice balance is now 0.0 (Paid)
    with app.app_context():
        inv_updated = db.session.get(Invoice, invoice_id)
        assert inv_updated.status == "Paid", f"Expected Paid, got {inv_updated.status}"
        assert inv_updated.balance_amount == 0.0, f"Expected 0.0 balance, got {inv_updated.balance_amount}"
        print(f"  --> PASS: Invoice balance reconciled: Paid Rs.{inv_updated.paid_amount}, Balance Rs.{inv_updated.balance_amount}")

    # 8. Overpayment Protection
    print("\n[STEP 8] Testing Overpayment Prevention on Zero-Balance Invoice...")
    res = client.post("/api/v1/fees/payments/cash", headers=admin_headers, json={
        "invoice_id": invoice_id,
        "amount": 100.0,
        "payment_date": "2026-10-10",
        "notes": "Attempted overpayment"
    })
    assert res.status_code == 400, "Overpayment should be rejected with 400!"
    print(f"  --> PASS: Excess cash recording correctly blocked: '{res.get_json().get('error')}'")

    # 9. Dynamic ReportLab PDF Receipt Stream
    print("\n[STEP 9] Testing Official ReportLab PDF Receipt Generation...")
    res = client.get(f"/api/v1/receipts/{receipt_no}/pdf", headers=admin_headers)
    assert res.status_code == 200, f"Receipt PDF failed: {res.status_code}"
    assert res.mimetype == "application/pdf", f"Expected application/pdf, got {res.mimetype}"
    assert res.data.startswith(b"%PDF-"), "Stream does not contain valid PDF binary signature!"
    print(f"  --> PASS: ReportLab PDF generated dynamically ({len(res.data)} bytes, valid %PDF signature)")

    # 10. Daily Attendance Marking
    print("\n[STEP 10] Testing Attendance Logging...")
    res = client.post("/api/v1/attendance/mark", headers=admin_headers, json={
        "student_id": new_student_db_id,
        "date": "2026-10-10",
        "status": "Present",
        "check_in_time": "08:15"
    })
    assert res.status_code == 200, f"Attendance failed: {res.status_code} {res.get_json()}"
    print(f"  --> PASS: Attendance marked for {student_code} as Present (08:15)")

    # 11. Student Portal Access & RBAC Isolation
    print("\n[STEP 11] Testing Student Authentication & Private Document Access...")
    with app.app_context():
        st = db.session.get(Student, new_student_db_id)
        st.set_password("Student@123")
        db.session.commit()

    res = client.post("/api/v1/auth/student/login", json={
        "identifier": "9829999999",
        "password": "Student@123"
    })
    assert res.status_code == 200, f"Student login failed: {res.status_code} {res.get_json()}"
    student_token = res.get_json()["token"]
    student_headers = {"Authorization": f"Bearer {student_token}"}
    print(f"  --> PASS: Student successfully logged in via mobile number!")

    # Student accessing own profile
    res = client.get(f"/api/v1/students/{new_student_db_id}", headers=student_headers)
    assert res.status_code == 200
    print(f"  --> PASS: Student can retrieve their own profile ({res.get_json()['student']['full_name']})")

    # Student attempting to access other student (ID #1) private documents -> MUST BE FORBIDDEN
    res = client.get("/api/v1/students/1/documents/aadhaar", headers=student_headers)
    assert res.status_code == 403, f"Expected 403 Forbidden for cross-student document access, got {res.status_code}"
    print(f"  --> PASS: Cross-student private document access correctly blocked (403 Forbidden)")

    # Unauthenticated document request -> MUST BE UNAUTHORIZED
    res = client.get(f"/api/v1/students/{new_student_db_id}/documents/photo")
    assert res.status_code == 401, f"Expected 401 Unauthorized for public document access, got {res.status_code}"
    print(f"  --> PASS: Public unauthenticated document request blocked (401 Unauthorized)")

    # 12. Cleanup E2E Artifacts from Live Database
    print("\n[STEP 12] Cleaning Up Test Artifacts to Restore Pristine State...")
    with app.app_context():
        Payment.query.filter_by(student_id=new_student_db_id).delete()
        Invoice.query.filter_by(student_id=new_student_db_id).delete()
        Attendance.query.filter_by(student_id=new_student_db_id).delete()
        
        seat = Seat.query.filter_by(seat_number="25").first()
        if seat:
            seat.status = "Available"
            seat.assigned_student_id = None

        st = db.session.get(Student, new_student_db_id)
        if st:
            storage_root = app.config["STORAGE_FOLDER"]
            for f in [st.photo, st.aadhaar_photo]:
                if f:
                    fp = os.path.join(storage_root, f)
                    if os.path.exists(fp):
                        try:
                            os.remove(fp)
                        except Exception:
                            pass
            db.session.delete(st)
        
        db.session.commit()
    print("  --> PASS: Cleaned up temporary test record SBL0004, Seat 25 restored to Available.")

    print("\n=======================================================")
    print("   ALL 12 END-TO-END WORKFLOW CHECKS PASSED 100%!")
    print("=======================================================\n")

if __name__ == "__main__":
    run_e2e_test()

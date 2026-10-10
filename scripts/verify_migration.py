import os
import sys

backend_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "backend"))
sys.path.insert(0, backend_dir)

from app import create_app
from app.models.admin import Admin
from app.models.student import Student
from app.models.seat import Seat
from app.models.invoice import Invoice
from app.models.payment import Payment

def verify():
    sys.stdout.reconfigure(encoding='utf-8')
    app = create_app()
    with app.app_context():
        print("=== VERIFYING SBLMS MIGRATION RESULTS ===")
        
        # 1. Admin verification
        admin_count = Admin.query.count()
        admin = Admin.query.filter_by(username="admin").first()
        assert admin_count >= 1, "Verification failed: No admin account found!"
        assert admin is not None, "Verification failed: 'admin' user not found!"
        assert admin.check_password("admin123"), "Verification failed: Admin password check failed!"
        print(f"[OK] Admin Account: Verified '{admin.username}' ({admin.role}), password hash valid.")

        # 2. Students verification
        students = Student.query.order_by(Student.id.asc()).all()
        assert len(students) >= 3, f"Verification failed: Expected >= 3 students, found {len(students)}"
        
        expected_students = {
            1: {"student_id": "SBL0001", "seat": "9", "fee": 549.0},
            2: {"student_id": "SBL0002", "seat": "2", "fee": 525.0},
            3: {"student_id": "SBL0003", "seat": "5", "fee": 500.0},
        }

        storage_root = app.config["STORAGE_FOLDER"]
        for s in students:
            exp = expected_students.get(s.id)
            if exp:
                assert s.student_id == exp["student_id"], f"Mismatch for Student #{s.id} ID"
                assert s.seat_number == exp["seat"], f"Mismatch for Student #{s.id} Seat"
                assert s.monthly_fee == exp["fee"], f"Mismatch for Student #{s.id} Fee"
                assert s.status == "Approved", f"Expected Approved status for #{s.id}"
                
                # Check private documents exist in storage
                photo_file = os.path.join(storage_root, s.photo)
                aadhaar_file = os.path.join(storage_root, s.aadhaar_photo)
                assert os.path.exists(photo_file), f"Private photo missing for {s.student_id}: {photo_file}"
                assert os.path.exists(aadhaar_file), f"Private Aadhaar missing for {s.student_id}: {aadhaar_file}"
                
                print(f"[OK] Student {s.student_id}: {s.full_name} | Seat: {s.seat_number} | Fee: Rs.{s.monthly_fee} | Docs Verified on Disk.")

        # 3. Seats verification
        total_seats = Seat.query.count()
        occupied_seats = Seat.query.filter_by(status="Occupied").count()
        assert total_seats >= 120, f"Expected at least 120 seats, found {total_seats}"
        assert occupied_seats >= 3, f"Expected at least 3 occupied seats, found {occupied_seats}"
        print(f"[OK] Seats: {total_seats} total capacity, {occupied_seats} correctly occupied.")

        # 4. Invoices & Payments verification
        payments = Payment.query.all()
        assert len(payments) >= 3, f"Expected at least 3 payment records, found {len(payments)}"
        total_cash = sum(p.amount for p in payments)
        assert total_cash == 1574.0, f"Expected total cash 1574.0 (525+549+500), got {total_cash}"
        
        invoices = Invoice.query.all()
        assert len(invoices) >= 3, f"Expected at least 3 invoices, found {len(invoices)}"
        for inv in invoices:
            assert inv.status == "Paid", f"Invoice {inv.invoice_number} expected to be Paid"
            assert inv.balance_amount == 0.0, f"Invoice {inv.invoice_number} balance expected to be 0.0"

        print(f"[OK] Fee History: {len(invoices)} invoices & {len(payments)} cash receipts verified. Total Cash Recorded: Rs. {total_cash:.2f}")
        print("\n=== ALL MIGRATION INTEGRITY CHECKS PASSED 100% ===")

if __name__ == "__main__":
    verify()

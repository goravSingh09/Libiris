import os
import sys
import shutil
import sqlite3
from datetime import datetime, date

# Add backend directory to sys.path so we can import app modules
backend_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "backend"))
sys.path.insert(0, backend_dir)

from app import create_app
from app.models.db import db
from app.models.admin import Admin
from app.models.student import Student
from app.models.seat import Seat
from app.models.invoice import Invoice
from app.models.payment import Payment
from app.services.seat_service import ensure_seats_initialized

def run_migration():
    host_db_path = r"C:\Users\gorav singh\Documents\linux world traning\SBLMS\library.db"
    host_uploads_dir = r"C:\Users\gorav singh\Documents\linux world traning\SBLMS\static\uploads"

    backup_root = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "backups", "legacy_backup_20261010"))
    backup_db_path = os.path.join(backup_root, "library.db")
    backup_uploads_dir = os.path.join(backup_root, "documents")

    if os.path.exists(host_db_path):
        legacy_db_path = host_db_path
        legacy_uploads_dir = host_uploads_dir
    elif os.path.exists(backup_db_path):
        legacy_db_path = backup_db_path
        legacy_uploads_dir = backup_uploads_dir
    else:
        raise FileNotFoundError(f"Neither legacy database ({host_db_path}) nor backup database ({backup_db_path}) found.")

    app = create_app()
    with app.app_context():
        print("Creating modern database tables...")
        db.create_all()
        ensure_seats_initialized(120)

        conn = sqlite3.connect(legacy_db_path)
        conn.row_factory = sqlite3.Row
        cur = conn.cursor()

        storage_root = app.config["STORAGE_FOLDER"]
        os.makedirs(os.path.join(storage_root, "photos"), exist_ok=True)
        os.makedirs(os.path.join(storage_root, "aadhaar"), exist_ok=True)

        print("\n--- 1. Migrating Admins ---")
        cur.execute("SELECT * FROM admins")
        legacy_admins = cur.fetchall()
        for la in legacy_admins:
            existing = Admin.query.filter_by(username=la["username"]).first()
            if not existing:
                admin = Admin(
                    id=la["id"],
                    full_name=la["full_name"],
                    username=la["username"],
                    password_hash=la["password"],  # Preserves exact Werkzeug hash
                    role=la["role"] or "Super Admin",
                    is_active=bool(la["is_active"])
                )
                db.session.add(admin)
                print(f"Migrated Admin: {la['username']} ({la['role']})")
        db.session.commit()

        print("\n--- 2. Migrating Students & Private Documents ---")
        cur.execute("SELECT * FROM students")
        legacy_students = cur.fetchall()
        for ls in legacy_students:
            existing = Student.query.filter_by(student_id=ls["student_id"]).first()
            if not existing:
                # Handle dates safely
                dob = datetime.strptime(ls["dob"], "%Y-%m-%d").date() if ls["dob"] else date(2000, 1, 1)
                joining = datetime.strptime(ls["joining_date"], "%Y-%m-%d").date() if ls["joining_date"] else date.today()

                # Clean photo & aadhaar relative paths
                photo_rel = ls["photo"].replace("\\", "/").replace("uploads/", "")
                aadhaar_rel = ls["aadhaar_photo"].replace("\\", "/").replace("uploads/", "")

                # Copy files into private storage if they exist in legacy
                legacy_photo_src = os.path.join(legacy_uploads_dir, photo_rel)
                legacy_aadhaar_src = os.path.join(legacy_uploads_dir, aadhaar_rel)

                target_photo_dst = os.path.join(storage_root, photo_rel)
                target_aadhaar_dst = os.path.join(storage_root, aadhaar_rel)

                if os.path.exists(legacy_photo_src):
                    os.makedirs(os.path.dirname(target_photo_dst), exist_ok=True)
                    shutil.copy2(legacy_photo_src, target_photo_dst)

                if os.path.exists(legacy_aadhaar_src):
                    os.makedirs(os.path.dirname(target_aadhaar_dst), exist_ok=True)
                    shutil.copy2(legacy_aadhaar_src, target_aadhaar_dst)

                student = Student(
                    id=ls["id"],
                    student_id=ls["student_id"],
                    full_name=ls["full_name"],
                    father_name=ls["father_name"],
                    mother_name=ls["mother_name"],
                    mobile=ls["mobile"],
                    email=ls["email"],
                    password_hash=ls["password_hash"],  # Safe preservation of existing hashes
                    whatsapp=ls["whatsapp"] or ls["mobile"],
                    emergency_contact=ls["emergency_contact"] or ls["mobile"],
                    aadhaar_number=ls["aadhaar_number"],
                    dob=dob,
                    gender=ls["gender"],
                    address=ls["address"],
                    preparing_for=ls["preparing_for"],
                    photo=photo_rel,
                    aadhaar_photo=aadhaar_rel,
                    seat_number=ls["seat_number"],
                    monthly_fee=float(ls["monthly_fee"] or 500.0),
                    fee_status=ls["fee_status"] or "Pending",
                    status=ls["status"] or "Approved",
                    joining_date=joining
                )
                db.session.add(student)
                print(f"Migrated Student #{student.id}: {student.student_id} - {student.full_name} (Seat {student.seat_number})")
        db.session.commit()

        print("\n--- 3. Synchronizing Seat Allocations ---")
        for s in Student.query.filter(Student.seat_number.isnot(None)).all():
            seat = Seat.query.filter_by(seat_number=str(s.seat_number)).first()
            if seat:
                seat.assigned_student_id = s.id
                seat.status = "Occupied"
                print(f"Linked Seat {seat.seat_number} -> Student {s.student_id} ({s.full_name})")
        db.session.commit()

        print("\n--- 4. Migrating Historical Fee Payments & Generating Invoices/Receipts ---")
        cur.execute("SELECT * FROM fee_payments")
        legacy_payments = cur.fetchall()
        for lp in legacy_payments:
            s_id = lp["student_id"]
            student = Student.query.get(s_id)
            if not student:
                continue

            p_month = lp["payment_month"] or "August 2026"
            p_date = datetime.strptime(lp["payment_date"], "%Y-%m-%d").date() if lp["payment_date"] else date.today()
            amt = float(lp["amount"] or 500.0)

            # Check/create corresponding Invoice
            inv = Invoice.query.filter_by(student_id=s_id, billing_month=p_month).first()
            if not inv:
                inv_num = f"INV-{p_date.strftime('%Y%m')}-{student.student_id}"
                inv = Invoice(
                    invoice_number=inv_num,
                    student_id=s_id,
                    billing_month=p_month,
                    due_date=p_date,
                    total_amount=amt,
                    paid_amount=amt,
                    balance_amount=0.0,
                    status="Paid"
                )
                db.session.add(inv)
                db.session.flush()

            # Check/create Payment record
            rec_num = f"REC-{p_date.strftime('%Y%m')}-{lp['id']:04d}"
            existing_payment = Payment.query.filter_by(receipt_number=rec_num).first()
            if not existing_payment:
                payment = Payment(
                    id=lp["id"],
                    receipt_number=rec_num,
                    invoice_id=inv.id,
                    student_id=s_id,
                    admin_id=1,
                    amount=amt,
                    payment_method="Cash",
                    payment_date=p_date,
                    notes="Legacy cash payment imported from historical record"
                )
                db.session.add(payment)
                print(f"Migrated Cash Payment: {rec_num} for {student.student_id} ({p_month}, Rs. {amt})")

        db.session.commit()
        conn.close()
        print("\n=== MIGRATION COMPLETED SUCCESSFULLY ===")

if __name__ == "__main__":
    run_migration()

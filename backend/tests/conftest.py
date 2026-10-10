import os
import sys
import shutil
import pytest

# Ensure backend directory is in python path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app import create_app
from app.config import TestConfig
from app.models.db import db
from app.models.admin import Admin
from app.models.student import Student
from app.services.seat_service import ensure_seats_initialized
from app.services.auth_service import create_access_token
from datetime import date

@pytest.fixture
def app():
    test_storage = os.path.join(os.path.dirname(__file__), "test_storage")
    os.makedirs(os.path.join(test_storage, "photos"), exist_ok=True)
    os.makedirs(os.path.join(test_storage, "aadhaar"), exist_ok=True)

    app = create_app(TestConfig)
    app.config["STORAGE_FOLDER"] = test_storage

    with app.app_context():
        db.create_all()
        ensure_seats_initialized(120)

        # Create test super admin
        admin = Admin(
            full_name="Test Super Admin",
            username="admin",
            email="admin@sblms.library",
            role="Super Admin",
            is_active=True
        )
        admin.set_password("admin123")
        db.session.add(admin)

        # Create test student
        student = Student(
            student_id="SBL0001",
            full_name="Rohan Sharma",
            father_name="Rajesh Sharma",
            mother_name="Sunita Sharma",
            mobile="9876543210",
            email="rohan@example.com",
            whatsapp="9876543210",
            emergency_contact="9876543211",
            aadhaar_number="123456789012",
            dob=date(2001, 5, 10),
            gender="Male",
            address="123 Civil Lines, Jaipur",
            preparing_for="UPSC",
            photo="photos/test_photo.jpg",
            aadhaar_photo="aadhaar/test_aadhaar.pdf",
            seat_number="1",
            monthly_fee=500.0,
            fee_status="Pending",
            status="Approved",
            joining_date=date.today()
        )
        student.set_password("student123")
        db.session.add(student)

        # Create sample files in test_storage
        with open(os.path.join(test_storage, "photos", "test_photo.jpg"), "w") as f:
            f.write("fake_photo_data")
        with open(os.path.join(test_storage, "aadhaar", "test_aadhaar.pdf"), "w") as f:
            f.write("fake_aadhaar_data")

        db.session.commit()
        yield app

        db.session.remove()
        db.drop_all()
        shutil.rmtree(test_storage, ignore_errors=True)

@pytest.fixture
def client(app):
    return app.test_client()

@pytest.fixture
def admin_headers(app):
    with app.app_context():
        admin = Admin.query.filter_by(username="admin").first()
        token = create_access_token(admin.id, "admin", admin.role, admin.full_name)
        return {"Authorization": f"Bearer {token}"}

@pytest.fixture
def student_headers(app):
    with app.app_context():
        student = Student.query.filter_by(student_id="SBL0001").first()
        token = create_access_token(student.id, "student", "Student", student.full_name)
        return {"Authorization": f"Bearer {token}"}

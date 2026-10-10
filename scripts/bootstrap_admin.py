import os
import sys
import getpass

backend_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "backend"))
sys.path.insert(0, backend_dir)

from app import create_app
from app.models.db import db
from app.models.admin import Admin

def bootstrap():
    app = create_app()
    with app.app_context():
        db.create_all()
        admin = Admin.query.filter_by(username="admin").first()
        if admin:
            print(f"Super Admin 'admin' already exists (Role: {admin.role}, Active: {admin.is_active}).")
            choice = input("Do you want to reset password? (y/N): ").strip().lower()
            if choice == "y":
                new_pwd = getpass.getpass("Enter new password: ")
                admin.set_password(new_pwd)
                db.session.commit()
                print("Super Admin password updated successfully.")
        else:
            pwd = os.environ.get("INITIAL_ADMIN_PASSWORD") or getpass.getpass("Enter Super Admin password: ")
            admin = Admin(
                full_name="System Administrator",
                username="admin",
                email="admin@sblms.library",
                role="Super Admin",
                is_active=True
            )
            admin.set_password(pwd)
            db.session.add(admin)
            db.session.commit()
            print("Super Admin created successfully!")

if __name__ == "__main__":
    bootstrap()

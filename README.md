# SBLMS — Shree Bala Ji Adhyayan Kendra Library Management System

[![React](https://img.shields.io/badge/Frontend-React%2018%20%7C%20TypeScript%20%7C%20Vite-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind%20CSS-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Python](https://img.shields.io/badge/Backend-Python%203%20%7C%20Flask%203.1-3776AB?logo=python&logoColor=white)](https://flask.palletsprojects.com/)
[![SQLAlchemy](https://img.shields.io/badge/ORM-SQLAlchemy%202.0-red)](https://www.sqlalchemy.org/)
[![Database](https://img.shields.io/badge/Database-SQLite%20%28Dev%29%20%7C%20PostgreSQL%20%28Prod%29-336791?logo=postgresql&logoColor=white)](https://postgresql.org/)
[![ReportLab](https://img.shields.io/badge/PDF%20Engine-ReportLab%205.0-blue)](https://www.reportlab.com/)
[![Pytest](https://img.shields.io/badge/Testing-Pytest%20%28100%25%20Passed%29-0A9EDC?logo=pytest&logoColor=white)](https://pytest.org/)

A full-stack, enterprise-grade Library Management System custom-engineered for **Shree Bala Ji Adhyayan Kendra Library**, located at Opp. Mali Samaj, Hari Om Market, Didwana Road, Nagaur (Rajasthan).

---

## 🏛️ System Overview

**SBLMS** streamlines library operations, administrative governance, and student self-service across a 120-seat physical study facility:
- **Public Portal**: Showcase library amenities (air conditioning, high-speed fiber Wi-Fi, CCTV, purified RO water, parking), real hours (5:00 AM – 10:00 PM), and online admission registration with multi-file uploads.
- **Admin Command Center**: Real-time KPI cards, Recharts cash collection and attendance trends, interactive 120-desk seat allocation grid, admission reviews, daily bulk attendance, auditable fee management, CSV report exports, and audit logging.
- **Strict Cash-Only Fee Management**: Complies strictly with cash-at-desk operating requirements—**zero external payment gateways, zero QR verification, zero checkout integrations**. Invoices track total, paid, and outstanding balances. Admins record cash receipts, generating official ReportLab PDF receipts on demand.
- **Student Portal**: Secure member credential activation, attendance calendar with monthly percentages, fee ledger with one-click PDF cash receipt downloads, and profile management.
- **Private Document Vault**: Private storage of Aadhaar documents and student photos outside public web roots with JWT-authenticated streaming.
- **Legacy Migration & Preservation**: Bit-for-bit backup with SHA-256 validation of the original SQLite database (`library.db`), existing student profiles, password hashes, desk assignments, and 62 uploaded verification documents.

---

## 📐 Architecture & Monorepo Structure

```text
webbuild/
├── frontend/                       # React 18 + TypeScript + Vite + Tailwind SPA
│   ├── public/                     # Static assets (logo.png, banner.png)
│   ├── src/
│   │   ├── components/layout/      # Navbar, AdminLayout (sidebar + desk stats), StudentLayout
│   │   ├── context/                # AuthContext (JWT session management, RBAC)
│   │   ├── pages/
│   │   │   ├── public/             # LandingPage, AdmissionPage, AdminLoginPage, StudentLoginPage, ForgotPasswordPage
│   │   │   ├── admin/              # AdminDashboard, AdmissionsManagement, SeatMap, FeeManagement, 
│   │   │   │                       # StudentsManagement, AttendanceManagement, Reports, AuditLogs
│   │   │   └── student/            # StudentDashboard, StudentFees, StudentAttendance, StudentProfile
│   │   ├── services/               # api.ts (Axios/fetch client with JWT headers & error handling)
│   │   ├── types/                  # sblms.ts (Complete TypeScript schema definitions)
│   │   └── utils/                  # seo.ts (Dynamic meta tags & Schema.org JSON-LD)
│   ├── index.html                  # SEO-optimized entry with SBLMS branding & structured data
│   ├── package.json
│   └── vite.config.ts
├── backend/                        # Python Flask REST API
│   ├── app/
│   │   ├── config.py               # Multi-environment config (SQLite dev / PostgreSQL prod)
│   │   ├── models/                 # SQLAlchemy ORM (Admin, Student, Seat, Invoice, Payment, Attendance, AuditLog)
│   │   ├── routes/                 # Blueprints (auth, students, documents, seats, fees, receipts, attendance, reports, dashboard, health)
│   │   ├── services/               # Business logic (auth, student IDs, seat grid, cash fees, ReportLab PDF, attendance, reports, audit)
│   │   └── __init__.py             # Flask application factory with CORS, error handlers, and DB initialization
│   ├── data/                       # Local SQLite persistent storage (sblms.db)
│   ├── storage/uploads/            # Private student documents (photos & Aadhaar scans)
│   ├── tests/                      # Automated test suite (test_all_features.py, conftest.py)
│   ├── requirements.txt            # Python dependencies (Flask, SQLAlchemy, ReportLab, pytest, gunicorn, etc.)
│   ├── run.py                      # Local development server entry (Port 5000)
│   └── wsgi.py                     # Production WSGI entry for Gunicorn
├── backups/                        # Legacy database and document backups with SHA-256 manifests
│   └── legacy_backup_20261010/     # Original library.db, documents, and manifest
├── scripts/                        # Operational scripts
│   ├── backup_legacy.py            # Automated backup utility
│   ├── migrate_legacy.py           # Legacy database migration pipeline
│   ├── verify_migration.py         # 100% data integrity validation script
│   └── bootstrap_admin.py          # Super Admin creation utility
├── render.yaml                     # Render.com Python backend deployment specification
├── vercel.json                     # Vercel SPA routing and header configuration
└── package.json                    # Monorepo command runner
```

---

## 🔒 Security & Privacy Controls

1. **Role-Based Access Control (RBAC)**:
   - Super Admin & Admin JWT tokens access management routes.
   - Student tokens are restricted strictly to their own student ID endpoints (`/api/v1/students/<id>/*`).
2. **Private Document Storage**:
   - Uploaded Aadhaar cards and photos are saved in `backend/storage/uploads/` (outside any public web folder).
   - Served exclusively via `/api/v1/students/<id>/documents/<doc_type>` which validates JWT ownership or administrative role.
3. **Password Security**:
   - Passwords hashed using PBKDF2 with SHA-256 salt via Werkzeug security.
   - Legacy hashes from original database preserved bit-for-bit.
4. **Audit Logging**:
   - All critical actions (admissions, seat allocations, cash fee recordings, and payment reversals) are permanently recorded in `AuditLog` with actor ID, IP address, and before/after payloads.

---

## 💵 Strict Cash-Only Fee Architecture

In accordance with institutional guidelines:
- **No Online Payment Gateways**: Razorpay, Stripe, and checkout buttons are completely excluded.
- **Cash Recording**: Authorized administrators record physical cash payments against invoices.
- **Invoice Balance Tracking**: The system calculates `paid_amount` and `balance_amount` automatically. Overpayments beyond the invoice balance are rejected.
- **Auditable Reversals**: Payments can be reversed by administrators with a mandatory reason note, immediately recalculating the invoice status and logging an audit entry.
- **Official PDF Receipts**: Generated dynamically using ReportLab with the official library header, student registration number, desk number, amount in Indian Rupees, payment mode (Cash), and cashier signature line.

---

## 🚀 Local Development Setup

### 1. Prerequisites
- **Python**: 3.10+ (tested on Python 3.13)
- **Node.js**: 18+ (tested on Node v24)
- **npm**: 9+

### 2. Backend Setup
```bash
# Navigate to backend directory
cd backend

# Create and activate virtual environment (optional but recommended)
python -m venv venv
# Windows:
.\venv\Scripts\activate
# Linux/macOS:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run database setup & bootstrap admin (if starting fresh)
python ../scripts/bootstrap_admin.py

# Start Flask development server (runs on http://localhost:5000)
python run.py
```

### 3. Frontend Setup
```bash
# In a separate terminal, navigate to frontend directory
cd frontend

# Install Node modules
npm install

# Start Vite dev server (runs on http://localhost:5173)
npm run dev
```

### 4. Running Concurrently from Root
From the repository root:
```bash
npm install
npm run dev
```

---

## 🧪 Testing & Quality Assurance

Run the comprehensive automated test suite:
```bash
pytest backend/tests -v
```

### Test Coverage Highlights
| Test Area | Description | Status |
|:---|:---|:---:|
| `test_health_check` | Health check probe `/api/health` returns status healthy | ✅ PASSED |
| `test_admin_login_success` | Super admin login with JWT issuance | ✅ PASSED |
| `test_admin_login_invalid_credentials` | Brute force/bad password rejection | ✅ PASSED |
| `test_submit_admission` | Multi-field admission form submission with document validation | ✅ PASSED |
| `test_duplicate_admission_prevention` | Prevents duplicate applications with same mobile | ✅ PASSED |
| `test_admin_approve_admission` | Approval allocates unique sequential `SBLxxxx` ID | ✅ PASSED |
| `test_seat_allocation_and_release` | Grid validation, occupancy assignment, and seat release | ✅ PASSED |
| `test_record_cash_payment` | Physical cash recording, invoice balance reconciliation, receipt generation | ✅ PASSED |
| `test_prevent_overpayment` | Validates cash amount does not exceed invoice balance | ✅ PASSED |
| `test_receipt_pdf_generation` | Validates ReportLab PDF stream with valid `%PDF` signature | ✅ PASSED |
| `test_attendance_logging` | Daily attendance recording and monthly percentage calculation | ✅ PASSED |
| `test_private_document_access_control`| Validates unauthorized document stream blocking | ✅ PASSED |
| `test_generate_students_csv_report` | CSV export of student directory with valid headers | ✅ PASSED |

---

## 🌐 Production Deployment

### Backend (Render.com)
The included `render.yaml` automates the Python backend and PostgreSQL deployment:
1. Connect your GitHub repository to Render.
2. Render creates:
   - A Web Service (`sblms-backend`) running `gunicorn wsgi:app`.
   - A PostgreSQL Database (`sblms-postgres`).
3. Set environment variables:
   - `FRONTEND_URL`: Your deployed frontend domain (e.g. `https://sblms.vercel.app`).
   - `JWT_SECRET_KEY`: Secure random string.
   - `SECRET_KEY`: Secure random string.

### Frontend (Vercel)
The included `vercel.json` configures single-page application routing and caching:
1. Import repository on Vercel.
2. Root Directory: `frontend` (or project root with output directory `frontend/dist`).
3. Environment Variable:
   - `VITE_API_URL`: Your Render backend URL (e.g. `https://sblms-backend.onrender.com/api/v1`).
4. Deploy.

---

## 📍 Contact & Institution Details

- **Institution**: Shree Bala Ji Adhyayan Kendra Library
- **Address**: Opp. Mali Samaj, Hari Om Market, Didwana Road, Nagaur (Rajasthan) — 341001
- **Phones**: +91 9413402116 / +91 8290167664
- **Email**: shreebalajilibrary2116@gmail.com
- **Operating Hours**: 5:00 AM – 10:00 PM (Monday through Sunday)

---

## 📄 License
This project is proprietary and built exclusively for Shree Bala Ji Adhyayan Kendra Library. All rights reserved.

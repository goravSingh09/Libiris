import os
from datetime import timedelta
from dotenv import load_dotenv

# Load .env if present
load_dotenv()

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))

class Config:
    SECRET_KEY = os.environ.get("SECRET_KEY", "sblms_dev_secret_key_2026_super_secure")
    JWT_SECRET_KEY = os.environ.get("JWT_SECRET_KEY", "sblms_jwt_secret_2026_shree_balaji")
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=int(os.environ.get("JWT_EXPIRATION_HOURS", 24)))

    # Database: Use DATABASE_URL or POSTGRES_URL if provided (e.g. Postgres on Render/Heroku/Railway), otherwise local SQLite
    database_url = os.environ.get("DATABASE_URL") or os.environ.get("POSTGRES_URL")
    if database_url and not database_url.startswith(("mongodb://", "mongodb+srv://")):
        if database_url.startswith("postgres://"):
            database_url = database_url.replace("postgres://", "postgresql://", 1)
        SQLALCHEMY_DATABASE_URI = database_url
    else:
        db_dir = os.path.join(BASE_DIR, "data")
        os.makedirs(db_dir, exist_ok=True)
        SQLALCHEMY_DATABASE_URI = f"sqlite:///{os.path.join(db_dir, 'sblms.db')}"

    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_ENGINE_OPTIONS = {
        "pool_pre_ping": True,
    }

    # Private document storage - strictly separate from public assets
    STORAGE_FOLDER = os.environ.get("STORAGE_FOLDER", os.path.join(BASE_DIR, "storage", "uploads"))
    MAX_CONTENT_LENGTH = 10 * 1024 * 1024  # 10 MB limit
    ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "pdf"}

    # Library defaults
    LIBRARY_NAME = "Shree Bala Ji Adhyayan Kendra Library"
    DEFAULT_CAPACITY = 120
    DEFAULT_MONTHLY_FEE = 500.0

    # SMTP Configuration for email notifications & password reset
    SMTP_HOST = os.environ.get("SMTP_HOST", "")
    SMTP_PORT = int(os.environ.get("SMTP_PORT", 587))
    SMTP_USER = os.environ.get("SMTP_USER", "")
    SMTP_PASSWORD = os.environ.get("SMTP_PASSWORD", "")
    SMTP_USE_TLS = os.environ.get("SMTP_USE_TLS", "true").lower() in ("true", "1", "t")
    SMTP_DEFAULT_SENDER = os.environ.get("SMTP_DEFAULT_SENDER", "noreply@sblms.library")

    # CORS
    CORS_ORIGINS = os.environ.get(
        "CORS_ORIGINS",
        "http://localhost:5173,http://localhost:3000,http://127.0.0.1:5173,https://libiris-digital.vercel.app"
    ).split(",")

class TestConfig(Config):
    TESTING = True
    SQLALCHEMY_DATABASE_URI = "sqlite:///:memory:"
    STORAGE_FOLDER = os.path.join(BASE_DIR, "tests", "temp_storage")

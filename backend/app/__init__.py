import os
from flask import Flask, jsonify
from flask_cors import CORS
from app.config import Config
from app.models.db import db
from app.routes.auth import auth_bp
from app.routes.students import students_bp
from app.routes.documents import documents_bp
from app.routes.seats import seats_bp
from app.routes.fees import fees_bp
from app.routes.receipts import receipts_bp
from app.routes.attendance import attendance_bp
from app.routes.reports import reports_bp
from app.routes.dashboard import dashboard_bp
from app.routes.health import health_bp

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    # Initialize CORS
    CORS(app, resources={
        r"/api/*": {
            "origins": "*",  # Allow configured origins or * in dev
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization", "X-Requested-With"]
        }
    })

    # Initialize Database
    db.init_app(app)

    # Ensure storage directories exist
    storage_root = app.config.get("STORAGE_FOLDER", os.path.join(app.root_path, "..", "storage", "uploads"))
    os.makedirs(os.path.join(storage_root, "photos"), exist_ok=True)
    os.makedirs(os.path.join(storage_root, "aadhaar"), exist_ok=True)

    # Register Blueprints under /api/v1
    app.register_blueprint(health_bp, url_prefix="/api")
    app.register_blueprint(auth_bp, url_prefix="/api/v1/auth")
    app.register_blueprint(students_bp, url_prefix="/api/v1/students")
    app.register_blueprint(documents_bp, url_prefix="/api/v1/students")
    app.register_blueprint(seats_bp, url_prefix="/api/v1/seats")
    app.register_blueprint(fees_bp, url_prefix="/api/v1/fees")
    app.register_blueprint(receipts_bp, url_prefix="/api/v1/receipts")
    app.register_blueprint(attendance_bp, url_prefix="/api/v1/attendance")
    app.register_blueprint(reports_bp, url_prefix="/api/v1/reports")
    app.register_blueprint(dashboard_bp, url_prefix="/api/v1/dashboard")

    @app.route("/", methods=["GET"])
    def index():
        return jsonify({
            "service": "SBLMS - Shree Bala Ji Adhyayan Kendra Library API",
            "status": "healthy",
            "health_check": "/api/health",
            "version": "1.0.0"
        })

    # Consistent JSON Error Handlers
    @app.errorhandler(400)
    def bad_request(e):
        return jsonify({"success": False, "error": getattr(e, "description", "Bad Request")}), 400

    @app.errorhandler(401)
    def unauthorized(e):
        return jsonify({"success": False, "error": getattr(e, "description", "Unauthorized")}), 401

    @app.errorhandler(403)
    def forbidden(e):
        return jsonify({"success": False, "error": getattr(e, "description", "Forbidden")}), 403

    @app.errorhandler(404)
    def not_found(e):
        return jsonify({"success": False, "error": getattr(e, "description", "Resource Not Found")}), 404

    @app.errorhandler(500)
    def server_error(e):
        return jsonify({"success": False, "error": "Internal Server Error"}), 500

    return app

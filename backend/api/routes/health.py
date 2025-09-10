from flask import Blueprint, jsonify
import os
from dotenv import load_dotenv

health_bp = Blueprint("health", __name__)

load_dotenv()

@health_bp.route("/health", methods=["GET"])
def health_check():
    checks = {}

    # App check
    checks["backend"] = "ok"

    # Version check (ok/error + value)
    version = os.environ.get("APP_VERSION", "1.0.0")
    if version:
        checks["version"] = f"ok ({version})"
    else:
        checks["version"] = "error: not set"

    # Mail check
    mail_user = os.environ.get("MAIL_USERNAME")
    mail_pass = os.environ.get("MAIL_PASSWORD")
    if mail_user and mail_pass:
        checks["mail"] = "ok"
    else:
        checks["mail"] = "error: not configured"

    # Genel status
    overall_status = "healthy" if all(v.startswith("ok") for v in checks.values()) else "degraded"

    return jsonify({
        "status": overall_status,
        "checks": checks
    }), 200 if overall_status == "healthy" else 503
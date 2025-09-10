from flask import Blueprint, jsonify
import os
from dotenv import load_dotenv

health_bp = Blueprint("health", __name__)

load_dotenv()

@health_bp.route("/health", methods=["GET"])
def health_check():
    checks = {}

    # Backend check (always ok for now)
    checks["backend"] = "ok"

    # Version check
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

    # Decide status
    ok_count = sum(1 for v in checks.values() if v.startswith("ok"))
    if ok_count == 0:
        overall_status = "unhealthy"
        http_code = 500
    else:
        overall_status = "healthy" if ok_count == len(checks) else "degraded"
        http_code = 200

    return jsonify({
        "status": overall_status,
        "checks": checks
    }), http_code
from helpers.jwt_token_helper import jwt_protected
from flask import Blueprint, jsonify
import os
from dotenv import load_dotenv

health_bp = Blueprint("health", __name__)

load_dotenv()
@health_bp.route("/health", methods=["GET"])
@jwt_protected
def health_check(current_user):
    checks = {}

    # App check
    checks["backend"] = "ok"

    # Version check (ok/error + value)
    version = os.environ.get("APP_VERSION", "1.0.0")
    if version:
        checks["version"] = f"ok ({version})"
    else:
        checks["version"] = "error: not set"

    # Genel status
    overall_status = "healthy" if all(v.startswith("ok") for v in checks.values()) else "degraded"

    return jsonify({
        "status": overall_status,
        "checks": checks,
        "user": current_user  # token’dan gelen kullanıcı bilgisi
    }), 200 if overall_status == "healthy" else 503
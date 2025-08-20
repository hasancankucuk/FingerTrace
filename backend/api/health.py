from flask import Blueprint, jsonify
import os
import firebase_admin
from firebase_admin import firestore

health_bp = Blueprint("health", __name__)

@health_bp.route("/health", methods=["GET"])
def health_check():
    checks = {}

    # App check
    checks["app"] = "ok"

    # Firebase check
    try:
        _ = firebase_admin.get_app()
        checks["firebase"] = "ok"
    except Exception as e:
        checks["firebase"] = f"error: {str(e)}"

    # Firestore check
    try:
        db = firestore.client()
        _ = db.collection("health").document("ping").get()
        checks["firestore"] = "ok"
    except Exception as e:
        checks["firestore"] = f"error: {str(e)}"

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
        "checks": checks
    }), 200 if overall_status == "healthy" else 503
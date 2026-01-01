from functools import wraps
from flask import request, jsonify
from datetime import datetime, timedelta
from helpers.firebase_utils import firestore_get, firestore_update

def api_key_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        data = request.json or {}
        api_key = data.get("api_key")

        if not api_key:
            return jsonify({"error": "Missing API key"}), 401

        key_doc = firestore_get("api_keys", api_key)
        if not key_doc:
            return jsonify({"error": "Invalid API key"}), 401

        # Check owner subscription
        owner_uid = key_doc.get("owner_uid")
        if owner_uid:
            user_doc = firestore_get("users", owner_uid)
            if user_doc:
                status = user_doc.get("subscription_status", "trialing")
                
                # Check for trial expiry
                if status == "trialing":
                    trial_start = user_doc.get("trial_start_date")
                    if trial_start:
                        try:
                            # Handle ISO format with 'Z' or offset
                            trial_start = trial_start.replace('Z', '+00:00')
                            start_dt = datetime.fromisoformat(trial_start)
                            # Make both offset-naive for comparison if one is naive
                            now = datetime.utcnow()
                            if start_dt.tzinfo:
                                now = now.replace(tzinfo=None)
                                start_dt = start_dt.replace(tzinfo=None)
                                
                            if now - start_dt > timedelta(days=7):
                                # Trial expired
                                firestore_update("users", owner_uid, {"subscription_status": "cancelled"})
                                status = "cancelled"
                        except Exception as e:
                            print(f"Subscription check error: {e}")

                if status == "cancelled":
                    return jsonify({"error": "Account restricted (Cancelled). Please upgrade your plan to restore access."}), 403

        return f(key_doc.get("owner") or api_key, *args, **kwargs)
    return decorated_function
from functools import wraps
from flask import request, jsonify
from helpers.firebase_utils import firestore_set
import uuid
from datetime import datetime

# Try to import throttled, but make it optional
try:
    from throttled import Throttled, exceptions, rate_limiter
    THROTTLED_AVAILABLE = True
    default_quota = rate_limiter.per_min(100)
except ImportError:
    THROTTLED_AVAILABLE = False
    print("WARNING: throttled-py not installed. Rate limiting disabled.")

limiters = {}

def rate_limit(key_prefix: str, quota: int = None):
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            # If throttled is not available, skip rate limiting
            if not THROTTLED_AVAILABLE:
                return func(*args, **kwargs)
            
            # Get real client IP - prioritize IPv4
            from helpers.ip_helper import ensure_ipv4
            raw_ip = (
                request.headers.get("CF-Connecting-IP") or
                request.headers.get("X-Real-IP") or
                request.headers.get("X-Forwarded-For", "").split(",")[0].strip() or
                request.remote_addr
            )
            client_ip = ensure_ipv4(raw_ip) or raw_ip

            from helpers.firebase_utils import firestore_query
            device_results = firestore_query('deviceinfo', 'IP', '==', client_ip)
            
            fingerprint = "unknown"
            current_quota = default_quota

            if device_results:
                device_data = device_results[0]
                fingerprint = device_data.get('fingerprint', 'unknown')
                custom_limit = device_data.get('rate_limit')
                if custom_limit:
                    current_quota = rate_limiter.per_min(custom_limit)
            
            limiter_key = f"{key_prefix}:{fingerprint}:{client_ip}"
            if limiter_key not in limiters:
                limiters[limiter_key] = Throttled(quota=current_quota)
            
            limiter = limiters[limiter_key]

            try:
                limiter.limit(key=limiter_key)
                return func(*args, **kwargs)
            
            except exceptions.LimitedError as e:
                alert_id = str(uuid.uuid4())
                alert_data = {
                    "type": "Velocity Attack",
                    "fingerprint": fingerprint,
                    "ip": client_ip,
                    "context": key_prefix,
                    "created_at": datetime.utcnow().isoformat(),
                    "severity": "high"
                }
                firestore_set('alerts', alert_id, alert_data)

                return jsonify({
                    "error": "Rate limit exceeded",
                    "retry_after": getattr(e, "retry_after", 60)
                }), 429
            except Exception as e:
                print(f"Internal rate limit error: {e}")
                return func(*args, **kwargs)
        return wrapper
    return decorator
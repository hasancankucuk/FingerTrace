from functools import wraps
from flask import request, jsonify
from throttled import Throttled, exceptions, rate_limiter

quota = rate_limiter.per_min(100)
limiters = {}

def rate_limit(key_prefix: str):
    def decorator(func):
        if key_prefix not in limiters:
            limiters[key_prefix] = Throttled(quota=quota)

        limiter = limiters[key_prefix]

        @wraps(func)
        def wrapper(*args, **kwargs):
            client_ip = request.headers.get("X-Forwarded-For", request.remote_addr)
            if client_ip and "," in client_ip:
                client_ip = client_ip.split(",")[0].strip()
            
            key = f"{key_prefix}:{client_ip}" if client_ip else key_prefix
            
            try:
                limiter.limit(key=key)
                return func(*args, **kwargs)
            except exceptions.LimitedError as e:
                return jsonify({
                    "error": "Rate limit exceeded",
                    "message": "Too many requests. Please try again later.",
                    "retry_after": getattr(e, "retry_after", 60)
                }), 429
            except Exception as e:
                print(f"Rate limiting internal error: {e}")
                return func(*args, **kwargs)
        return wrapper
    return decorator
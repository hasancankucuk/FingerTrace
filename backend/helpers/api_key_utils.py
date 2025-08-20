import secrets
from datetime import datetime

def generate_api_key(name, environment="production", status="active"):
    key = secrets.token_urlsafe(32)
    now = datetime.utcnow().isoformat()
    return {
        "name": name,
        "key": key,
        "created_at": now,
        "environment": environment,
        "status": status,
    }
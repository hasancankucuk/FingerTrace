import redis
import os
import json

redis_host = os.getenv("REDIS_HOST", "redis")
redis_port = int(os.getenv("REDIS_PORT", 6379))

r = redis.Redis(host=redis_host, port=redis_port, db=0, decode_responses=True)

def set_cached_data(key, workspace_id, days, data, ttl=60):
    try:
        key = f"{key}:{workspace_id}:{days}"
        r.setex(key, ttl, json.dumps(data))
    except Exception as e:
        print(f"Redis set error: {e}")

def get_cached_data(key, workspace_id, days):
    try:
        key = f"{key}:{workspace_id}:{days}"
        data = r.get(key)
        if data:
            return json.loads(data)
        return None
    except Exception as e:
        print(f"Redis get error: {e}")
        return None
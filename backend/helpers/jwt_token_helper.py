from functools import wraps
from flask import jsonify, request
from flask_jwt_extended import verify_jwt_in_request, get_jwt_identity

def jwt_protected(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        try:
            verify_jwt_in_request()
            current_user = get_jwt_identity()
            return fn(current_user, *args, **kwargs)
        except Exception as e:
            return jsonify({"error": str(e)}), 401
    return wrapper
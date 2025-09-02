from functools import wraps
from flask import request, jsonify

from helpers.firebase_utils import firestore_get

def api_key_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        data = request.json or {}
        api_key = data.get("api_key")

        if not api_key:
            return jsonify({"error": "Missing API key"}), 401

        # DB'den kontrol (örnek: Firestore'da api_keys koleksiyonu)
        key_doc = firestore_get("api_keys", api_key)  # firestore_get senin util fonksiyonun olsun
        if not key_doc:
            return jsonify({"error": "Invalid API key"}), 401

        # current_user yerine api key sahibi bilgisi döndür
        return f(key_doc.get("owner") or api_key, *args, **kwargs)
    return decorated_function
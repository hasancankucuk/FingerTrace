import hashlib
from flask import request

def get_fingerprint_from_context(data: dict = None):
    """
    Extracts and hashes fingerprint based on request context (JSON body, headers, JA3).
    Matches logic used for device identification.
    """
    if data is None:
        data = request.get_json(silent=True) or {}
    
    raw_fingerprint = data.get('fingerprint') or request.headers.get('X-Fingerprint') or "unknown_fp"
    
    ja3_fp = request.headers.get('X-JA3', '')
    
    combined_string = f"{raw_fingerprint}:{ja3_fp}"
    hased_fingerprint = hashlib.sha256(combined_string.encode()).hexdigest()
    
    return hased_fingerprint, raw_fingerprint, ja3_fp

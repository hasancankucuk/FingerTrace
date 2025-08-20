from helpers.firebase_utils import firestore_get

def get_api_key_record(key: str):
    """
    Return api key record (dict) for given key string or None.
    Expect api_keys collection where doc id == key or a field 'key' exists.
    Record should include workspace_id (or ws_id).
    """
    if not key:
        return None
    try:
        rec = firestore_get("api_keys", key)
        if rec:
            return rec
    except Exception:
        return None
    return None
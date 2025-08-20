import os
import firebase_admin # type: ignore
from firebase_admin import credentials, auth, firestore # type: ignore

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FIREBASE_CRED_PATH = os.path.join(BASE_DIR, "fingerprintio.json")

# initialize only once and fail fast with useful error
if not firebase_admin._apps:
    if not os.path.exists(FIREBASE_CRED_PATH):
        raise RuntimeError(f"Firebase credentials not found at {FIREBASE_CRED_PATH}")
    cred = credentials.Certificate(FIREBASE_CRED_PATH)
    firebase_admin.initialize_app(cred)


def _user_record_to_dict(user):
    if user is None:
        return None
    return {
        "uid": getattr(user, "uid", None),
        "email": getattr(user, "email", None),
        "display_name": getattr(user, "display_name", None),
        "phone_number": getattr(user, "phone_number", None),
    }


def create_user(email, password, name=None):
    user = auth.create_user(
        email=email,
        password=password,
        display_name=name,
        email_verified=False,
        disabled=False,
    )
    return _user_record_to_dict(user)


def get_user(uid):
    user = auth.get_user(uid)
    return _user_record_to_dict(user)


def firebase_update_user(uid, email=None, name=None, phone=None):
    user = auth.update_user(
        uid,
        email=email if email is not None else None,
        display_name=name if name is not None else None,
        phone_number=phone if phone is not None else None,
    )
    return _user_record_to_dict(user)


def firebase_delete_user(uid):
    auth.delete_user(uid)
    return {"uid": uid, "deleted": True}


def firebase_reset_password(email):
    link = auth.generate_password_reset_link(
        email,
        action_code_settings=auth.ActionCodeSettings(
            url="http://localhost:5137/login", handle_code_in_app=True
        ),
    )

    return {"email": email, "reset": True}


def firestore_set(collection, document_id, data):
    db = firestore.client()
    db.collection(collection).document(document_id).set(data)


def firestore_get(collection, document_id):
    db = firestore.client()
    doc = db.collection(collection).document(document_id).get()
    return doc.to_dict() if doc.exists else None


def firestore_update(collection, document_id, data):
    db = firestore.client()
    db.collection(collection).document(document_id).update(data)


def firestore_delete(collection, document_id):
    db = firestore.client()
    db.collection(collection).document(document_id).delete()


def firestore_get_all(collection):
    db = firestore.client()
    docs = db.collection(collection).stream()
    return [doc.to_dict() for doc in docs]


def firebase_verify_id_token(id_token):
    try:
        decoded_token = auth.verify_id_token(id_token)
        return decoded_token
    except Exception as e:
        return {"error": str(e)}

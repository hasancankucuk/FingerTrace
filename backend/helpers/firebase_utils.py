import os

from dotenv import load_dotenv
import firebase_admin # type: ignore
from firebase_admin import credentials, auth, firestore # type: ignore
load_dotenv()

FIREBASE_CREDS = os.getenv('FIREBASE_CREDS')

if not firebase_admin._apps:
    try:
        import json
        if isinstance(FIREBASE_CREDS, str):
            cred_dict = json.loads(FIREBASE_CREDS)
        else:
            cred_dict = FIREBASE_CREDS
        
        cred = credentials.Certificate(cred_dict)
        firebase_admin.initialize_app(cred)
    except Exception as e:
        raise RuntimeError(f"Firebase initialization failed: {e}")



db = firestore.client()

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
    try:
        user = auth.create_user(
            email=email,
            password=password,
            display_name=name,
            email_verified=False,
        disabled=False,
        )
    except Exception as e:
        print("Error creating user:", e)
        return None
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
    
    db.collection(collection).document(document_id).set(data)


def firestore_get(collection, document_id):
    
    doc = db.collection(collection).document(document_id).get()
    return doc.to_dict() if doc.exists else None


def firestore_update(collection, document_id, data):
    
    db.collection(collection).document(document_id).update(data)


def firestore_delete(collection, document_id):
    
    db.collection(collection).document(document_id).delete()


def firestore_get_all(collection):
    
    docs = db.collection(collection).stream()
    return [doc.to_dict() for doc in docs]

def firestore_add(collection_name, data, doc_id=None):
    try:
        
        if doc_id:
            db.collection(collection_name).document(doc_id).set(data)
            return doc_id
        else:
            doc_ref = db.collection(collection_name).add(data)
            return doc_ref[1].id  # Return the document ID
    except Exception as e:
        print(f"Error adding document to {collection_name}: {e}")
        raise e

def firestore_get_by_id(collection_name, doc_id):
    """Get a specific document by ID from a Firestore collection"""
    try:
        doc = db.collection(collection_name).document(doc_id).get()
        if doc.exists:
            data = doc.to_dict()
            data['id'] = doc.id
            return data
        return None
    except Exception as e:
        print(f"Error getting document {doc_id} from {collection_name}: {e}")
        return None


def firebase_verify_id_token(id_token):
    try:
        decoded_token = auth.verify_id_token(id_token)
        return decoded_token
    except Exception as e:
        return {"error": str(e)}

def firestore_query(collection_name, field, operator, value):
    """Query documents in a Firestore collection"""
    try:
        docs = db.collection(collection_name).where(field, operator, value).stream()
        results = []
        for doc in docs:
            data = doc.to_dict()
            data['id'] = doc.id
            results.append(data)
        return results
    except Exception as e:
        print(f"Error querying {collection_name}: {e}")
        return []

def firestore_get_with_pagination(collection_name, limit=10, start_after=None, order_by=None):
    """Get documents with pagination"""
    try:
        query = db.collection(collection_name)
        
        if order_by:
            query = query.order_by(order_by)
        
        if start_after:
            query = query.start_after(start_after)
        
        query = query.limit(limit)
        
        docs = query.stream()
        results = []
        last_doc = None
        
        for doc in docs:
            data = doc.to_dict()
            data['id'] = doc.id
            results.append(data)
            last_doc = doc
        
        return results, last_doc
    except Exception as e:
        print(f"Error getting paginated documents from {collection_name}: {e}")
        return [], None
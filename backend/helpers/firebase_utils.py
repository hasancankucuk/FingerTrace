import os
from dotenv import load_dotenv
import firebase_admin # type: ignore
from firebase_admin import credentials, auth, firestore # type: ignore
from google.cloud.firestore_v1.base_query import FieldFilter

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
        print("Firebase initialized successfully")
    except Exception as e:
        print(f"Firebase initialization error: {e}")
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
        print(f"User created successfully: {user.uid}")
        return _user_record_to_dict(user)
    except Exception as e:
        print("Error creating user:", e)
        return None

def get_user(uid):
    try:
        user = auth.get_user(uid)
        return _user_record_to_dict(user)
    except Exception as e:
        print(f"Error getting user {uid}: {e}")
        return None

def firebase_update_user(uid, email=None, name=None, phone=None):
    try:
        update_params = {}
        if email is not None:
            update_params['email'] = email
        if name is not None:
            update_params['display_name'] = name
        if phone is not None:
            update_params['phone_number'] = phone
            
        user = auth.update_user(uid, **update_params)
        return _user_record_to_dict(user)
    except Exception as e:
        print(f"Error updating user {uid}: {e}")
        return None

def firebase_delete_user(uid):
    try:
        auth.delete_user(uid)
        return {"uid": uid, "deleted": True}
    except Exception as e:
        print(f"Error deleting user {uid}: {e}")
        return None

def firebase_reset_password(email):
    """Generate Firebase password reset link (Firebase sends mail only via Client SDK)"""
    try:
        action_code_settings = auth.ActionCodeSettings(
            url='https://fingertrace.app/login',
            handle_code_in_app=False
        )

        reset_link = auth.generate_password_reset_link(email, action_code_settings)

        print(f"Password reset link generated for: {email}")
        return {
            "email": email,
            "reset": True,
            "reset_link": reset_link,
        }

    except Exception as e:
        print(f"Error: {e}")
        return {"error": str(e)}

def firestore_set(collection, document_id, data):
    try:
        db.collection(collection).document(document_id).set(data)
        return True
    except Exception as e:
        print(f"Error setting document {document_id} in {collection}: {e}")
        return False

def firestore_get(collection, document_id):
    try:
        doc = db.collection(collection).document(document_id).get()
        return doc.to_dict() if doc.exists else None
    except Exception as e:
        print(f"Error getting document {document_id} from {collection}: {e}")
        return None

def firestore_update(collection, document_id, data):
    try:
        db.collection(collection).document(document_id).update(data)
        return True
    except Exception as e:
        print(f"Error updating document {document_id} in {collection}: {e}")
        return False

def firestore_delete(collection, document_id):
    try:
        db.collection(collection).document(document_id).delete()
        return True
    except Exception as e:
        print(f"Error deleting document {document_id} from {collection}: {e}")
        return False

def firestore_get_all(collection):
    try:
        docs = db.collection(collection).stream()
        results = []
        for doc in docs:
            data = doc.to_dict()
            if data:  # Ensure data is not None
                data['id'] = doc.id
                results.append(data)
        return results
    except Exception as e:
        print(f"Error getting all documents from {collection}: {e}")
        return []

def firestore_add(collection_name, data, doc_id=None):
    try:
        if doc_id:
            db.collection(collection_name).document(doc_id).set(data)
            return doc_id
        else:
            doc_ref = db.collection(collection_name).add(data)
            return doc_ref[1].id
    except Exception as e:
        print(f"Error adding document to {collection_name}: {e}")
        raise e

def firestore_get_by_id(collection_name, doc_id):
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
    except auth.InvalidIdTokenError as e:
        print(f"Invalid ID token: {e}")
        return {"error": "Invalid ID token"}
    except auth.ExpiredIdTokenError as e:
        print(f"Expired ID token: {e}")
        return {"error": "Expired ID token"}
    except Exception as e:
        print(f"Token verification error: {e}")
        return {"error": str(e)}

def firestore_query(collection_name, field, operator, value):
    try:
       docs = db.collection(collection_name).where(filter=FieldFilter(field, operator, value)).stream()
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
from helpers.firebase_utils import create_user, firebase_reset_password, get_user, firebase_update_user, firebase_delete_user, firestore_delete, firestore_query
from flask import Blueprint, request, jsonify # type: ignore
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity # type: ignore
from helpers.api_rate_limiting import rate_limit
import os
from dotenv import load_dotenv
import requests

load_dotenv()
auth_bp = Blueprint('auth', __name__)

@rate_limit('register')
@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.json
    email = data.get('email')
    password = data.get('password')
    name = data.get('name')

    if not email or not password or not name:
        return jsonify({"error": "Missing fields"}), 400

    user = create_user(email, password, name)
    if user is None:
        return jsonify({"error": "Email already exists"}), 400

    from helpers.firebase_utils import firestore_set
    from datetime import datetime
    firestore_set("users", user["uid"], {
        "email": email,
        "name": name,
        "subscription_status": "trialing",
        "trial_start_date": datetime.utcnow().isoformat(),
        "created_at": datetime.utcnow().isoformat()
    })

    access_token = create_access_token(identity=user["uid"])
    return jsonify({"uid": user["uid"], "access_token": access_token}), 201

@rate_limit('user')
@auth_bp.route('/user', methods=['GET'])
@jwt_required()
def user():
    uid = get_jwt_identity()
    user_auth = get_user(uid)
    
    from helpers.firebase_utils import firestore_get
    user_doc = firestore_get("users", uid) or {}

    return jsonify({
        "email": user_auth["email"],
        "name": user_auth["display_name"],
        "phone": user_auth["phone_number"],
        "subscription_status": user_doc.get("subscription_status", "trialing"),
        "trial_start_date": user_doc.get("trial_start_date"),
    }), 200

@rate_limit('user')
@auth_bp.route('/user', methods=['PUT'])
@jwt_required()
def update_user():
    uid = get_jwt_identity()
    data = request.json
    try:
        firebase_update_user(uid, data.get('email'), data.get('name'), data.get('phone'))
    except Exception as e:
        return jsonify({"error": str(e)}), 400
    return jsonify({"message": "User updated"}), 200

@rate_limit('user')
@auth_bp.route('/user/', methods=['DELETE'])
@jwt_required()
def delete_user():
    uid = get_jwt_identity()
    try:
        user = get_user(uid)
        email = user["email"]
        user_workspaces = firestore_query('workspaces', 'created_by', '==', email)
        for ws in user_workspaces:
            firestore_delete("workspaces", ws["id"])

        firebase_delete_user(uid)

    except Exception as e:
        return jsonify({"error": str(e)}), 400

    return jsonify({"message": "User and their workspaces deleted"}), 200

@rate_limit('me')
@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def me():
    
    uid = get_jwt_identity()
    user = get_user(uid)
    return jsonify({"email": user.email}), 200

@rate_limit('forgot')
@auth_bp.route('/forgot', methods=['POST'])
def forgot_password():
    data = request.json
    email = data.get('email')

    if not email:
        return jsonify({"error": "Missing email"}), 400

    try:
        response = firebase_reset_password(email)
    except Exception as e:
        return jsonify({"error": str(e)}), 400

    return jsonify({"message": "Password reset email sent", "reset_link": response.get("reset_link")}), 200

@rate_limit('reset')
@auth_bp.route('/reset', methods=['POST'])
def reset_password():
    data = request.json
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({"error": "Missing email or password"}), 400

    try:
        response = firebase_update_password(email, password)
    except Exception as e:
        return jsonify({"error": str(e)}), 400

    return jsonify({"message": "Password updated successfully"}), 200

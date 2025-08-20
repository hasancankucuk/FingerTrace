from flask import Blueprint, request, jsonify # type: ignore
from flask_jwt_extended import create_access_token # type: ignore
import os
import requests # type: ignore

login_bp = Blueprint('login', __name__)

@login_bp.route('/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({"message": "Email and password are required"}), 400

    api_key = os.environ.get('FIREBASE_API_KEY')
    if not api_key:
        return jsonify({"message": "Missing Firebase API key"}), 500

    url = f"https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key={api_key}"
    payload = {
        "email": email,
        "password": password,
        "returnSecureToken": True
    }

    try:
        resp = requests.post(url, json=payload)
        result = resp.json()

        if resp.status_code == 200 and result.get('localId'):
            access_token = create_access_token(identity=result['localId'])
            return jsonify({"uid": result['localId'], "access_token": access_token}), 200
        else:
            return jsonify({"message": result.get('error', {}).get('message', 'Login failed')}), 401

    except Exception as e:
        return jsonify({"message": str(e)}), 500
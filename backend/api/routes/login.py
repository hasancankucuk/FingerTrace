from flask import Blueprint, request, jsonify # type: ignore
from flask_jwt_extended import create_access_token # type: ignore
from helpers.api_rate_limiting import rate_limit
import os
import requests # type: ignore
from dotenv import load_dotenv


login_bp = Blueprint('login', __name__)
load_dotenv()

def verify_turnstile(token: str, ip: str) -> bool:
    secret_key = "0x4AAAAAAB0me7Qytv6BTE3_TeFROT_thuo"
    if not secret_key:
        return False
    
    response = requests.post(
        'https://challenges.cloudflare.com/turnstile/v0/siteverify',
        data={
            'secret': secret_key,
            'response': token,
            'remoteip': ip
        }
    )
    
    result = response.json()
    return result.get('success', False)

@rate_limit('login')
@login_bp.route('/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')
    turnstile_token = data.get('turnstile_token')


    if not email or not password:
        return jsonify({"message": "Email and password are required"}), 400

    api_key = os.environ.get('FIREBASE_API_KEY')

    if turnstile_token:
        client_ip = request.environ.get('HTTP_X_FORWARDED_FOR', request.remote_addr)
        if not verify_turnstile(turnstile_token, client_ip):
            return jsonify({'error': 'CAPTCHA verification failed'}), 400
    

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
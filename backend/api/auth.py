from helpers.firebase_utils import create_user, firebase_reset_password, get_user, firebase_update_user, firebase_delete_user, firestore_update, firestore_delete
from flask import Blueprint, request, jsonify # type: ignore
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity # type: ignore

auth_bp = Blueprint('auth', __name__)

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

    access_token = create_access_token(identity=user.uid)
    return jsonify({"uid": user.uid, "access_token": access_token}), 201

@auth_bp.route('/user', methods=['GET'])
@jwt_required()
def user():
    uid = get_jwt_identity()
    user = get_user(uid)

    print(user)

    return jsonify({
        "email": user["email"],
        "name": user["display_name"],
        "phone": user["phone_number"],
    }), 200

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

@auth_bp.route('/user/', methods=['DELETE'])
@jwt_required()
def delete_user():
    uid = get_jwt_identity()
    try:
        firebase_delete_user(uid)
    except Exception as e:
        return jsonify({"error": str(e)}), 400
    return jsonify({"message": "User deleted"}), 200

@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def me():
    
    uid = get_jwt_identity()
    user = get_user(uid)
    return jsonify({"email": user.email}), 200


@auth_bp.route('/forgot', methods=['POST'])
def forgot_password():
    data = request.json
    email = data.get('email')

    if not email:
        return jsonify({"error": "Missing email"}), 400

    try:
        firebase_reset_password(email)
    except Exception as e:
        return jsonify({"error": str(e)}), 400

    return jsonify({"message": "Password reset email sent"}), 200
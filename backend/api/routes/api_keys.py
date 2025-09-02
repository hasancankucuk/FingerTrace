from helpers.jwt_token_helper import jwt_protected
from flask import Blueprint, request, jsonify
from helpers.api_key_utils import generate_api_key
from helpers.firebase_utils import firestore_delete, firestore_set, firestore_get_all, firestore_get, get_user

api_keys_bp = Blueprint("api_keys", __name__)


@api_keys_bp.route("/api-keys", methods=["POST"])
@api_keys_bp.route("/api-keys/", methods=["POST"])
@jwt_protected
def create_api_key(current_user):
    data = request.json or {}
    name = data.get("name")
    environment = data.get("environment", "production")
    status = data.get("status", "active")

    if not name:
        return jsonify({"error": "Missing name"}), 400

    key_data = generate_api_key(name, environment, status)
    if not isinstance(key_data, dict) or not key_data.get("key"):
        return jsonify({"error": "Failed to generate API key"}), 500

    workspace_id = data.get("workspace_id") or data.get("ws_id")
    workspace_name = None
    workspace_field = data.get("workspace")
    if isinstance(workspace_field, dict):
        workspace_id = workspace_id or workspace_field.get("id")
        workspace_name = workspace_field.get("name") or workspace_field.get("title")
    elif isinstance(workspace_field, str):
        workspace_name = workspace_field
    workspace_name = workspace_name or data.get("workspace_name")

    if workspace_id:
        key_data["workspace_id"] = workspace_id
    if workspace_name:
        key_data["workspace"] = workspace_name

    try:
        keys = firestore_get_all("api_keys") or []
    except Exception:
        keys = []
    
    user = get_user(current_user)

    for key in keys:
        if not isinstance(key, dict):
            continue
        if key.get("created_by") == user["email"] and (key.get("name") == name or key.get("key") == key_data.get("key")):
            return jsonify({"error": "API key with this name or key already exists"}), 400
    
    key_data["created_by"] = user["email"]
    firestore_set("api_keys", key_data["key"], key_data)
    return jsonify(key_data), 201

@api_keys_bp.route("/api-keys", methods=["GET"])
@jwt_protected
def list_api_keys(current_user):
    keys = firestore_get_all("api_keys") or []
    workspace_id = request.args.get("workspace_id")
    user = get_user(current_user)

    keys = [
        key for key in keys
        if isinstance(key, dict)
        and key.get("created_by") == user["email"]
        and (workspace_id is None or key.get("workspace_id") == workspace_id)
    ]

    return jsonify(keys), 200
@api_keys_bp.route("/api-keys/<key_id>", methods=["DELETE"])
@jwt_protected
def delete_api_key(current_user, key_id):
    key = firestore_get("api_keys", key_id)
    if not key:
        return jsonify({"error": "API key not found"}), 404
    user = get_user(current_user)
    if key.get("created_by") != user["email"]:
        return jsonify({"error": "Unauthorized"}), 403

    firestore_delete("api_keys", key_id)
    return jsonify({"message": "API key deleted"}), 200
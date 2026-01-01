from helpers.jwt_token_helper import jwt_protected
from flask import Blueprint, request, jsonify
from helpers.api_key_utils import generate_api_key
from helpers.firebase_utils import firestore_delete, firestore_set, firestore_get, get_user, firestore_query, firestore_query_multi
from helpers.api_rate_limiting import rate_limit

api_keys_bp = Blueprint("api_keys", __name__)

@rate_limit("api_keys")
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

    workspace_id = data.get("workspace_id") or data.get("ws_id")
    workspace_name = data.get("workspace_name")
    workspace_field = data.get("workspace")

    if isinstance(workspace_field, dict):
        workspace_id = workspace_id or workspace_field.get("id")
        workspace_name = workspace_name or workspace_field.get("name") or workspace_field.get("title")
    elif isinstance(workspace_field, str) and not workspace_name:
        workspace_name = workspace_field

    user = get_user(current_user)
    if not user or "email" not in user:
        return jsonify({"error": "User context not found"}), 401

    existing_keys = firestore_query_multi(
        "api_keys", 
        "created_by", "==", user["email"],
        "name", "==", name,
        "workspace_id", "==", workspace_id
    )

    if existing_keys:
        return jsonify({"error": f"An API key with the name '{name}' already exists in this workspace"}), 400

    key_data = generate_api_key(name, environment, status)
    if not isinstance(key_data, dict) or not key_data.get("key"):
        return jsonify({"error": "Failed to generate API key"}), 500

    key_data.update({
        "created_by": user["email"],
        "owner_uid": user["uid"],
        "workspace_id": workspace_id,
        "workspace": workspace_name,
        "created_at": datetime.utcnow().isoformat()
    })

    firestore_set("api_keys", key_data["key"], key_data)
    
    return jsonify(key_data), 201

@api_keys_bp.route("/api-keys", methods=["GET"])
@jwt_protected
def list_api_keys(current_user):
    user = get_user(current_user)
    workspace_id = request.args.get("workspace_id")
    keys = firestore_query("api_keys", "created_by", "==", user["email"])
    if workspace_id:
        keys = [key for key in keys if key.get("workspace_id") == workspace_id]

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
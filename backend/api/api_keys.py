from flask import Blueprint, request, jsonify
from helpers.api_key_utils import generate_api_key
from helpers.firebase_utils import firestore_delete, firestore_set, firestore_get_all, firestore_get

api_keys_bp = Blueprint("api_keys", __name__)


@api_keys_bp.route("/api-keys", methods=["POST"])
@api_keys_bp.route("/api-keys/", methods=["POST"])
def create_api_key():
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

    for key in keys:
        if not isinstance(key, dict):
            continue
        if key.get("name") == name or key.get("key") == key_data.get("key"):
            return jsonify({"error": "API key with this name or key already exists"}), 400

    firestore_set("api_keys", key_data["key"], key_data)
    return jsonify(key_data), 201

@api_keys_bp.route("/api-keys", methods=["GET"])
def list_api_keys():
    keys = firestore_get_all("api_keys")
    workspace_id = request.args.get("workspace_id")
    workspace_keys = ("workspace_id", "workspace", "ws_id")

    if workspace_id:
        keys = [key for key in keys if key.get("workspace_id") == workspace_id]

    return jsonify(keys), 200


@api_keys_bp.route("/api-keys/<key_id>", methods=["DELETE"])
def delete_api_key(key_id):
    firestore_delete("api_keys", key_id)
    return jsonify({"message": "API key deleted"}), 200

from flask import Blueprint, jsonify, request
from helpers.firebase_utils import firestore_set, get_user, firestore_query
from helpers.jwt_token_helper import jwt_protected
from helpers.api_rate_limiting import rate_limit
from datetime import datetime
import secrets

workspaces_bp = Blueprint("workspaces", __name__)

@rate_limit('workspaces')
@workspaces_bp.route("/workspaces", methods=["GET"])
@jwt_protected
def get_workspaces(current_user):
    try:
        user = get_user(current_user)
        workspaces = firestore_query('workspaces', 'created_by', '==', user['email'])
        
        return jsonify(workspaces), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@rate_limit('workspaces')
@workspaces_bp.route("/workspaces/<workspace_id>", methods=["GET"])
@jwt_protected
def get_workspace(current_user, workspace_id):
    try:
        workspace = firestore_query('workspaces', 'id', '==', workspace_id)
        return jsonify(workspace), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@rate_limit('workspaces')
@workspaces_bp.route("/workspaces", methods=["POST"])
@jwt_protected
def create_workspace(current_user):
    try:
        workspace_data = request.json
        workspace_data["id"] = secrets.token_urlsafe(32)
        workspace_data["created_at"] = datetime.utcnow().isoformat()
        user = get_user(current_user)
        workspace_data["created_by"] = user["email"]
        workspace_name = workspace_data.get("name")

        if not workspace_name or workspace_name.strip() == "":
            return jsonify({"error": "Workspace name is required"}), 400

        existing_names = [ws["name"] for ws in firestore_query('workspaces', 'created_by', '==', user['email'])]
        if workspace_name in existing_names:
            return jsonify({"error": "Workspace name must be unique"}), 400

        firestore_set("workspaces", workspace_data["id"], workspace_data)

        return jsonify({
            "message": "Workspace created successfully",
            "id": workspace_data["id"]
        }), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 500
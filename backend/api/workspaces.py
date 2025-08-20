from datetime import datetime
from random import random
import secrets
from flask import Blueprint, jsonify, request
from helpers.firebase_utils import firestore_get_all, firestore_set

workspaces_bp = Blueprint("workspaces", __name__)

@workspaces_bp.route("/api/workspaces", methods=["GET"])
def get_workspaces():
    try:
        workspaces = firestore_get_all("workspaces")
        return jsonify(workspaces), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@workspaces_bp.route("/api/workspaces/<workspace_id>", methods=["GET"])
def get_workspace(workspace_id):
    try:
        workspace = firestore_get_all("workspaces", workspace_id)
        return jsonify(workspace), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@workspaces_bp.route("/api/workspaces", methods=["POST"])
def create_workspace():
    try:
        workspace_data = request.json
        print(workspace_data)
        workspace_data["id"] = secrets.token_urlsafe(32)
        workspace_data["created_at"] = datetime.utcnow().isoformat()

        doc_ref = firestore_set("workspaces", workspace_data["id"], workspace_data)

        return jsonify({
            "message": "Workspace created successfully",
            "id": workspace_data["id"]
        }), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 500
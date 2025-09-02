import hashlib
from helpers.api_key_helper import api_key_required
from helpers.jwt_token_helper import jwt_protected
from helpers.map_device_type import map_device_type
from flask import Blueprint, request, jsonify
from helpers.firebase_utils import (
    firestore_set,
    firestore_get,
    firestore_update,
    firestore_delete,
    firestore_get_all,
)

from datetime import datetime

fingerprint_bp = Blueprint('fingerprint', __name__)

# --- LIST FINGERPRINTS ---
@fingerprint_bp.route('/fingerprints', methods=['GET'])
@jwt_protected
def list_fingerprints(current_user):
    docs = firestore_get_all('fingerprints')
    return jsonify(docs), 200

# --- GET SINGLE FINGERPRINT ---
@fingerprint_bp.route('/fingerprints/<doc_id>', methods=['GET'])
@jwt_protected
def get_fingerprint(current_user, doc_id):
    doc = firestore_get('fingerprints', doc_id)
    if doc:
        return jsonify(doc), 200
    return jsonify({'error': 'Not found'}), 404

# --- CREATE FINGERPRINT ---
@fingerprint_bp.route('/fingerprints', methods=['POST'])
@api_key_required
def create_fingerprint(current_user):
    data = request.json or {}

    browser_fp = data.get('fingerprint')
    if not browser_fp:
        return jsonify({'error': 'Missing fingerprint'}), 400

    ja3_fp = request.headers.get('X-JA3', '')

    combined_string = f"{browser_fp}:{ja3_fp}"
    doc_id = hashlib.sha256(combined_string.encode()).hexdigest()

    workspace_id = data.get('workspace_id') or data.get('ws_id')
    workspace_name = None

    workspace_field = data.get('workspace')
    if isinstance(workspace_field, dict):
        workspace_id = workspace_id or workspace_field.get('id')
        workspace_name = workspace_field.get('name') or workspace_field.get('title')
    elif isinstance(workspace_field, str):
        workspace_name = workspace_field

    workspace_name = workspace_name or data.get('workspace_name')

    if workspace_id:
        data['workspace_id'] = workspace_id
    if workspace_name:
        data['workspace'] = workspace_name

    now = datetime.utcnow().isoformat()
    data['created_at'] = now
    data['updated_at'] = now

    data['fingerprint'] = doc_id

    firestore_set('fingerprints', doc_id, data)

    return jsonify({
        'message': 'Fingerprint created',
        'id': doc_id,
        'workspace_id': data.get('workspace_id'),
        'workspace': data.get('workspace'),
    }), 201

# --- UPDATE FINGERPRINT ---
@fingerprint_bp.route('/fingerprints/<doc_id>', methods=['PUT'])
@jwt_protected
def update_fingerprint(current_user, doc_id):
    data = request.json
    data['updated_at'] = datetime.utcnow().isoformat()
    data['updated_by'] = current_user
    firestore_update('fingerprints', doc_id, data)
    return jsonify({'message': 'Fingerprint updated'}), 200

# --- DELETE FINGERPRINT ---
@fingerprint_bp.route('/fingerprints/<doc_id>', methods=['DELETE'])
@jwt_protected
def delete_fingerprint(current_user, doc_id):
    firestore_delete('fingerprints', doc_id)
    return jsonify({'message': 'Fingerprint deleted'}), 200

# --- LIST MERGED FINGERPRINTS ---
@fingerprint_bp.route('/fingerprints/merged', methods=['GET'])
@jwt_protected
def list_merged_fingerprints(current_user):
    fingerprints = firestore_get_all('fingerprints')
    deviceinfo_list = firestore_get_all('deviceinfo')

    workspace_id = request.args.get("workspace_id")
    workspace_keys = ("workspace_id", "workspace", "ws_id")

    if workspace_id:
        def in_workspace_rec(obj):
            if not isinstance(obj, dict):
                return False
            for k in workspace_keys:
                val = obj.get(k)
                if val and str(val) == str(workspace_id):
                    return True
            return False

        deviceinfo_list = [d for d in deviceinfo_list if in_workspace_rec(d)]
        fingerprints = [f for f in fingerprints if in_workspace_rec(f)]

    fingerprints_dict = {fp.get('fingerprint'): fp for fp in fingerprints if isinstance(fp, dict) and fp.get('fingerprint')}

    merged_data = []
    for device in deviceinfo_list:
        fp = device.get('fingerprint')
        if fp and fp in fingerprints_dict:
            fp_data = fingerprints_dict[fp]
            merged_entry = {
                "request_id": fp_data.get("id", ""),
                "fingerprint": fp or "",
                "created_at": device.get("created_at", "") or fp_data.get("created_at", ""),
                "updated_at": device.get("updated_at", "") or fp_data.get("updated_at", ""),
                "device_type": map_device_type(device.get("device_type")),
                "platform": device.get("platform", ""),
                "time_zone": device.get("time_zone", "") or fp_data.get("time_zone", ""),
                "user_agent": device.get("user_agent", "") or fp_data.get("user_agent", ""),
                "color_depth": device.get("color_depth", "") or fp_data.get("color_depth", ""),
                "color_gamut": device.get("color_gamut", "") or fp_data.get("color_gamut", ""),
                "bar_visibility": device.get("bar_visibility", "") or fp_data.get("bar_visibility", ""),
                "browser_feature_support": device.get("browser_feature_support", "") or fp_data.get("browser_feature_support", ""),
            }
            merged_data.append(merged_entry)

    if not merged_data:
        return jsonify({"message": "No data"}), 200

    return jsonify(merged_data), 200



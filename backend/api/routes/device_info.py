

from datetime import datetime
import hashlib
from math import comb
from flask import Blueprint, jsonify, request
from helpers.firebase_utils import firestore_set
from helpers.api_key_helper import api_key_required


deviceinfo_bp = Blueprint("device_info_bp", __name__)

@deviceinfo_bp.route('/deviceinfo', methods=['POST'])
@api_key_required
def create_device_info(current_user):
    device_info = request.json or {}
    if not device_info or 'fingerprint' not in device_info:
        return jsonify({"error": "Missing fingerprint in device info"}), 400

    workspace_id = device_info.get('workspace_id') or device_info.get('ws_id')
    workspace_name = None
    workspace_field = device_info.get('workspace')
    if isinstance(workspace_field, dict):
        workspace_id = workspace_id or workspace_field.get('id')
        workspace_name = workspace_field.get('name') or workspace_field.get('title')
    elif isinstance(workspace_field, str):
        workspace_name = workspace_field

    workspace_name = workspace_name or device_info.get('workspace_name')

    if workspace_id:
        device_info['workspace_id'] = workspace_id
    if workspace_name:
        device_info['workspace'] = workspace_name
    device_info['created_at'] = datetime.utcnow().isoformat()
    device_info['updated_at'] = datetime.utcnow().isoformat()

    ja3_fp = request.headers.get('X-JA3', '')

    combined_string = f"{device_info.get('fingerprint')}:{ja3_fp}"
    print( "combined_string:", combined_string)
    doc_id = hashlib.sha256(combined_string.encode()).hexdigest()
    device_info['fingerprint'] = doc_id

    firestore_set('deviceinfo', doc_id, device_info)
    return jsonify({"message": "Device info received", "fingerprint": device_info.get("fingerprint")}), 201
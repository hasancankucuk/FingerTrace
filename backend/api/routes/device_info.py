

from datetime import datetime
import hashlib
from math import comb
from flask import Blueprint, jsonify, request
from helpers.firebase_utils import firestore_get, firestore_get_all, firestore_set
from helpers.api_key_helper import api_key_required
from helpers.jwt_token_helper import jwt_protected
from helpers.api_rate_limiting import rate_limit
from helpers.location_helper import get_location
from helpers.vpn_proxy_helper import check_vpn_proxy
from helpers.ip_helper import ensure_ipv4

deviceinfo_bp = Blueprint("device_info_bp", __name__)

@rate_limit('deviceinfo')
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
        
    
    client_ip = request.headers.get('CF-Connecting-IP')


    from helpers.fingerprint_helper import get_fingerprint_from_context
    doc_id, raw_fp, ja3_fp = get_fingerprint_from_context(device_info)
    existing_device = firestore_get('deviceinfo', doc_id)
    
    device_info['IP'] = client_ip
    device_info['created_at'] = datetime.utcnow().isoformat()
    device_info['updated_at'] = datetime.utcnow().isoformat()
    current_location = get_location(client_ip)
    print("client_ip:", client_ip, current_location)



    if existing_device:
        device_info['updated_at'] = datetime.utcnow().isoformat()
        device_info['previous_location'] = existing_device.get('previous_location')
        device_info['previous_location_timestamp'] = existing_device.get('previous_location_timestamp')
        device_info['created_at'] = existing_device.get('created_at')
    else:
        device_info['previous_location'] = None
        device_info['created_at'] = datetime.utcnow().isoformat()

    device_info['current_location'] = current_location
    device_info['current_location_timestamp'] = datetime.utcnow().isoformat()

    device_info['fingerprint'] = doc_id
    device_info['raw_fingerprint'] = raw_fp
    device_info['ja3_fingerprint'] = ja3_fp
    
    is_vpn, vpn_details = check_vpn_proxy(client_ip)
    device_info['is_vpn'] = is_vpn
    device_info['vpn_details'] = vpn_details

    firestore_set('deviceinfo', doc_id, device_info)
    return jsonify({"message": "Device info received", "fingerprint": device_info.get("fingerprint")}), 201

@rate_limit('deviceinfo')
@deviceinfo_bp.route('/deviceinfo', methods=['GET'])
@jwt_protected
def get_device_info(current_user):
    if not current_user:
        return jsonify({"error": "Unauthorized"}), 401

    device_info = firestore_get_all('deviceinfo')
    print("device_info:", device_info )
    if not device_info:
        return jsonify({"error": "Device info not found"}), 404

    return jsonify(device_info), 200

@rate_limit('deviceinfo')
@deviceinfo_bp.route('/deviceinfo/<doc_id>', methods=['GET'])
@jwt_protected
def get_device_info_by_id(current_user, doc_id):
    if not current_user:
        return jsonify({"error": "Unauthorized"}), 401

    device_info = firestore_get('deviceinfo', doc_id)
    if not device_info:
        return jsonify({"error": "Device info not found"}), 404

    return jsonify(device_info), 200
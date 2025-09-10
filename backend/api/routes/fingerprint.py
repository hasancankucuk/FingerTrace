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
import re

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

def _parse_ja3(ja3_str: str):
    """
    Parse a JA3 string and compute MD5 hash.
    Format: SSLVersion,CipherSuites,Extensions,EllipticCurves,ECPointFormats
    """
    if not ja3_str:
        return None
    try:
        parts = ja3_str.split(',')
        ssl_version = parts[0] if len(parts) > 0 else ""
        ciphers = parts[1].split('-') if len(parts) > 1 and parts[1] != "" else []
        extensions = parts[2].split('-') if len(parts) > 2 and parts[2] != "" else []
        curves = parts[3].split('-') if len(parts) > 3 and parts[3] != "" else []
        ec_point_formats = parts[4].split('-') if len(parts) > 4 and parts[4] != "" else []

        ja3_hash = hashlib.md5(ja3_str.encode()).hexdigest()

        return {
            "ja3": ja3_str,
            "ja3_hash": ja3_hash,
            "ssl_version": ssl_version,
            "ciphers": ciphers,
            "extensions": extensions,
            "elliptic_curves": curves,
            "ec_point_formats": ec_point_formats,
        }
    except Exception:
        return {"ja3": ja3_str, "ja3_hash": hashlib.md5(ja3_str.encode()).hexdigest()}

# --- CREATE FINGERPRINT ---
@fingerprint_bp.route('/fingerprints', methods=['POST'])
@api_key_required
def create_fingerprint(current_user):
    data = request.json or {}

    browser_fp = data.get('fingerprint')
    if not browser_fp:
        return jsonify({'error': 'Missing fingerprint'}), 400

    ja3_fp = request.headers.get('X-JA3', '')
    print("ja3_fp:", ja3_fp)
    # Parse and attach JA3 info if present
    if ja3_fp:
        parsed = _parse_ja3(ja3_fp)
        data['ja3'] = parsed.get('ja3') if isinstance(parsed, dict) else ja3_fp
        data['ja3_hash'] = parsed.get('ja3_hash') if isinstance(parsed, dict) else hashlib.md5(ja3_fp.encode()).hexdigest()
        data['ja3_parsed'] = parsed

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
        'ja3_hash': data.get('ja3_hash')
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

def _apply_sorting(data, sort_field, sort_direction):
    """Apply sorting to the data"""
    if not sort_field or not data:
        return data
    
    reverse = sort_direction.lower() == 'desc'
    
    try:
        return sorted(data, key=lambda x: str(x.get(sort_field, '')).lower(), reverse=reverse)
    except Exception as e:
        print(f"Sorting error: {e}")
        return data

def _apply_filtering(data, search_query):
    """Apply global search filtering to the data"""
    if not search_query or not data:
        return data
    
    search_query = search_query.lower()
    filtered_data = []
    
    for item in data:
        # Search across all string fields
        searchable_fields = [
            'request_id', 'fingerprint', 'device_type', 'platform', 
            'time_zone', 'user_agent', 'color_depth', 'color_gamut'
        ]
        
        found = False
        for field in searchable_fields:
            value = str(item.get(field, '')).lower()
            if search_query in value:
                found = True
                break
        
        if found:
            filtered_data.append(item)
    
    return filtered_data

def _apply_pagination(data, page, page_size):
    """Apply pagination to the data"""
    if not data:
        return [], 0, 0
    
    total_items = len(data)
    total_pages = (total_items + page_size - 1) // page_size
    
    start_index = (page - 1) * page_size
    end_index = start_index + page_size
    
    paginated_data = data[start_index:end_index]
    
    return paginated_data, total_items, total_pages

# --- LIST MERGED FINGERPRINTS WITH PAGINATION ---
@fingerprint_bp.route('/fingerprints/merged', methods=['GET'])
@jwt_protected
def list_merged_fingerprints(current_user):
    workspace_id = request.args.get("workspace_id")
    page = int(request.args.get("page", 1))
    page_size = int(request.args.get("page_size", 10))
    sort_field = request.args.get("sort_field", "created_at")
    sort_direction = request.args.get("sort_direction", "desc")
    search_query = request.args.get("search", "")
    
    if page < 1:
        page = 1
    if page_size < 1 or page_size > 100:
        page_size = 10
    
    fingerprints = firestore_get_all('fingerprints')
    deviceinfo_list = firestore_get_all('deviceinfo')
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

        deviceinfo_filtered = [d for d in deviceinfo_list if in_workspace_rec(d)]
        fingerprints_filtered = [f for f in fingerprints if in_workspace_rec(f)]
    else:
        deviceinfo_filtered = deviceinfo_list
        fingerprints_filtered = fingerprints

    fingerprints_dict = {}
    for fp in fingerprints_filtered:
        if isinstance(fp, dict) and fp.get('fingerprint'):
            fingerprints_dict[fp.get('fingerprint')] = fp

    merged_data = []
    matched_count = 0
    unmatched_count = 0
    
    for device in deviceinfo_filtered:
        fp = device.get('fingerprint')
        
        if fp and fp in fingerprints_dict:
            fp_data = fingerprints_dict[fp]
            matched_count += 1
        else:
            fp_data = {}
            unmatched_count += 1
        
        merged_entry = {
            "request_id": fp_data.get("id", device.get("id", "")),
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
        return jsonify({
            "data": [],
            "pagination": {
                "page": page,
                "page_size": page_size,
                "total_items": 0,
                "total_pages": 0,
                "has_next": False,
                "has_prev": False
            },
            "message": "No data"
        }), 200

    original_count = len(merged_data)
    if search_query:
        merged_data = _apply_filtering(merged_data, search_query)
    
    merged_data = _apply_sorting(merged_data, sort_field, sort_direction)
    
    # Apply pagination
    paginated_data, total_items, total_pages = _apply_pagination(merged_data, page, page_size)
    
    # Prepare response
    response = {
        "data": paginated_data,
        "pagination": {
            "page": page,
            "page_size": page_size,
            "total_items": total_items,
            "total_pages": total_pages,
            "has_next": page < total_pages,
            "has_prev": page > 1
        }
    }
    
    if search_query:
        response["search"] = {
            "query": search_query,
            "filtered_items": total_items,
            "total_items": original_count
        }
    
    return jsonify(response), 200



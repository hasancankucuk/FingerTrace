

from datetime import datetime
from flask import Blueprint, jsonify, request
from backend.helpers.firebase_utils import firestore_set
from helpers.api_key_helper import api_key_required


deviceinfo_bp = Blueprint("device_info_bp", __name__)

@deviceinfo_bp.route('/deviceinfo', methods=['POST'])
@api_key_required
def create_device_info():
    device_info = request.json
    if not device_info or 'fingerprint' not in device_info:
        return jsonify({"error": "Missing fingerprint in device info"}), 400

    device_info['created_at'] = datetime.utcnow().isoformat()
    device_info['updated_at'] = datetime.utcnow().isoformat()

    firestore_set('deviceinfo', device_info.get("fingerprint"), device_info)
    return jsonify({"message": "Device info received", "fingerprint": device_info.get("fingerprint")}), 201
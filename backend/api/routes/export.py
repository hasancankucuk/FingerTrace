from flask import Blueprint, send_file, request, jsonify
from helpers.jwt_token_helper import jwt_protected
from helpers.firebase_utils import firestore_query
from helpers.pdf_generator import generate_fingerprints_pdf, generate_analytics_pdf
import io
from datetime import datetime

export_bp = Blueprint('export', __name__)

@export_bp.route('/export/fingerprints/pdf', methods=['POST'])
@jwt_protected
def export_fingerprints_pdf(current_user):
    """Export fingerprints as PDF with merged device info"""
    try:
        data = request.json
        workspace_id = data.get('workspace_id')
        
        if not workspace_id:
            return jsonify({'error': 'Workspace ID required'}), 400
        
        # Use existing utility to fetch data
        from helpers.map_device_type import map_device_type
        
        fingerprints = firestore_query('fingerprints', 'workspace', '==', workspace_id)
        deviceinfo = firestore_query('deviceinfo', 'workspace', '==', workspace_id)
        
        # Merging logic similar to list_merged_fingerprints
        fingerprints_dict = {fp.get('fingerprint'): fp for fp in fingerprints if isinstance(fp, dict) and fp.get('fingerprint')}

        merged_data = []
        for device in deviceinfo:
            fp_id = device.get('fingerprint')
            fp_data = fingerprints_dict.get(fp_id, {})
            
            merged_entry = {
                "fingerprint": fp_id or "",
                "created_at": device.get("created_at") or fp_data.get("created_at", ""),
                "device_type": map_device_type(device.get("device_type")),
                "platform": device.get("platform") or fp_data.get("platform", ""),
                "browser": device.get("user_agent") or fp_data.get("user_agent", ""), # Or more specific browser if available
                "ip": device.get("ip") or fp_data.get("ip", ""),
            }
            merged_data.append(merged_entry)
        
        # Sort by date
        merged_data.sort(key=lambda x: x.get('created_at', ''), reverse=True)

        pdf_bytes = generate_fingerprints_pdf(merged_data, workspace_id)
        
        return send_file(
            io.BytesIO(pdf_bytes),
            mimetype='application/pdf',
            as_attachment=True,
            download_name=f'fingerprints_{workspace_id}_{datetime.now().strftime("%Y%m%d")}.pdf'
        )
    
    except Exception as e:
        import traceback
        traceback.print_exc()
        print(f"PDF export error: {str(e)}")
        return jsonify({'error': str(e)}), 500

@export_bp.route('/export/analytics/pdf', methods=['POST'])
@jwt_protected
def export_analytics_pdf(current_user):
    """Export analytics as PDF"""
    try:
        data = request.json
        workspace_id = data.get('workspace_id')
        analytics_data = data.get('analytics_data')
        
        if not workspace_id or not analytics_data:
            return jsonify({'error': 'Missing required data'}), 400
        
        # Generate PDF
        pdf_bytes = generate_analytics_pdf(analytics_data, workspace_id)
        
        # Send file
        return send_file(
            io.BytesIO(pdf_bytes),
            mimetype='application/pdf',
            as_attachment=True,
            download_name=f'analytics_{workspace_id}.pdf'
        )
    
    except Exception as e:
        print(f"PDF export error: {str(e)}")
        return jsonify({'error': str(e)}), 500

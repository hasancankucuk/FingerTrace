from flask import Blueprint, send_file, request, jsonify
from helpers.jwt_token_helper import jwt_protected
from helpers.firebase_utils import firestore_get_all
from helpers.pdf_generator import generate_fingerprints_pdf, generate_analytics_pdf
import io

export_bp = Blueprint('export', __name__)

@export_bp.route('/export/fingerprints/pdf', methods=['POST'])
@jwt_protected
def export_fingerprints_pdf(current_user):
    """Export fingerprints as PDF"""
    try:
        data = request.json
        workspace_id = data.get('workspace_id')
        
        if not workspace_id:
            return jsonify({'error': 'Workspace ID required'}), 400
        
        # Get fingerprints
        fingerprints = firestore_get_all('fingerprints')
        
        # Filter by workspace
        user_fingerprints = [
            fp for fp in fingerprints
            if isinstance(fp, dict) and fp.get('workspace') == workspace_id
        ]
        
        # Generate PDF
        pdf_bytes = generate_fingerprints_pdf(user_fingerprints, workspace_id)
        
        # Send file
        return send_file(
            io.BytesIO(pdf_bytes),
            mimetype='application/pdf',
            as_attachment=True,
            download_name=f'fingerprints_{workspace_id}.pdf'
        )
    
    except Exception as e:
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

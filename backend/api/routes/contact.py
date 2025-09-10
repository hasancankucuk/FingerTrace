from flask import Blueprint, jsonify, request, current_app
from flask_mail import Message
from datetime import datetime
from threading import Thread
import re

RECIPIENT_MAP = {
    'general': 'support@fingertrace.app',
    'technical': 'tech@fingertrace.app',
    'security': 'security@fingertrace.app',
    'enterprise': 'enterprise@fingertrace.app',
    'partnership': 'partnership@fingertrace.app',
    'sales': 'sales@fingertrace.app',
    'billing': 'billing@fingertrace.app',
    'other': 'support@fingertrace.app'
}

contact_bp = Blueprint('contact_bp', __name__)

def send_async_email(mail, msg):
    """Mail instance'i parametre olarak al"""
    def send_message():
        with current_app.app_context():
            try:
                mail.send(msg)
                print(f"Email sent successfully to {msg.recipients}")
            except Exception as e:
                print(f"Error sending email: {e}")
    
    thread = Thread(target=send_message)
    thread.daemon = True
    thread.start()

@contact_bp.route('/contact', methods=['POST'])
def contact():
    try:
        # Mail instance'i current_app üzerinden al
        from main import mail  # Local import - circular import'u önler
        
        data = request.json or {}
        name = data.get('name')
        email = data.get('email')
        company = data.get('company', '')
        subject = data.get('subject')
        message = data.get('message')
        inquiry_type = data.get('inquiry_type', 'general')

        if not (name and email and subject and message):
            return jsonify({'error': 'Missing required fields'}), 400

        recipient = RECIPIENT_MAP.get(inquiry_type.lower(), 'support@fingertrace.app')
        reference_id = f"FT-{datetime.now().strftime('%Y%m%d')}-{hash(email) % 10000:04d}"

        msg = Message(
            subject=f"[{inquiry_type.title()}] {subject}",
            sender=current_app.config['MAIL_DEFAULT_SENDER'],
            recipients=[recipient]
        )
        
        msg.body = f"""
New contact form submission from FingerTrace website:

Name: {name}
Email: {email}
Company: {company or 'Not provided'}
Inquiry Type: {inquiry_type}
Subject: {subject}

Message:
{message}

Reference ID: {reference_id}
Submitted at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
        """

        # Mail instance'i parametre olarak geç
        send_async_email(mail, msg)

        return jsonify({'success': True, 'reference_id': reference_id}), 200
        
    except Exception as e:
        print(f"Error in contact form: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({'error': 'Internal server error'}), 500

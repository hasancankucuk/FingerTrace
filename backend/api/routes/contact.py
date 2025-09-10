from flask import Blueprint, jsonify, request, current_app
from flask_mail import Message
from datetime import datetime
from threading import Thread
import re

RECIPIENT_MAP = {
    'general': 'support@fingertrace.app',
    'technical': 'support@fingertrace.app',
    'security': 'security@fingertrace.app',
    'enterprise': 'enterprise@fingertrace.app',
    'partnership': 'partnership@fingertrace.app',
    'sales': 'sales@fingertrace.app',
    'billing': 'billing@fingertrace.app',
    'other': 'support@fingertrace.app'
}

contact_bp = Blueprint('contact_bp', __name__)

def send_async_email(app, mail, msg):
    """App instance'i parametre olarak al ve context oluştur"""
    with app.app_context():
        try:
            mail.send(msg)
        except Exception as e:
            print(f"Error sending email: {e}")

@contact_bp.route('/contact', methods=['POST'])
def contact():
    try:
        from main import mail  # main.py'den mail instance'ını al
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

        # App instance'i al ve thread'e geç
        app = current_app._get_current_object()
        thread = Thread(target=send_async_email, args=(app, mail, msg))
        thread.daemon = True
        thread.start()

        return jsonify({'success': True, 'reference_id': reference_id}), 200
        
    except Exception as e:
        print(f"Error in contact form: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({'error': 'Internal server error'}), 500
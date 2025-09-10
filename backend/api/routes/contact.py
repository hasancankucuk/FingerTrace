from flask import Blueprint, jsonify, request, current_app
from flask_mail import Message
from datetime import datetime
from threading import Thread
import re
from main import app, mail

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
def send_async_email(msg):
    def send_message():
        with app.app_context():
            mail.send(msg)
    Thread(target=send_message).start()

@contact_bp.route('/contact', methods=['POST'])
def contact():
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
        sender=app.config['MAIL_DEFAULT_SENDER'],
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

    send_async_email(msg)

    return jsonify({'success': True, 'reference_id': reference_id}), 200

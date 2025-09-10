from flask import Blueprint, jsonify, request, current_app
from flask_mail import Message
from datetime import datetime
from threading import Thread
import re

contact_bp = Blueprint('contact_bp', __name__)

def validate_email(email):
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

def send_async_email(app, mail, msg):
    with app.app_context():
        try:
            # Timeout ayarı ekle
            import socket
            socket.setdefaulttimeout(10)  # 10 saniye timeout
            mail.send(msg)
            print(f"Email sent successfully to {msg.recipients}")
        except Exception as e:
            print(f"Error sending email: {e}")

def send_email_async(mail, msg):
    from flask import current_app
    thread = Thread(target=send_async_email, args=(current_app._get_current_object(), mail, msg))
    thread.daemon = True  # Daemon thread yap
    thread.start()

def generate_reference_id(email):
    return f"FT-{datetime.now().strftime('%Y%m%d')}-{hash(email) % 10000:04d}"

@contact_bp.route('/contact', methods=['POST'])
def submit_contact_form():
    try:
        from main import mail
        data = request.get_json()

        required_fields = ['name', 'email', 'subject', 'message', 'inquiry_type']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'error': f'Missing required field: {field}'}), 400

        if not validate_email(data['email']):
            return jsonify({'error': 'Invalid email format'}), 400

        name = data['name']
        email = data['email']
        company = data.get('company', '')
        subject = data['subject']
        message = data['message']
        inquiry_type = data['inquiry_type']

        reference_id = generate_reference_id(email)

        # Sadece reference_id döndür, mail'i arka planda gönder
        if current_app.config.get('MAIL_USERNAME') and current_app.config.get('MAIL_PASSWORD'):
            support_msg = Message(
                subject=f"[{inquiry_type.upper()}] {subject}",
                recipients=['support@fingertrace.app'],
                sender=current_app.config['MAIL_DEFAULT_SENDER']
            )
            support_msg.body = f"""
New contact form submission:

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

            # Asenkron gönder - kullanıcıyı bekleme
            send_email_async(mail, support_msg)
        else:
            print("Mail not configured, skipping email sending")

        # Hemen response döndür
        return jsonify({
            'success': True, 
            'reference_id': reference_id,
            'message': 'Contact form submitted successfully. We will respond soon.'
        }), 200

    except Exception as e:
        print(f"Error in contact form: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({'error': 'Internal server error'}), 500

@contact_bp.route('/contact/test', methods=['GET'])
def test_email_config():
    smtp_user = current_app.config.get('MAIL_USERNAME')
    smtp_pass = current_app.config.get('MAIL_PASSWORD')

    return jsonify({
        'smtp_configured': bool(smtp_user and smtp_pass),
        'smtp_user': smtp_user if smtp_user else 'Not configured',
        'smtp_server': current_app.config.get('MAIL_SERVER'),
        'smtp_port': current_app.config.get('MAIL_PORT'),
        'mail_use_tls': current_app.config.get('MAIL_USE_TLS'),
        'mail_default_sender': current_app.config.get('MAIL_DEFAULT_SENDER')
    })
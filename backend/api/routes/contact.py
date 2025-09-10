from flask import Blueprint, jsonify, request, current_app
from flask_mail import Message
from datetime import datetime
from threading import Thread
import re

contact_bp = Blueprint('contact_bp', __name__)

@contact_bp.route('/contact', methods=['POST'])
def submit_contact_form():
    msg = Message(
        subject="Hello",
        sender="from@example.com",
        recipients=["support@fingertrace.app"],
    )

    msg.body = "This is a test email sent from the contact form."
    try:
        from main import mail  # main.py'deki mail örneğini içe aktar
        mail.send(msg)
        return jsonify({"message": "Email sent successfully"}), 200
    except Exception as e:
        print(f"Error sending email: {e}")
        return jsonify({"error": "Failed to send email"}), 500
# def validate_email(email):
#     pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
#     return re.match(pattern, email) is not None

# def send_async_email(app, mail, msg):
#     with app.app_context():
#         try:
#             mail.send(msg)
#         except Exception as e:
#             print(f"Error sending email: {e}")

# def send_email_async(mail, msg):
#     from flask import current_app
#     thread = Thread(target=send_async_email, args=(current_app._get_current_object(), mail, msg))
#     thread.start()

# def generate_reference_id(email):
#     return f"FT-{datetime.now().strftime('%Y%m%d')}-{hash(email) % 10000:04d}"

# @contact_bp.route('/contact', methods=['POST'])
# def submit_contact_form():
#     try:
#         from main import mail  # app yerine main olarak değiştir
#         data = request.get_json()

#         required_fields = ['name', 'email', 'subject', 'message', 'inquiry_type']
#         for field in required_fields:
#             if not data.get(field):
#                 return jsonify({'error': f'Missing required field: {field}'}), 400

#         if not validate_email(data['email']):
#             return jsonify({'error': 'Invalid email format'}), 400

#         if not current_app.config['MAIL_USERNAME'] or not current_app.config['MAIL_PASSWORD']:
#             return jsonify({'error': 'Email service not configured'}), 500

#         name = data['name']
#         email = data['email']
#         company = data.get('company', '')
#         subject = data['subject']
#         message = data['message']
#         inquiry_type = data['inquiry_type']

#         reference_id = generate_reference_id(email)

#         support_msg = Message(
#             subject=f"[{inquiry_type.upper()}] {subject}",
#             recipients=['support@fingertrace.app'],
#             sender=current_app.config['MAIL_DEFAULT_SENDER']
#         )
#         support_msg.body = f"""
# New contact form submission:

# Name: {name}
# Email: {email}
# Company: {company or 'Not provided'}
# Inquiry Type: {inquiry_type}
# Subject: {subject}

# Message:
# {message}

# Reference ID: {reference_id}
# Submitted at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
#         """

#         auto_reply_msg = Message(
#             subject=f"Thank you for contacting FingerTrace - {subject}",
#             recipients=[email],
#             sender=current_app.config['MAIL_DEFAULT_SENDER']
#         )

#         response_times = {
#             'general': '24 hours',
#             'technical': '12 hours',
#             'security': '2 hours',
#             'enterprise': '4 hours',
#             'sales': '4 hours',
#             'partnership': '24 hours',
#             'billing': '12 hours',
#             'other': '24 hours'
#         }

#         expected_response = response_times.get(inquiry_type, '24 hours')

#         auto_reply_msg.body = f"""
# Hi {name},

# Thank you for contacting FingerTrace! We've received your message.

# Subject: {subject}
# Inquiry Type: {inquiry_type.title()}
# Reference ID: {reference_id}

# Expected response: within {expected_response}.

# Best regards,
# FingerTrace Team
#         """

#         send_email_async(mail, support_msg)
#         send_email_async(mail, auto_reply_msg)

#         return jsonify({'success': True, 'reference_id': reference_id}), 200

#     except Exception as e:
#         print(f"Error in contact form: {e}")
#         import traceback
#         traceback.print_exc()  # Detaylı hata görmek için ekle
#         return jsonify({'error': 'Internal server error'}), 500


# @contact_bp.route('/contact/test', methods=['GET'])
# def test_email_config():
#     smtp_user = current_app.config.get('MAIL_USERNAME')
#     smtp_pass = current_app.config.get('MAIL_PASSWORD')

#     return jsonify({
#         'smtp_configured': bool(smtp_user and smtp_pass),
#         'smtp_user': smtp_user if smtp_user else 'Not configured',
#         'smtp_server': current_app.config.get('MAIL_SERVER'),
#         'smtp_port': current_app.config.get('MAIL_PORT'),
#         'mail_use_tls': current_app.config.get('MAIL_USE_TLS'),
#         'mail_default_sender': current_app.config.get('MAIL_DEFAULT_SENDER')
#     })

# # Test mail gönderme endpoint'i ekle
# @contact_bp.route('/contact/test-send', methods=['POST'])
# def test_send_email():
#     try:
#         from main import mail
        
#         test_msg = Message(
#             subject="Test Email from FingerTrace",
#             sender=current_app.config['MAIL_DEFAULT_SENDER'],
#             recipients=["hasancankucuk793@gmail.com"],
#             body="This is a test email to verify mail configuration works."
#         )
        
#         mail.send(test_msg)
#         return jsonify({'message': 'Test email sent successfully'}), 200
        
#     except Exception as e:
#         import traceback
#         traceback.print_exc()
#         return jsonify({'error': f'Failed to send test email: {str(e)}'}), 500
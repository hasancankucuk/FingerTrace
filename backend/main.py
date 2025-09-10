from datetime import timedelta
import os
from flask import Flask, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_mail import Mail
from dotenv import load_dotenv
from flask_mail import Mail, Message

from api.routes import (
    auth_bp, login_bp, fingerprint_bp, health_bp, analysis_bp,
    api_keys_bp, workspaces_bp, deviceinfo_bp, contact_bp, test_bp
)


load_dotenv()
ACCESS_EXPIRES = timedelta(hours=1)

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)

# JWT
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY')
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = ACCESS_EXPIRES

# Mail config
app.config['MAIL_SERVER'] = os.getenv('SMTP_HOST')
app.config['MAIL_PORT'] = int(os.getenv('SMTP_PORT', 465))
app.config['MAIL_USE_SSL'] =  True
app.config['MAIL_USERNAME'] = os.getenv('SMTP_USER')
app.config['MAIL_PASSWORD'] = os.getenv('SMTP_PASS')

# app.config['MAIL_SERVER'] = os.getenv('MAIL_SERVER', 'smtp.gmail.com')
# app.config['MAIL_USERNAME'] = os.getenv('SMTP_USER', 'fingertraaceapp@gmail.com')
# app.config['MAIL_PASSWORD'] = os.getenv('SMTP_PASS', 'adff sxyw saoj vvvx')
# app.config['MAIL_DEFAULT_SENDER'] = os.getenv('MAIL_DEFAULT_SENDER', app.config['MAIL_USERNAME'])



# app.config['MAIL_PORT'] = 465
# app.config['MAIL_USE_SSL'] = True
# app.config['MAIL_USERNAME'] = "fingertraaceapp@gmail.com"
# app.config['MAIL_PASSWORD'] = "adff sxyw saoj vvvx"


# Mail instance - bu global olmalı
mail = Mail(app)
print(mail)
jwt = JWTManager(app)

# Blueprints
app.register_blueprint(auth_bp)
app.register_blueprint(login_bp)
app.register_blueprint(fingerprint_bp)
app.register_blueprint(health_bp)
app.register_blueprint(analysis_bp)
app.register_blueprint(api_keys_bp)
app.register_blueprint(workspaces_bp)
app.register_blueprint(deviceinfo_bp)
app.register_blueprint(contact_bp)
app.register_blueprint(test_bp)

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({"status": "ok", "service": "FingerTrace API"}), 200

@app.errorhandler(404)
def not_found(error):
    return jsonify({"error": "Not found"}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({"error": "Internal server error"}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True, use_reloader=False)
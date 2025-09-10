from datetime import timedelta
import os
from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_mail import Mail
from dotenv import load_dotenv

from api.routes import (
    auth_bp, login_bp, fingerprint_bp, health_bp, analysis_bp,
    api_keys_bp, workspaces_bp, deviceinfo_bp, contact_bp
)


load_dotenv()
ACCESS_EXPIRES = timedelta(hours=1)

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)

# JWT
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY')
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = ACCESS_EXPIRES

# Mail config
app.config['MAIL_SERVER'] = os.getenv('MAIL_SERVER', 'smtp.gmail.com')
app.config['MAIL_PORT'] = int(os.getenv('MAIL_PORT', 587))
app.config['MAIL_USE_TLS'] = os.getenv('MAIL_USE_TLS', 'true').lower() == 'true'
app.config['MAIL_USERNAME'] = os.getenv('MAIL_USERNAME')
app.config['MAIL_PASSWORD'] = os.getenv('MAIL_PASSWORD')
app.config['MAIL_DEFAULT_SENDER'] = os.getenv('MAIL_DEFAULT_SENDER', app.config['MAIL_USERNAME'])

mail = Mail(app)
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
app.register_blueprint(contact_bp, url_prefix="/api")

@app.route('/api/health', methods=['GET'])
def health_check():
    from datetime import datetime
    from flask import jsonify
    return jsonify({'status': 'healthy', 'timestamp': datetime.now().isoformat()})

@app.errorhandler(404)
def not_found(error):
    return {'error': 'Endpoint not found'}, 404

@app.errorhandler(500)
def internal_error(error):
    return {'error': 'Internal server error'}, 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, use_reloader=False)
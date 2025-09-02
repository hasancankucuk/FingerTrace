from datetime import timedelta
from flask import Flask # type: ignore
from flask_cors import CORS # type: ignore
from flask_jwt_extended import JWTManager # type: ignore
from api.routes import auth_bp, login_bp, fingerprint_bp, health_bp, analysis_bp, api_keys_bp, workspaces_bp, deviceinfo_bp

ACCESS_EXPIRES = timedelta(hours=1)

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)
app.config['JWT_SECRET_KEY'] = 'H9jGsv4lykGeRToN3DQ3-322PH2MmcGu8Wm4AN7os2E'
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = ACCESS_EXPIRES

jwt = JWTManager(app)

app.register_blueprint(auth_bp)
app.register_blueprint(login_bp)
app.register_blueprint(fingerprint_bp)
app.register_blueprint(health_bp)
app.register_blueprint(analysis_bp)
app.register_blueprint(api_keys_bp)
app.register_blueprint(workspaces_bp)
app.register_blueprint(deviceinfo_bp)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, use_reloader=False)
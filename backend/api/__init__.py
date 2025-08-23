from datetime import timedelta
from flask import Flask # type: ignore
from flask_cors import CORS # type: ignore
from .auth import auth_bp
from .login import login_bp
from .fingerprint import fingerprint_bp
from .health import health_bp
from .analysis import analysis_bp
from .api_keys import api_keys_bp
from .workspaces import workspaces_bp

from flask_jwt_extended import JWTManager # type: ignore

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

def main():
    app.run(debug=True, host="0.0.0.0", port=5000, use_reloader=False, threaded=True)

if __name__ == '__main__':
    main()
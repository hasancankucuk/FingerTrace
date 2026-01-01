from datetime import timedelta
import os
from threading import Thread
from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from dotenv import load_dotenv
from socket_extensions import socketio
from flask_socketio import SocketIO, emit

from api.routes import (
    auth_bp, login_bp, fingerprint_bp, health_bp, analysis_bp,
    api_keys_bp, workspaces_bp, deviceinfo_bp, contact_bp, blog_bp, anomalies_bp
)
from api.routes.export import export_bp


load_dotenv()
ACCESS_EXPIRES = timedelta(hours=1)

app = Flask(__name__)


from werkzeug.middleware.proxy_fix import ProxyFix
# x_for=1: Trust the first X-Forwarded-For header (from Caddy)
# x_proto=1: Trust the X-Forwarded-Proto header (https)
# x_host=1: Trust the X-Forwarded-Host header
# x_port=1: Trust the X-Forwarded-Port header
# x_prefix=1: Trust the X-Forwarded-Prefix header
app.wsgi_app = ProxyFix(app.wsgi_app, x_for=1, x_proto=1, x_host=1, x_prefix=1)

allowed_origins = os.getenv("ALLOWED_ORIGINS", "*").split(",")
CORS(app, resources={r"/api/*": {"origins": allowed_origins}}, supports_credentials=True)

redis_url = f"redis://{os.getenv('REDIS_HOST', 'redis')}:{os.getenv('REDIS_PORT', 6379)}/0"
socketio.init_app(app, cors_allowed_origins="*", message_queue=redis_url, async_mode='threading')
import helpers.socket_events

# JWT
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY')
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = ACCESS_EXPIRES

jwt = JWTManager(app)

# Blueprints
app.register_blueprint(auth_bp, url_prefix='/api')
app.register_blueprint(login_bp, url_prefix='/api')
app.register_blueprint(fingerprint_bp, url_prefix='/api')
app.register_blueprint(health_bp, url_prefix='/api')
app.register_blueprint(analysis_bp, url_prefix='/api')
app.register_blueprint(api_keys_bp, url_prefix='/api')
app.register_blueprint(workspaces_bp, url_prefix='/api')
app.register_blueprint(deviceinfo_bp, url_prefix='/api')
app.register_blueprint(contact_bp, url_prefix='/api')
app.register_blueprint(blog_bp, url_prefix='/api')
app.register_blueprint(anomalies_bp, url_prefix='/api')
app.register_blueprint(export_bp, url_prefix='/api')

@app.errorhandler(404)
def not_found(error):
    return jsonify({"error": "Not found"}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({"error": "Internal server error"}), 500

if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port=5000, debug=True, use_reloader=False)
from datetime import datetime
import hashlib
from math import comb
from flask import Blueprint, jsonify, request

test_bp = Blueprint('test_bp', __name__)
@test_bp.route('/test', methods=['GET'])
def test_email_config():
   return jsonify({'message': 'Email configuration is valid'}), 200
from flask import Blueprint, jsonify, request, current_app
from flask_mail import Message
from datetime import datetime
from threading import Thread
import re

contact_bp = Blueprint('contact_bp', __name__)

@contact_bp.route('/contacts', methods=['POST'])
def submit_contact_form():
   return jsonify({'message': 'Contact form endpoint'}), 200


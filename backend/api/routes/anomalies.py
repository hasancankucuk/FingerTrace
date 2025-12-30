from flask import Blueprint, request, jsonify
import requests
import math
import operator
from datetime import datetime
from helpers.firebase_utils import firestore_get, firestore_get_all, firestore_query, firestore_set
from helpers.api_rate_limiting import rate_limit

anomalies_bp = Blueprint("anomalies", __name__)

OPERATORS = {
    "gt": operator.gt,
    "lt": operator.lt,
    "eq": operator.eq,
    "neq": operator.ne,
    "contains": lambda a, b: str(b) in str(a)
}

def evaluate_condition(current_val, op_key, target_val):
    try:
        op_func = OPERATORS.get(op_key)
        if not op_func: return False
        
        return op_func(float(current_val), float(target_val))
    except (ValueError, TypeError):
        return op_func(str(current_val), str(target_val))

@anomalies_bp.route("/save-rules", methods=["POST"])
def save_rules():
    try:
        data = request.get_json(force=True)
        if not data:
            return jsonify({"error": "No data provided"}), 400

        if isinstance(data, str):
            import json
            data = json.loads(data)

        if not isinstance(data, list):
            data = [data]

        for rule in data:
            rule_type = rule.get('type')
            workspace_id = rule.get('workspace_id')

            if not rule_type or not workspace_id or not rule.get('conditions')  or rule.get('risk_level') is None:
                print(f"Skipping invalid rule: type={rule_type}, workspace_id={workspace_id}")
                continue

            rule_config = {
                "type": rule_type,
                "conditions": rule.get('conditions', []),
                "risk_level": rule.get('risk_level', 'low'),
                "updated_at": datetime.utcnow().isoformat(),
                "workspace_id": workspace_id
            }

            doc_id = f"{workspace_id}_{rule_type}"
            
            firestore_set('settings', doc_id, rule_config)
        
        return jsonify({"status": "success", "message": "All rules saved"}), 200

    except Exception as e:
        print(f"Error in save_rules: {str(e)}")
        return jsonify({"error": str(e)}), 500

@anomalies_bp.route("/get-anomaly-rules", methods=["GET"])
def get_anomaly_rules():
   data = request.args
   workspace_id = data.get("workspace_id")
   
   if not workspace_id:
      return jsonify({"error": "Workspace ID is required"}), 400

   rules = firestore_query('settings', 'workspace_id', '==', workspace_id)
   
   formatted_rules = []
   for rule in rules:
       formatted_rules.append({
           "type": rule.get("type"),
           "conditions": rule.get("conditions", []),
           "risk_level": rule.get("risk_level", "low"),
           "workspace_id": rule.get("workspace_id")
       })

   return jsonify(formatted_rules), 200

@anomalies_bp.route("/get-fast-travel", methods=["GET"])
def get_fast_travel():
    workspace_id = request.args.get('workspace_id')
    
    if workspace_id:
        devices = firestore_query('deviceinfo', 'workspace', '==', workspace_id)
        anomalies = [d for d in devices if d.get('is_fast_travel') == True]
    else:
        anomalies = firestore_query('deviceinfo', 'is_fast_travel', '==', True)

    return jsonify(anomalies)

@anomalies_bp.route("/get-rate-limiting", methods=["GET"])
def get_rate_limiting():
    rate_limit_alerts = firestore_query('alerts', 'type', '==', 'Velocity Attack')
    rate_limit_alerts.sort(key=lambda x: x.get('created_at', ''), reverse=True)
    return jsonify(rate_limit_alerts), 200


def calculate_distance(lat1, lon1, lat2, lon2):
    R = 6371 
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = math.sin(dlat / 2)**2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon / 2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return R * c


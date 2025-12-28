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
        data = request.get_json()
        if not data:
            return jsonify({"error": "No data provided"}), 400

        rule_type = data.get('type')
        if not rule_type:
            return jsonify({"error": "Rule type is required"}), 400

        rule_config = {
            "type": rule_type,
            "conditions": data.get('conditions', []),
            "risk_level": data.get('risk_level', 'low'),
            "updated_at": datetime.utcnow().isoformat()
        }

        firestore_set('settings', rule_type, rule_config)
        return jsonify({"status": "success", "message": f"Rules for {rule_type} saved"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@anomalies_bp.route("/get-fast-travel", methods=["GET"])
def get_fast_travel():
    devices = firestore_get_all('deviceinfo')
    
    rules_doc = firestore_get('settings', 'fast_travel') or {}
    dynamic_rules = rules_doc.get('conditions', [])
    
    fast_travel_anomalies = []

    for device in devices:
        current = device.get('current_location')
        previous = device.get('previous_location')
        
        if current and previous and all(k in current for k in ('lat', 'lon')) and all(k in previous for k in ('lat', 'lon')):
            
            distance = calculate_distance(
                previous['lat'], previous['lon'],
                current['lat'], current['lon']
            )

            try:
                t1 = datetime.fromisoformat(device.get('previous_location_timestamp'))
                t2 = datetime.utcnow() # Veya current_location_timestamp
                time_diff = (t2 - t1).total_seconds() / 3600
                speed = distance / time_diff if time_diff > 0 else 0
            except:
                continue

            metrics = {
                "estimated_speed": speed,
                "distance_km": distance,
                "time_diff": time_diff
            }

            is_anomaly = False
            triggered_by = None

            for rule in dynamic_rules:
                field = rule.get('field')
                op = rule.get('operator')
                val = rule.get('value')
                
                if field in metrics:
                    if evaluate_condition(metrics[field], op, val):
                        is_anomaly = True
                        triggered_by = rule
                        break # Şimdilik bir kuralın tutması yeterli (OR)

            if is_anomaly:
                fast_travel_anomalies.append({
                    "fingerprint": device.get('fingerprint'),
                    "distance_km": round(distance, 2),
                    "estimated_speed_kmh": round(speed, 2),
                    "from": previous.get('city'),
                    "to": current.get('city'),
                    "triggered_rule": triggered_by,
                    "severity": rules_doc.get('risk_level', 'medium')
                })

    return jsonify(fast_travel_anomalies)

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

def get_location(ip_address):
    try:
        if "," in ip_address:
            ip_address = ip_address.split(",")[0].strip()
        response = requests.get(f"http://ip-api.com/json/{ip_address}", timeout=5)
        data = response.json()
        if data.get("status") == "success":
            return {
                "country": data.get("country"),
                "city": data.get("city"),
                "lat": data.get("lat"),
                "lon": data.get("lon"),
                "isp": data.get("isp")
            }
    except Exception as e:
        print(f"Location error: {e}")
    return None
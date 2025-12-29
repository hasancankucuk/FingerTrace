from api.routes.anomalies import calculate_distance, OPERATORS
from datetime import datetime
from helpers.firebase_utils import firestore_get


def check_fast_travel_anomaly(device_info):
    current = device_info.get('current_location')
    previous = device_info.get('previous_location')
    
    if not current or not previous or not all(k in current for k in ('lat', 'lon')) or not all(k in previous for k in ('lat', 'lon')):
        return None

    dist = calculate_distance(previous['lat'], previous['lon'], current['lat'], current['lon'])
    
    if dist < 0.5:
        return None

    try:
        t1 = datetime.fromisoformat(device_info.get('previous_location_timestamp'))
        t2 = datetime.fromisoformat(device_info.get('current_location_timestamp'))
        diff = (t2 - t1).total_seconds() / 3600
        speed = dist / diff if diff > 0 else 0
    except:
        return None

    rules_doc = firestore_get('settings', 'fast_travel') or {}
    dynamic_rules = rules_doc.get('conditions', [])
    
    metrics = {"estimated_speed": speed, "distance_km": dist, "time_diff": diff}
    
    if not dynamic_rules:
        dynamic_rules = [
            {"field": "estimated_speed", "operator": "gt", "value": 800},
            {"field": "distance_km", "operator": "gt", "value": 500}
        ]

    for rule in dynamic_rules:
        f, op, val = rule.get('field'), rule.get('operator'), rule.get('value')
        if f in metrics:
            try:
                if OPERATORS.get(op)(float(metrics[f]), float(val)):
                    return {
                        "is_anomaly": True,
                        "speed": round(speed, 2),
                        "distance": round(dist, 2),
                        "severity": rules_doc.get('risk_level', 'medium'),
                        "rule_triggered": f"{f} {op} {val}"
                    }
            except: 
                continue
            
    return None
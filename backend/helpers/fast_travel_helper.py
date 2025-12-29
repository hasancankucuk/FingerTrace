import math
from datetime import datetime
from helpers.firebase_utils import firestore_get
import operator

OPERATORS = {
    "gt": operator.gt,
    "lt": operator.lt,
    "eq": operator.eq,
    "neq": operator.ne,
}

def calculate_distance(lat1, lon1, lat2, lon2):
    R = 6371 
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = math.sin(dlat / 2)**2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon / 2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return R * c

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
    
    for rule in dynamic_rules:
        f, op, val = rule.get('field'), rule.get('operator'), rule.get('value')
        if f in metrics:
            try:
                if OPERATORS.get(op)(float(metrics[f]), float(val)):
                    return {
                        "is_anomaly": True,
                        "speed": round(speed, 2),
                        "distance": round(dist, 2),
                        "severity": rules_doc.get('risk_level', 'medium')
                    }
            except: continue
            
    return None
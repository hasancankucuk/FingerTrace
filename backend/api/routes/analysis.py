from helpers.firebase_utils import get_user, firestore_query, firestore_query_multi
from helpers.redis_client import get_cached_data, set_cached_data
from helpers.jwt_token_helper import jwt_protected
from helpers.api_rate_limiting import rate_limit
from flask import Blueprint, jsonify, request
import datetime

from helpers.get_browser_from_au import get_browser_from_ua, top_n
from helpers.get_country_from_timezone import get_country_from_timezone

analysis_bp = Blueprint("analysis", __name__)

@rate_limit("analysis")
@analysis_bp.route("/analysis", methods=["GET"])
@jwt_protected
def analysis(current_user):
    try:
        days = int(request.args.get("days", 7))
        days = max(1, min(days, 365))
        workspace_id = request.args.get("workspace_id")
        
        if not workspace_id:
            return jsonify({"error": "Workspace ID is required"}), 400


        cached = get_cached_data("analysis", workspace_id, days)
        if cached:
            return jsonify(cached)

        user = get_user(current_user)
        user_email = user.get("email")


        today = datetime.date.today()
        start_date = today - datetime.timedelta(days=days)
        start_datetime = datetime.datetime.combine(start_date, datetime.time.min)
       
        api_keys_docs = firestore_query_multi(
            "api_keys", 
            "workspace_id", "==", workspace_id,
            "created_by", "==", user_email
        )

        print(firestore_query("api_keys", "workspace_id", "==", workspace_id))
        print(firestore_query("api_keys", "created_by", "==", user_email))
        print(api_keys_docs)
        
        user_api_key_ids = [d.get("id") or d.get("key") for d in api_keys_docs if (d.get("id") or d.get("key"))]
        
        print(f"DEBUG: Found {len(api_keys_docs)} api_keys for user {user_email}")

        if not user_api_key_ids:
             return jsonify({
                "usage": 0,
                "uniqueVisitors": 0,
                "eventsPerVisitor": 0,
                "apiUsage": [0] * days,
                "apiUsageLabels": [str(today - datetime.timedelta(days=i)) for i in range(days - 1, -1, -1)],
                "topBrowsers": [],
                "timezones": [],
            })

        fingerprints_docs = firestore_query_multi(
            "fingerprints", 
            "workspace", "==", workspace_id, 
            "created_at", ">=", start_datetime.isoformat()
        )            
        
        user_fingerprints = [fp for fp in fingerprints_docs if fp.get("api_key") in user_api_key_ids]

        deviceinfo_docs = firestore_query_multi(
            "deviceinfo", 
            "workspace", "==", workspace_id, 
            "created_at", ">=", start_datetime.isoformat()
        )
        
        user_deviceinfo = [d for d in deviceinfo_docs if d.get("api_key") in user_api_key_ids]

        api_usage = []
        api_usage_labels = []
        fingerprints_by_date = {}

        for fp in user_fingerprints:
            created_at = fp.get("created_at")
            if created_at:
                date_str = str(created_at)[:10]
                fingerprints_by_date[date_str] = fingerprints_by_date.get(date_str, 0) + 1

        for i in range(days - 1, -1, -1):
            day_str = str(today - datetime.timedelta(days=i))
            api_usage_labels.append(day_str)
            api_usage.append(fingerprints_by_date.get(day_str, 0))

        def count_unique_visitors(fps):
            visitor_set = set()
            for f in fps:
                val = f.get("device_id") or f.get("fingerprint") or f.get("fp_id") or f.get("id")
                if val:
                    visitor_set.add(str(val))
                else:
                    key_tuple = (f.get("ip"), f.get("user_agent"), f.get("origin"))
                    visitor_set.add(str(key_tuple))
            return len(visitor_set)

        unique_visitors = count_unique_visitors(user_fingerprints)
        events_per_visitor = round(len(user_fingerprints) / unique_visitors, 2) if unique_visitors else 0

        browser_list = []
        for d in user_deviceinfo:
            browser = d.get('browser') or get_browser_from_ua(d.get('user_agent') or "")
            if browser: browser_list.append(browser)
        top_browsers = top_n(browser_list)

        timezone_list = []
        for d in user_deviceinfo:
            tz_val = d.get('time_zone')
            if tz_val:
                country = get_country_from_timezone(tz_val) if "/" in str(tz_val) else tz_val
                timezone_list.append(country)
        top_timezones = top_n(timezone_list)

        result = {
            "usage": sum(api_usage),
            "uniqueVisitors": unique_visitors,
            "eventsPerVisitor": events_per_visitor,
            "apiUsage": api_usage,
            "apiUsageLabels": api_usage_labels,
            "topBrowsers": top_browsers,
            "timezones": top_timezones,
        }
        
        set_cached_data("analysis", workspace_id, days, result)
        return jsonify(result)

    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500
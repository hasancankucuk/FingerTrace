from helpers.firebase_utils import get_user, db
from helpers.jwt_token_helper import jwt_protected
from helpers.api_rate_limiting import rate_limit
from flask import Blueprint, jsonify, request
import random
import datetime

from helpers.get_browser_from_au import get_browser_from_ua, top_n
from helpers.get_country_from_timezone import get_country_from_timezone

analysis_bp = Blueprint("analysis", __name__)

@rate_limit("analysis")
@analysis_bp.route("/analysis", methods=["GET"])
@jwt_protected
def analysis(current_user):
    from helpers.firebase_utils import firestore_get_all

    try:
        days = int(request.args.get("days", 7))
        days = max(1, min(days, 365))

        user = get_user(current_user)
        workspace_id = request.args.get("workspace_id")
        
        if not workspace_id:
            return jsonify({"error": "Workspace ID is required"}), 400

        api_keys = firestore_get_all("api_keys")
        
        user_api_keys = []
        for key in api_keys:
            if isinstance(key, dict):
                if (key.get("created_by") == user.get("email") and 
                    key.get("workspace_id") == workspace_id):
                    user_api_keys.append(key)

        user_api_key_ids = []
        for key in user_api_keys:
            key_id = key.get("id") or key.get("key")
            if key_id:
                user_api_key_ids.append(key_id)

        fingerprints = firestore_get_all("fingerprints")
        if not fingerprints:
            return jsonify(
                {
                    "usage": 0,
                    "uniqueVisitors": 0,
                    "eventsPerVisitor": 0,
                    "apiUsage": [],
                    "apiUsageLabels": [],
                    "topBrowsers": [],
                    "timezones": [],
                }
            )
        deviceinfo = firestore_get_all("deviceinfo")

        user_fingerprints = []
        for fp in fingerprints:
            if (isinstance(fp, dict) and 
                fp.get("api_key") in user_api_key_ids and
                fp.get("workspace") == workspace_id):
                user_fingerprints.append(fp)

        user_deviceinfo = []
        for d in deviceinfo:
            if (isinstance(d, dict) and 
                d.get("api_key") in user_api_key_ids and
                d.get("workspace") == workspace_id):
                user_deviceinfo.append(d)

        today = datetime.date.today()
        api_usage = []
        api_usage_labels = []
        for i in range(days - 1, -1, -1):
            day = today - datetime.timedelta(days=i)
            api_usage_labels.append(str(day))
            count = sum(
                1
                for fp in user_fingerprints
                if isinstance(fp, dict)
                and "created_at" in fp
                and str(fp["created_at"])[:10] == str(day)
            )
            api_usage.append(count)

        def count_unique_visitors_from_fps(fps):
            ids = set()
            for f in fps:
                if not isinstance(f, dict):
                    continue
                val = (
                    f.get("device_id")
                    or f.get("fingerprint")
                    or f.get("fp_id")
                    or f.get("id")
                )
                if val:
                    ids.add(str(val))
                    continue
                key_tuple = (f.get("ip"), f.get("user_agent"), f.get("origin"))
                ids.add(str(key_tuple))
            return len(ids)

        unique_visitors = count_unique_visitors_from_fps(user_fingerprints)

        events_per_visitor = (
            round(len(user_fingerprints) / unique_visitors, 2) if unique_visitors else 0
        )

        # Safe browser analysis
        browser_list = []
        for d in user_deviceinfo:
            if isinstance(d, dict):
                browser = d.get('browser') or get_browser_from_ua(d.get('user_agent') or "")
                if browser:
                    browser_list.append(browser)
        top_browsers = top_n(browser_list)

        # Safe timezone analysis
        timezone_list = []
        for d in user_deviceinfo:
            if isinstance(d, dict):
                timezone = d.get('time_zone') or get_country_from_timezone(d.get('time_zone'))
                if timezone:
                    timezone_list.append(timezone)
        top_timezones = top_n(timezone_list)

        return jsonify(
            {
                "usage": sum(api_usage),
                "uniqueVisitors": unique_visitors,
                "eventsPerVisitor": events_per_visitor,
                "apiUsage": api_usage,
                "apiUsageLabels": api_usage_labels,
                "topBrowsers": top_browsers,
                "timezones": top_timezones,
            }
        )
    except Exception as e:
        return jsonify({"error": str(e)}), 500

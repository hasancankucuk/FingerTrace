from helpers.jwt_token_helper import jwt_protected
from flask import Blueprint, jsonify, request
import random
import datetime

from helpers.get_browser_from_au import get_browser_from_ua, top_n
from helpers.get_country_from_timezone import get_country_from_timezone

analysis_bp = Blueprint("analysis", __name__)

@analysis_bp.route("/analysis", methods=["GET"])
@jwt_protected
def analysis():
    from helpers.firebase_utils import firestore_get_all
    try:
        days = int(request.args.get("days", 7))
        days = max(1, min(days, 365))

        fingerprints = firestore_get_all("fingerprints")
        deviceinfo = firestore_get_all("deviceinfo")

        today = datetime.date.today()
        api_usage = []
        api_usage_labels = []
        for i in range(days-1, -1, -1):
            day = today - datetime.timedelta(days=i)
            api_usage_labels.append(str(day))
            count = sum(
                1
                for fp in fingerprints
                if isinstance(fp, dict) and "created_at" in fp and str(fp["created_at"])[:10] == str(day)
            )
            api_usage.append(count)

        def count_unique_visitors_from_fps(fps):
            ids = set()
            for f in fps:
                if not isinstance(f, dict):
                    continue
                val = f.get("device_id") or f.get("fingerprint") or f.get("fp_id") or f.get("id")
                if val:
                    ids.add(str(val))
                    continue
                key_tuple = (f.get("ip"), f.get("user_agent"), f.get("origin"))
                ids.add(str(key_tuple))
            return len(ids)

        unique_visitors = count_unique_visitors_from_fps(fingerprints)

        events_per_visitor = round(len(fingerprints) / unique_visitors, 2) if unique_visitors else 0

        top_browsers = top_n(
            [
                (d.get('browser') or get_browser_from_ua(d.get('user_agent') or ""))
                for d in deviceinfo
            ]
        )
        top_timezones = top_n(
            (d.get('time_zone') or get_country_from_timezone(d.get('time_zone'))) for d in deviceinfo
        )
        
        return jsonify({
            "usage": sum(api_usage),
            "uniqueVisitors": unique_visitors,
            "eventsPerVisitor": events_per_visitor,
            "apiUsage": api_usage,
            "apiUsageLabels": api_usage_labels,
            "topBrowsers": top_browsers,
            "timezones": top_timezones,
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

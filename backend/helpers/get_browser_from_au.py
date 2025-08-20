from typing import List
from collections import Counter

def get_browser_from_ua(ua: str) -> str:
    """Derive browser family from a User-Agent string."""
    if not ua:
        return "Unknown"
    ua_lower = ua.lower()

    # try user_agents package if available (more accurate)
    try:
        from user_agents import parse as ua_parse  # type: ignore
        parsed = ua_parse(ua)
        family = parsed.browser.family
        return family or "Unknown"
    except Exception:
        pass

    if "edg/" in ua_lower or "edge" in ua_lower:
        return "Edge"
    if "opr/" in ua_lower or "opera" in ua_lower:
        return "Opera"
    if "chrome/" in ua_lower and "chromium" not in ua_lower and "edg/" not in ua_lower:
        return "Chrome"
    if "crios" in ua_lower:
        return "Chrome"
    if "firefox" in ua_lower:
        return "Firefox"
    if "safari/" in ua_lower and "chrome" not in ua_lower and "chromium" not in ua_lower:
        return "Safari"
    if "msie" in ua_lower or "trident/" in ua_lower:
        return "Internet Explorer"
    return "Other"

def top_n(items: List[str], n: int = 3) -> List[str]:
    """Return top-n most common non-empty items."""
    return [x for x, _ in Counter(items).most_common(n) if x]
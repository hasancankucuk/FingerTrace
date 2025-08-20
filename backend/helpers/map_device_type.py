def map_device_type(raw_type):
    """
    Maps raw device type value to a readable string.
    Supports int, str, None. Returns 'unknown' for invalid input.
    """
    if raw_type is None:
        return "unknown"
    try:
        val = int(raw_type)
        if val == 0:
            return "desktop"
        elif val == 1:
            return "mobile"
        elif val == 2:
            return "tablet"
        else:
            return "unknown"
    except (ValueError, TypeError):
        # If not int, return as string or 'unknown'
        s = str(raw_type).lower()
        if s in {"desktop", "mobile", "tablet"}:
            return s
        return "unknown"
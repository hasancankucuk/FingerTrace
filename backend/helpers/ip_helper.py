import ipaddress
import re

def ensure_ipv4(ip):
    """
    Attempt to extract a valid IPv4 address from a string (which might be IPv6, or a list).
    Returns the IPv4 string if found, else None.
    """
    if not ip:
        return None
    
    # If it's a comma-separated list, check each
    if ',' in ip:
        for part in ip.split(','):
            res = ensure_ipv4(part.strip())
            if res:
                return res
        return None

    ip = ip.strip()
    
    try:
        # Check if it's already a valid IPv4
        ip_obj = ipaddress.ip_address(ip)
        if ip_obj.version == 4:
            return str(ip_obj)
        elif ip_obj.version == 6:
            # Check for IPv4-mapped IPv6 (e.g., ::ffff:192.168.1.1)
            if ip_obj.ipv4_mapped:
                return str(ip_obj.ipv4_mapped)
    except ValueError:
        pass
        
    return None

def get_best_ip(request):
    """
    Extract the best client IP from Flask request object.
    Prioritizes IPv4 if available in any forwarding header.
    """
    # 1. Try Cloudflare Pseudo-IPv4 or specific headers
    # (requires Cloudflare config, but good to check)
    cf_ipv4 = request.headers.get("CF-Pseudo-IPv4")
    if cf_ipv4:
        return cf_ipv4

    # 2. Check standard headers for any valid IPv4
    # Order: CF-Connecting-IP -> X-Forwarded-For
    # REMOVED X-Real-IP because Caddy sets it to Cloudflare IP (remote_host)
    headers_to_check = [
        "CF-Connecting-IP",
        "X-Forwarded-For"
    ]
    
    for header in headers_to_check:
        val = request.headers.get(header)
        # Check for multiple IPs in one header (comma separated)
        if val and ',' in val:
            for part in val.split(','):
                ipv4 = ensure_ipv4(part.strip())
                if ipv4:
                    return ipv4
        else:
            ipv4 = ensure_ipv4(val)
            if ipv4:
                return ipv4
            
    # 3. Fallback: Accept IPv6 from CF-Connecting-IP or X-Forwarded-For
    # We avoid X-Real-IP and remote_addr if possible as they might be the proxy
    best_ip = (
        request.headers.get("CF-Connecting-IP") or
        request.headers.get("X-Forwarded-For", "").split(',')[0]
    )
    
    if best_ip:
        return best_ip.strip()
        
    # Last resort: remote_addr (might be Caddy/Cloudflare IP)
    return request.remote_addr

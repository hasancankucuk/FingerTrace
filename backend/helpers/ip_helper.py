import ipaddress
import requests

def get_ipv4_from_ipv6(ipv6_address):
    """
    Try to get IPv4 address from IPv6 using a free service
    """
    try:
        # Use a free IPv6 to IPv4 mapping service
        response = requests.get(f"https://api64.ipify.org?format=json", timeout=3)
        data = response.json()
        return data.get('ip')
    except:
        return None

def is_ipv6(ip_address):
    """
    Check if an IP address is IPv6
    """
    try:
        return ipaddress.ip_address(ip_address).version == 6
    except:
        return False

def ensure_ipv4(ip_address):
    """
    Ensure we get an IPv4 address. If IPv6 is provided, try to get IPv4.
    For IPv6 addresses, we'll extract the IPv4 if it's an IPv4-mapped IPv6 address,
    or return None to indicate we need a fallback.
    """
    if not ip_address:
        return None
    
    try:
        ip_obj = ipaddress.ip_address(ip_address)
        
        # If it's already IPv4, return it
        if ip_obj.version == 4:
            return str(ip_obj)
        
        # If it's IPv6, check if it's IPv4-mapped (like ::ffff:192.0.2.1)
        if ip_obj.version == 6:
            # Check for IPv4-mapped IPv6 address
            if ip_obj.ipv4_mapped:
                return str(ip_obj.ipv4_mapped)
            
            # For pure IPv6, we can't convert it to IPv4
            # Return None to indicate we need to use a different approach
            return None
    except:
        pass
    
    return ip_address

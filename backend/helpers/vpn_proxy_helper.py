
import requests

def check_vpn_proxy(ip):
    if ip in ['127.0.0.1', 'localhost'] or ip.startswith('192.168.') or ip.startswith('10.'):
        return False, {"message": "Private IP address", "probability": 0}
    
    try:
        response = requests.get(
            f"http://check.getipintel.net/check.php?ip={ip}&contact=admin@fingertrace.app&flags=m",
            timeout=5
        )
        
        probability = float(response.text.strip())
        
        is_vpn = probability > 0.95
        
        details = {
            "probability": probability,
            "is_vpn": is_vpn,
            "threshold": 0.95,
            "source": "getipintel.net"
        }
        
        return is_vpn, details
        
    except Exception as e:
        print(f"[VPN CHECK ERROR] {str(e)}")
        return False, {"error": str(e), "probability": 0}
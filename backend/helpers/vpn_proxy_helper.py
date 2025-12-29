
import requests
def check_vpn_proxy(ip):
    res = requests.get(f"http://ip-api.com/json/{ip}?fields=proxy,hosting,mobile").json()
    
    is_vpn = False
    if res.get('proxy') == True or res.get('hosting') == True:
        is_vpn = True
        
    return is_vpn, res
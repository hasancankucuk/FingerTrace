import requests
def get_location(ip_address):
    try:
        if "," in ip_address:
            ip_address = ip_address.split(",")[0].strip()
        response = requests.get(f"http://ip-api.com/json/{ip_address}", timeout=5)
        data = response.json()
        if data.get("status") == "success":
            return {
                "country": data.get("country"),
                "city": data.get("city"),
                "lat": data.get("lat"),
                "lon": data.get("lon"),
                "isp": data.get("isp")
            }
    except Exception as e:
        print(f"Location error: {e}")
    return None
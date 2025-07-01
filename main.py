import requests
import json

def fetch_data(url):
    """Fetch data from API endpoint"""
    try:
        response = requests.get(url)
        return response.json()
    except Exception as e:
        print(f"Error: {e}")
        return None

if __name__ == "__main__":
    data = fetch_data("http://localhost:3000")
    print(json.dumps(data, indent=2))

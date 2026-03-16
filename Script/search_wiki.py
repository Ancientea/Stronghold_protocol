import requests
import json

def search_wiki():
    url = "https://prts.wiki/api.php"
    params = {
        "action": "query",
        "list": "search",
        "srsearch": "卫戍协议",
        "srlimit": 50,
        "format": "json"
    }
    
    try:
        response = requests.get(url, params=params)
        data = response.json()
        
        print(f"Found {len(data['query']['search'])} pages matching '卫戍协议':")
        for page in data['query']['search']:
            print(f"- {page['title']}")
            
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    search_wiki()


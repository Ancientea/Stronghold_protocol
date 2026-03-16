import requests
from bs4 import BeautifulSoup
import json
import re

print("Starting checks...")

try:
    from bs4 import BeautifulSoup
    print("BeautifulSoup imported successfully.")
except ImportError:
    print("BeautifulSoup not found. Please install it with 'pip install beautifulsoup4'")
    exit(1)

def fetch_json(file_name):
    base_urls = [
        "https://static.prts.wiki/app/spdatabase",
        "https://static.prts.wiki/app/spdatabase/assets",
        "https://static.prts.wiki/app/spdatabase/data"
    ]
    
    for base in base_urls:
         url = f"{base}/{file_name}"
         print(f"Trying {url}...")
         try:
             r = requests.get(url, headers={
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.131 Safari/537.36"
             })
             if r.status_code == 200:
                 print(f"*** FOUND {file_name} at {url} ***")
                 return r.json()
         except Exception as e:
             print(e)
    return None

def fetch_and_parse():
    # ...existing code...
    # (Skip the JS fetching part if not needed anymore, or keep it)
    
    # Fetch alliance data
    data = fetch_json("alliance_1st.json")
    if data:
        # Save to file so we can inspect or use it
        with open("E:/Python/stronghold_protocol/alliance_data.json", "w", encoding="utf-8") as f:
            json.dump(data, f, indent=4, ensure_ascii=False)
        print("Saved alliance_data.json")
        
        # Print summary
        # Depending on structure, print keys or count
        print(f"Data type: {type(data)}")
        if isinstance(data, dict):
            print(f"Keys: {list(data.keys())}")
        elif isinstance(data, list):
            print(f"List length: {len(data)}")
            if len(data) > 0:
                print(f"Sample item: {data[0]}")


if __name__ == "__main__":
    fetch_and_parse()


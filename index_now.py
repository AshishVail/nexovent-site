import google.auth
from google.oauth2 import service_account
from google.auth.transport.requests import Request
import requests
import json
import os
import xml.etree.ElementTree as ET

# --- सेटिंग्स ---
SITEMAP_URL = "https://nexovent.tech/sitemap.xml" # आपकी साइट का मैप

def get_urls_from_sitemap(url):
    try:
        response = requests.get(url)
        root = ET.fromstring(response.content)
        # सैटमैप से सारे लिंक्स निकालना
        urls = [child[0].text for child in root if len(child) > 0]
        return urls
    except Exception as e:
        print(f"Sitemap पढ़ने में दिक्कत आई: {e}")
        return []

def send_indexing_request(url, scoped_credentials):
    endpoint = "https://indexing.googleapis.com/v1/urlNotifications:publish"
    scoped_credentials.refresh(Request())
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {scoped_credentials.token}"
    }
    body = {"url": url, "type": "URL_UPDATED"}
    response = requests.post(endpoint, data=json.dumps(body), headers=headers)
    print(f"Link: {url} | Status: {response.status_code}")

# --- मेन प्रोसेस ---
key_data = os.getenv('INDEXING_SERVICE_ACCOUNT_JSON')
if not key_data:
    print("Error: JSON Key नहीं मिली!")
    exit()

info = json.loads(key_data)
credentials = service_account.Credentials.from_service_account_info(info)
scoped_credentials = credentials.with_scopes(['https://www.googleapis.com/auth/indexing'])

links = get_urls_from_sitemap(SITEMAP_URL)

if not links:
    print("कोई लिंक नहीं मिला।")
else:
    print(f"{len(links)} लिंक्स मिले हैं, गूगल को भेज रहा हूँ...")
    for link in links:
        send_indexing_request(link, scoped_credentials)

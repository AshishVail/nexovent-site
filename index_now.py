import google.auth
from google.oauth2 import service_account
from google.auth.transport.requests import Request
import requests
import json
import os

# GitHub Secrets से चाबी उठाना
key_data = os.getenv('INDEXING_SERVICE_ACCOUNT_JSON')
if not key_data:
    print("Error: JSON Key not found in Secrets!")
    exit()

info = json.loads(key_data)
credentials = service_account.Credentials.from_service_account_info(info)
scoped_credentials = credentials.with_scopes(['https://www.googleapis.com/auth/indexing'])

# नया लिंक जिसे इंडेक्स करना है (इसे आप बदल सकते हैं)
url_to_index = "https://nexovent.tech/your-new-post"

def send_indexing_request(url):
    endpoint = "https://indexing.googleapis.com/v1/urlNotifications:publish"
    
    # टोकन रिफ्रेश करना
    scoped_credentials.refresh(Request())
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {scoped_credentials.token}"
    }
    
    body = {
        "url": url,
        "type": "URL_UPDATED"
    }
    
    response = requests.post(endpoint, data=json.dumps(body), headers=headers)
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.json()}")

send_indexing_request(url_to_index)


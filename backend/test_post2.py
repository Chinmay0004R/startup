import urllib.request
import json

req = urllib.request.Request('http://127.0.0.1:8000/api/v1/posts/', method='POST')
req.add_header('Content-Type', 'application/json')
try:
    urllib.request.urlopen(req, data=json.dumps({"author_name": "Test", "content": "Test"}).encode('utf-8'))
except Exception as e:
    print("Without token:", e, e.read().decode())

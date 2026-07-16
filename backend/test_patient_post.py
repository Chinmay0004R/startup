import urllib.request
import json
import urllib.error

# Login as patient
login_req = urllib.request.Request('http://127.0.0.1:8000/api/v1/auth/login', method='POST')
login_req.add_header('Content-Type', 'application/json')
login_res = urllib.request.urlopen(login_req, data=json.dumps({"email": "testpatient@example.com", "password": "password123"}).encode('utf-8'))
token = json.loads(login_res.read().decode())['access_token']

req = urllib.request.Request('http://127.0.0.1:8000/api/v1/posts/', method='POST')
req.add_header('Content-Type', 'application/json')
req.add_header('Authorization', f'Bearer {token}')

payloads_to_test = [
    {"author_name": "Patient", "content": "Test post from patient"}
]

for p in payloads_to_test:
    print(f"Testing {p}")
    try:
        urllib.request.urlopen(req, data=json.dumps(p).encode('utf-8'))
        print(" -> Success 200 OK")
    except urllib.error.HTTPError as e:
        print(f" -> Failed {e.code}: {e.read().decode()}")
    except Exception as e:
        print(f" -> Failed {e}")

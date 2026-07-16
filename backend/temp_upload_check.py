import os
import sys
sys.path.insert(0, os.getcwd())
from unittest.mock import patch
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)
resp = client.post('/api/v1/auth/login', json={'email':'testdoctor@example.com','password':'password123'})
print('login', resp.status_code, resp.text)
token = resp.json()['access_token']
with patch('app.api.v1.users.upload_image') as mock_upload:
    mock_upload.return_value = {'secure_url':'https://res.cloudinary.com/test/profile.png','public_id':'profile-123'}
    resp2 = client.post(
        '/api/v1/users/me/profile-image',
        headers={'Authorization': f'Bearer {token}'},
        files={'file': ('avatar.png', b'fake-image-bytes', 'image/png')},
    )
    print('upload', resp2.status_code, resp2.text)

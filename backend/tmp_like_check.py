from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)
token = client.post('/api/v1/auth/login', json={'email': 'testdoctor@example.com', 'password': 'password123'}).json()['access_token']
create = client.post('/api/v1/posts/', headers={'Authorization': f'Bearer {token}'}, json={'author_name': 'Dr. Test', 'content': 'x'})
post_id = create.json()['id']
print('create', create.json())
first = client.post(f'/api/v1/posts/{post_id}/like', headers={'Authorization': f'Bearer {token}'})
print('first', first.json())
second = client.post(f'/api/v1/posts/{post_id}/like', headers={'Authorization': f'Bearer {token}'})
print('second', second.json())

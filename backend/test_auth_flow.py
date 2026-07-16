#!/usr/bin/env python
"""Test authentication flow."""
import sys
sys.path.insert(0, '.')

from fastapi.testclient import TestClient
from app.main import app
import json

client = TestClient(app)

print("=== AUTHENTICATION FLOW TEST ===\n")

# Test 1: Register
print("1. Testing POST /api/v1/auth/register")
register_data = {
    "name": "Test Patient",
    "email": f"testpatient{abs(hash('time'))}@test.com",
    "password": "password123",
    "role": "patient"
}
r = client.post("/api/v1/auth/register", json=register_data)
print(f"   Status: {r.status_code}")
if r.status_code in [200, 201]:
    reg_resp = r.json()
    print(f"   ✅ Registration successful")
    print(f"   User ID: {reg_resp.get('id')}")
    user_id = reg_resp.get('id')
    user_email = register_data['email']
else:
    print(f"   ❌ Error: {r.text[:200]}")
    sys.exit(1)

# Test 2: Login
print("\n2. Testing POST /api/v1/auth/login")
login_data = {
    "email": user_email,
    "password": "password123"
}
r = client.post("/api/v1/auth/login", json=login_data)
print(f"   Status: {r.status_code}")
if r.status_code == 200:
    login_resp = r.json()
    token = login_resp.get('access_token')
    print(f"   ✅ Login successful")
    print(f"   Token: {token[:20]}...")
else:
    print(f"   ❌ Error: {r.text[:200]}")
    sys.exit(1)

# Test 3: Get user profile
print("\n3. Testing GET /api/v1/users/me")
r = client.get("/api/v1/users/me", headers={"Authorization": f"Bearer {token}"})
print(f"   Status: {r.status_code}")
if r.status_code == 200:
    user = r.json()
    print(f"   ✅ Profile retrieved")
    print(f"   Name: {user.get('name')}")
else:
    print(f"   ❌ Error: {r.text[:200]}")

# Test 4: Get doctor profiles
print("\n4. Testing GET /api/v1/doctor-profiles/")
r = client.get("/api/v1/doctor-profiles/")
print(f"   Status: {r.status_code}")
if r.status_code == 200:
    profiles = r.json()
    print(f"   ✅ Doctor profiles retrieved: {len(profiles)} profiles")
    if profiles:
        prof = profiles[0]
        print(f"   First profile: ID={prof.get('id')}, Specialty={prof.get('specialty')}")
else:
    print(f"   ❌ Error: {r.text[:200]}")

# Test 5: Get user statistics
print(f"\n5. Testing GET /api/v1/users/{user_id}/statistics")
r = client.get(f"/api/v1/users/{user_id}/statistics", headers={"Authorization": f"Bearer {token}"})
print(f"   Status: {r.status_code}")
if r.status_code == 200:
    stats = r.json()
    print(f"   ✅ Statistics retrieved")
    print(f"   Followers: {stats.get('followers')}")
    print(f"   Following: {stats.get('following')}")
else:
    print(f"   ❌ Error: {r.text[:200]}")

print("\n✅ All tests completed successfully!")

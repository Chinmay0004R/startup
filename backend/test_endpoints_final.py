#!/usr/bin/env python
"""Test backend endpoints."""
import sys
sys.path.insert(0, '.')

from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

print("=== TESTING ENDPOINTS ===\n")

# Test health
print("1. GET /health")
r = client.get("/health")
print(f"   Status: {r.status_code}")
print(f"   Response: {r.json()}\n")

# Test doctor-profiles
print("2. GET /api/v1/doctor-profiles/")
r = client.get("/api/v1/doctor-profiles/")
print(f"   Status: {r.status_code}")
if r.status_code == 200:
    data = r.json()
    print(f"   Response: {len(data)} profiles found")
    if data:
        print(f"   First profile: {data[0]}\n")
else:
    print(f"   Error: {r.text}\n")

# Test complaints
print("3. GET /api/v1/complaints/")
r = client.get("/api/v1/complaints/")
print(f"   Status: {r.status_code}")
if r.status_code == 200:
    print(f"   Response: {r.json()}\n")
else:
    print(f"   Error: {r.text}\n")

print("✅ All endpoint tests completed")

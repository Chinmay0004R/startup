#!/usr/bin/env python3
"""Test API endpoints to verify they work correctly."""

import json
import sys
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health():
    """Test health check endpoint."""
    print("Testing /health...")
    r = client.get("/health")
    print(f"  Status: {r.status_code}")
    if r.status_code != 200:
        print(f"  ERROR: Expected 200, got {r.status_code}")
        print(f"  Response: {r.text}")
        return False
    print(f"  OK")
    return True

def test_doctor_profiles():
    """Test doctor profiles endpoint."""
    print("Testing /api/v1/doctor-profiles/...")
    r = client.get("/api/v1/doctor-profiles/")
    print(f"  Status: {r.status_code}")
    if r.status_code not in [200, 401]:
        print(f"  ERROR: Expected 200 or 401, got {r.status_code}")
        print(f"  Response: {r.text}")
        return False
    print(f"  OK")
    return True

def test_registration():
    """Test user registration."""
    print("Testing POST /api/v1/auth/register...")
    payload = {
        "name": "Test User",
        "email": f"testuser{abs(hash('test'))}@example.com",
        "password": "password123",
        "role": "patient"
    }
    r = client.post("/api/v1/auth/register", json=payload)
    print(f"  Status: {r.status_code}")
    if r.status_code != 200:
        print(f"  ERROR: Expected 200, got {r.status_code}")
        print(f"  Response: {r.text}")
        return False
    print(f"  OK")
    return True

if __name__ == "__main__":
    print("=== API ENDPOINT TESTS ===\n")
    
    all_pass = True
    all_pass &= test_health()
    all_pass &= test_doctor_profiles()
    all_pass &= test_registration()
    
    print()
    if all_pass:
        print("✅ ALL TESTS PASSED")
        sys.exit(0)
    else:
        print("❌ SOME TESTS FAILED")
        sys.exit(1)

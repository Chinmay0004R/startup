#!/usr/bin/env python3
"""Test API endpoints to verify schema fixes."""

import sys
import time
import json

# Test using subprocess to call curl
import subprocess

BASE_URL = "http://localhost:8000"

def test_endpoint(method, path, data=None):
    """Test an endpoint and return the response."""
    url = f"{BASE_URL}{path}"
    cmd = ["curl", "-s", "-X", method]
    
    if data:
        cmd.extend(["-H", "Content-Type: application/json"])
        cmd.extend(["-d", json.dumps(data)])
    
    cmd.append(url)
    
    try:
        result = subprocess.run(cmd, capture_output=True, text=True, timeout=5)
        if result.returncode == 0:
            return result.stdout
        else:
            return None
    except:
        return None

def main():
    """Run all tests."""
    print("=== BACKEND API TESTS ===\n")
    
    # Test health
    print("1. Testing /health endpoint...")
    health = test_endpoint("GET", "/health")
    if health and "healthy" in health.lower():
        print("   ✅ Health endpoint working")
    else:
        print(f"   ❌ Health endpoint failed: {health}")
        return False
    
    # Test doctor profiles list
    print("2. Testing GET /api/v1/doctor-profiles/...")
    profiles = test_endpoint("GET", "/api/v1/doctor-profiles/")
    if profiles and ("[" in profiles or "[]" in profiles):
        print("   ✅ Doctor profiles endpoint working")
    else:
        print(f"   ❌ Doctor profiles failed: {profiles}")
        return False
    
    print("\n✅ All basic tests passed!")
    return True

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)

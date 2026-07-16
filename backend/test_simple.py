#!/usr/bin/env python3
"""Test API endpoints using urllib."""

import sys
import json
from urllib import request, error
import time

BASE_URL = "http://localhost:8000"

def test_url(path):
    """Test a URL and return the response or error."""
    url = f"{BASE_URL}{path}"
    try:
        with request.urlopen(url, timeout=3) as response:
            return response.status, response.read().decode()
    except error.URLError as e:
        return None, str(e)
    except Exception as e:
        return None, str(e)

print("Testing backend API...")
status, resp = test_url("/health")
if status == 200:
    print(f"✅ Health endpoint OK: {resp[:100]}")
else:
    print(f"❌ Health endpoint failed: {resp}")

status, resp = test_url("/api/v1/doctor-profiles/")
if status == 200:
    print(f"✅ Doctor profiles endpoint OK: {resp[:100]}")
else:
    print(f"❌ Doctor profiles failed: {resp}")

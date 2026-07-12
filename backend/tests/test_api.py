import unittest
import uuid
from unittest.mock import patch

from fastapi.testclient import TestClient

from app.main import app
from app.core.database import SessionLocal
from app.models.email_verification import EmailVerification


class SafetyNetworkAPITests(unittest.TestCase):
    def setUp(self):
        self.client = TestClient(app)

    def login_user(self, email: str, password: str) -> str:
        response = self.client.post(
            "/api/v1/auth/login",
            json={"email": email, "password": password},
        )
        self.assertEqual(response.status_code, 200)
        return response.json()["access_token"]

    def auth_header(self, token: str) -> dict:
        return {"Authorization": f"Bearer {token}"}

    def get_verification_otp(self, email: str) -> str:
        with SessionLocal() as db:
            record = db.query(EmailVerification).filter(EmailVerification.email == email).first()
            self.assertIsNotNone(record, f"Verification record for {email} should exist")
            return record.otp

    def test_list_doctors_endpoint(self):
        response = self.client.get("/api/v1/doctors/")
        self.assertEqual(response.status_code, 200)
        self.assertIsInstance(response.json(), list)

    def test_create_doctor_endpoint(self):
        payload = {
            "name": "Dr. Sara Khan",
            "specialty": "Cardiology",
            "email": f"sara+{uuid.uuid4().hex[:8]}@example.com",
            "hospital": "City General Hospital",
            "years_experience": 12,
            "registration_number": "REG-1001",
            "verified": True,
        }
        response = self.client.post("/api/v1/doctors/", json=payload)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["name"], payload["name"])
        self.assertEqual(response.json()["registration_number"], payload["registration_number"])

    def test_search_doctors_by_registration_number(self):
        unique_email = f"naveed+{uuid.uuid4().hex[:8]}@example.com"
        self.client.post(
            "/api/v1/doctors/",
            json={
                "name": "Dr. Naveed Aslam",
                "specialty": "Neurology",
                "email": unique_email,
                "registration_number": "REG-7002",
            },
        )
        response = self.client.get("/api/v1/doctors/?search=REG-7002")
        self.assertEqual(response.status_code, 200)
        self.assertTrue(any(doctor["registration_number"] == "REG-7002" for doctor in response.json()))

    def test_create_post_endpoint(self):
        token = self.login_user("testdoctor@example.com", "password123")
        payload = {
            "author_name": "Dr. Sara Khan",
            "content": "Today I am sharing my first update from the doctor dashboard.",
        }
        response = self.client.post("/api/v1/posts/", headers=self.auth_header(token), json=payload)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["author_name"], payload["author_name"])
        self.assertEqual(response.json()["likes"], 0)

    def test_list_posts_endpoint(self):
        token = self.login_user("testdoctor@example.com", "password123")
        self.client.post("/api/v1/posts/", headers=self.auth_header(token), json={"author_name": "Dr. Ali", "content": "Post one"})
        self.client.post("/api/v1/posts/", headers=self.auth_header(token), json={"author_name": "Dr. Ayesha", "content": "Post two"})

        response = self.client.get("/api/v1/posts/", headers=self.auth_header(token))
        self.assertEqual(response.status_code, 200)
        self.assertIsInstance(response.json(), list)
        self.assertGreaterEqual(len(response.json()), 2)

    def test_like_post_endpoint(self):
        token = self.login_user("testdoctor@example.com", "password123")
        create_response = self.client.post("/api/v1/posts/", headers=self.auth_header(token), json={"author_name": "Dr. Naveed", "content": "Please like this post"})
        post_id = create_response.json()["id"]

        response = self.client.post(f"/api/v1/posts/{post_id}/like", headers=self.auth_header(token))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["likes"], 1)

    def test_emergency_alert_endpoint(self):
        token = self.login_user("testdoctor@example.com", "password123")
        payload = {
            "doctor_name": "Dr. Ali Hassan",
            "location": "Downtown Clinic",
            "details": "Threat reported near reception",
        }
        response = self.client.post("/api/v1/safety/alerts/", headers=self.auth_header(token), json=payload)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["status"], "received")

    def test_complaint_endpoint(self):
        token = self.login_user("testpatient@example.com", "password123")
        payload = {
            "reporter_name": "Ayesha Malik",
            "category": "corruption",
            "details": "Referral request without consent",
        }
        response = self.client.post("/api/v1/complaints/", headers=self.auth_header(token), json=payload)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["status"], "submitted")

    def test_register_verify_and_login_flow(self):
        register_payload = {
            "name": "Dr. Ayesha",
            "email": f"doctor+{uuid.uuid4().hex[:8]}@example.com",
            "password": "SecurePass123!",
        }
        register_response = self.client.post("/api/v1/auth/register", json=register_payload)
        self.assertEqual(register_response.status_code, 200)
        self.assertEqual(register_response.json()["message"], "Verification code sent")
        self.assertNotIn("otp", register_response.json())

        otp = self.get_verification_otp(register_payload["email"])

        verify_response = self.client.post(
            "/api/v1/auth/verify",
            json={"email": register_payload["email"], "otp": otp},
        )
        self.assertEqual(verify_response.status_code, 200)
        self.assertEqual(verify_response.json()["message"], "Email verified successfully")

        login_response = self.client.post(
            "/api/v1/auth/login",
            json={"email": register_payload["email"], "password": register_payload["password"]},
        )
        self.assertEqual(login_response.status_code, 200)
        self.assertEqual(login_response.json()["message"], "Login successful")

    def test_google_login_flow(self):
        with patch("app.api.v1.auth._validate_google_token") as mock_validate:
            mock_validate.return_value = {
                "email": "google.user@example.com",
                "name": "Google User",
                "picture": "https://example.com/avatar.png",
                "email_verified": True,
            }

            response = self.client.post(
                "/api/v1/auth/google-login",
                json={"credential": "mock-google-id-token"},
            )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["user"]["email"], "google.user@example.com")
        self.assertTrue(response.json()["user"]["is_verified"])


if __name__ == "__main__":
    unittest.main()

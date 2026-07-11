import unittest

from fastapi.testclient import TestClient

from app.main import app


class SafetyNetworkAPITests(unittest.TestCase):
    def setUp(self):
        self.client = TestClient(app)

    def test_list_doctors_endpoint(self):
        response = self.client.get("/api/v1/doctors/")
        self.assertEqual(response.status_code, 200)
        self.assertIsInstance(response.json(), list)

    def test_create_doctor_endpoint(self):
        payload = {
            "name": "Dr. Sara Khan",
            "specialty": "Cardiology",
            "email": "sara@example.com",
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
        self.client.post(
            "/api/v1/doctors/",
            json={
                "name": "Dr. Naveed Aslam",
                "specialty": "Neurology",
                "email": "naveed@example.com",
                "registration_number": "REG-7002",
            },
        )
        response = self.client.get("/api/v1/doctors/?search=REG-7002")
        self.assertEqual(response.status_code, 200)
        self.assertTrue(any(doctor["registration_number"] == "REG-7002" for doctor in response.json()))

    def test_emergency_alert_endpoint(self):
        payload = {
            "doctor_name": "Dr. Ali Hassan",
            "location": "Downtown Clinic",
            "details": "Threat reported near reception",
        }
        response = self.client.post("/api/v1/safety/alerts/", json=payload)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["status"], "received")

    def test_complaint_endpoint(self):
        payload = {
            "reporter_name": "Ayesha Malik",
            "category": "corruption",
            "details": "Referral request without consent",
        }
        response = self.client.post("/api/v1/complaints/", json=payload)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["status"], "submitted")

    def test_register_verify_and_login_flow(self):
        register_payload = {
            "name": "Dr. Ayesha",
            "email": "doctor@example.com",
            "password": "SecurePass123!",
        }
        register_response = self.client.post("/api/v1/auth/register", json=register_payload)
        self.assertEqual(register_response.status_code, 200)
        self.assertEqual(register_response.json()["message"], "Verification code sent")
        self.assertNotIn("otp", register_response.json())

        from app.api.v1 import auth as auth_module

        verify_response = self.client.post(
            "/api/v1/auth/verify",
            json={"email": register_payload["email"], "otp": auth_module.verification_db[register_payload["email"]]["otp"]},
        )
        self.assertEqual(verify_response.status_code, 200)
        self.assertEqual(verify_response.json()["message"], "Email verified successfully")

        login_response = self.client.post(
            "/api/v1/auth/login",
            json={"email": register_payload["email"], "password": register_payload["password"]},
        )
        self.assertEqual(login_response.status_code, 200)
        self.assertEqual(login_response.json()["message"], "Login successful")


if __name__ == "__main__":
    unittest.main()

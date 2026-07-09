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
            "verified": True,
        }
        response = self.client.post("/api/v1/doctors/", json=payload)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["name"], payload["name"])

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


if __name__ == "__main__":
    unittest.main()

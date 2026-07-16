import unittest

from fastapi.testclient import TestClient

from app.main import app


class TestSOS(unittest.TestCase):
    def setUp(self):
        self._client_context = TestClient(app)
        self.client = self._client_context.__enter__()

    def tearDown(self):
        self._client_context.__exit__(None, None, None)

    def _login(self):
        response = self.client.post(
            "/api/v1/auth/login",
            json={"email": "testdoctor@example.com", "password": "password123"},
        )
        self.assertEqual(response.status_code, 200)
        return response.json()["access_token"]

    def test_create_sos_alert(self):
        token = self._login()
        response = self.client.post(
            "/api/v1/safety/alerts/",
            json={
                "doctor_name": "Dr. Test",
                "location": "123 Main St",
                "details": "Medical emergency in progress",
            },
            headers={"Authorization": f"Bearer {token}"},
        )
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["doctor_name"], "Dr. Test")
        self.assertEqual(data["status"], "received")

    def test_fetch_sos_alerts(self):
        token = self._login()
        self.client.post(
            "/api/v1/safety/alerts/",
            json={
                "doctor_name": "Dr. Test",
                "location": "123 Main St",
                "details": "Medical emergency in progress",
            },
            headers={"Authorization": f"Bearer {token}"},
        )

        response = self.client.get(
            "/api/v1/safety/alerts/",
            headers={"Authorization": f"Bearer {token}"},
        )
        self.assertEqual(response.status_code, 200)
        alerts = response.json()
        matching = [alert for alert in alerts if alert["doctor_name"] == "Dr. Test"]
        self.assertGreaterEqual(len(matching), 1)


if __name__ == "__main__":
    unittest.main()

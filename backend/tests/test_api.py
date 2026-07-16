import unittest
import uuid
from unittest.mock import patch

from fastapi.testclient import TestClient

from app.main import app
from app.core.database import SessionLocal
from app.core.security import create_access_token, get_password_hash
from app.models.email_verification import EmailVerification
from app.models.user import User, RoleEnum
from app.models.doctor_profile import DoctorProfile
from app.models.certificate import Certificate


class SafetyNetworkAPITests(unittest.TestCase):
    def setUp(self):
        self._client_context = TestClient(app)
        self.client = self._client_context.__enter__()

    def tearDown(self):
        self._client_context.__exit__(None, None, None)

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

    def test_search_doctors_with_filters(self):
        unique_city = f"FilterCity-{uuid.uuid4().hex[:8]}"
        with SessionLocal() as db:
            matching_user = User(
                name="Dr. Amina Shah",
                email=f"filter-match-{uuid.uuid4().hex[:8]}@example.com",
                role=RoleEnum.DOCTOR,
                hashed_password="",
                specialization="Neurology",
                hospital="Harbor Hospital",
                years_experience=12,
                medical_license="REG-FILTER-1",
                city=unique_city,
                is_verified=True,
            )
            db.add(matching_user)
            db.flush()
            matching_profile = DoctorProfile(
                user_id=matching_user.id,
                specialty="Neurology",
                hospital="Harbor Hospital",
                city=unique_city,
                state="Sindh",
                verification_status="verified",
                verified=True,
            )
            db.add(matching_profile)

            other_user = User(
                name="Dr. Ali Khan",
                email=f"filter-other-{uuid.uuid4().hex[:8]}@example.com",
                role=RoleEnum.DOCTOR,
                hashed_password="",
                specialization="Cardiology",
                hospital="Central Hospital",
                years_experience=5,
                medical_license="REG-FILTER-2",
                city="Lahore",
                is_verified=False,
            )
            db.add(other_user)
            db.flush()
            other_profile = DoctorProfile(
                user_id=other_user.id,
                specialty="Cardiology",
                hospital="Central Hospital",
                city="Lahore",
                state="Punjab",
                verification_status="pending_verification",
                verified=False,
            )
            db.add(other_profile)
            db.commit()

        response = self.client.get(
            f"/api/v1/doctors/?city={unique_city}&state=Sindh&verified=true&min_experience=10"
        )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()), 1)
        self.assertEqual(response.json()[0]["name"], "Dr. Amina Shah")

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

    def test_same_user_cannot_like_the_same_post_twice(self):
        token = self.login_user("testdoctor@example.com", "password123")
        create_response = self.client.post(
            "/api/v1/posts/",
            headers=self.auth_header(token),
            json={"author_name": "Dr. Naveed", "content": "Please like this post once"},
        )
        post_id = create_response.json()["id"]

        first_like = self.client.post(f"/api/v1/posts/{post_id}/like", headers=self.auth_header(token))
        second_like = self.client.post(f"/api/v1/posts/{post_id}/like", headers=self.auth_header(token))

        self.assertEqual(first_like.status_code, 200)
        self.assertEqual(second_like.status_code, 200)
        self.assertEqual(second_like.json()["likes"], 1)

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
            "description": "Referral request without consent",
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

    @patch("app.api.v1.users.upload_image")
    def test_profile_image_upload_persists_secure_url(self, mock_upload_image):
        mock_upload_image.return_value = {
            "secure_url": "https://res.cloudinary.com/test/profile.png",
            "public_id": "profile-123",
        }
        token = self.login_user("testdoctor@example.com", "password123")

        files = {"file": ("avatar.png", b"fake-image-bytes", "image/png")}
        response = self.client.post(
            "/api/v1/users/me/profile-image",
            headers=self.auth_header(token),
            files=files,
        )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["profile_image"], "https://res.cloudinary.com/test/profile.png")

        with SessionLocal() as db:
            user = db.query(User).filter(User.email == "testdoctor@example.com").first()
            self.assertEqual(user.profile_image, "https://res.cloudinary.com/test/profile.png")
            self.assertEqual(user.profile_image_public_id, "profile-123")

    @patch("app.api.v1.doctor_profiles.upload_asset")
    def test_doctor_license_upload_persists_secure_url(self, mock_upload_asset):
        mock_upload_asset.return_value = {
            "secure_url": "https://res.cloudinary.com/test/license.pdf",
            "public_id": "license-456",
        }

        token = self.login_user("testdoctor@example.com", "password123")
        with SessionLocal() as db:
            user = db.query(User).filter(User.email == "testdoctor@example.com").first()
            profile = DoctorProfile(user_id=user.id, specialty="Cardiology", hospital="Test Hospital")
            db.add(profile)
            db.commit()
            db.refresh(profile)
            profile_id = profile.id

        files = {"file": ("license.pdf", b"fake-pdf-bytes", "application/pdf")}
        response = self.client.post(
            "/api/v1/doctor-profiles/license",
            headers=self.auth_header(token),
            files=files,
        )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["license_document_url"], "https://res.cloudinary.com/test/license.pdf")
        self.assertEqual(response.json()["verification_status"], "pending_verification")

        with SessionLocal() as db:
            profile = db.query(DoctorProfile).filter(DoctorProfile.id == profile_id).first()
            self.assertEqual(profile.license_document_url, "https://res.cloudinary.com/test/license.pdf")
            self.assertEqual(profile.license_public_id, "license-456")
            self.assertEqual(profile.verification_status, "pending_verification")
            self.assertIsNotNone(profile.verification_date)
            self.assertIsNone(profile.rejection_reason)

    @patch("app.api.v1.doctor_profiles.upload_asset")
    def test_doctor_certificate_upload_persists_secure_url(self, mock_upload_asset):
        mock_upload_asset.return_value = {
            "secure_url": "https://res.cloudinary.com/test/certificate.pdf",
            "public_id": "certificate-789",
        }

        token = self.login_user("testdoctor@example.com", "password123")
        with SessionLocal() as db:
            user = db.query(User).filter(User.email == "testdoctor@example.com").first()
            profile = DoctorProfile(user_id=user.id, specialty="Cardiology", hospital="Test Hospital")
            db.add(profile)
            db.commit()
            db.refresh(profile)
            profile_id = profile.id

        files = {"file": ("certificate.pdf", b"fake-pdf-bytes", "application/pdf")}
        response = self.client.post(
            "/api/v1/doctor-profiles/certificate",
            headers=self.auth_header(token),
            files=files,
        )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["certificate_url"], "https://res.cloudinary.com/test/certificate.pdf")

        with SessionLocal() as db:
            certificate = db.query(Certificate).filter(Certificate.doctor_id == profile_id).first()
            self.assertIsNotNone(certificate)
            self.assertEqual(certificate.certificate_url, "https://res.cloudinary.com/test/certificate.pdf")
            self.assertEqual(certificate.public_id, "certificate-789")

    def test_admin_can_approve_doctor_profile(self):
        with SessionLocal() as db:
            doctor_user = db.query(User).filter(User.email == "testdoctor@example.com").first()
            profile = DoctorProfile(
                user_id=doctor_user.id,
                specialty="Cardiology",
                hospital="Test Hospital",
                verification_status="pending_verification",
                verified=False,
            )
            db.add(profile)
            db.commit()
            db.refresh(profile)
            profile_id = profile.id

        admin_token = create_access_token({"email": "admin@example.com", "role": "admin"})
        response = self.client.post(
            f"/api/v1/doctor-profiles/{profile_id}/review",
            headers=self.auth_header(admin_token),
            json={"decision": "approved"},
        )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["verification_status"], "verified")
        self.assertTrue(response.json()["verified"])

        with SessionLocal() as db:
            profile = db.query(DoctorProfile).filter(DoctorProfile.id == profile_id).first()
            self.assertEqual(profile.verification_status, "verified")
            self.assertTrue(profile.verified)
            self.assertIsNotNone(profile.verification_date)

    @patch("app.api.v1.users.delete_asset")
    @patch("app.api.v1.users.upload_image")
    def test_profile_image_replacement_deletes_old_cloudinary_asset(self, mock_upload_image, mock_delete_asset):
        mock_upload_image.return_value = {
            "secure_url": "https://res.cloudinary.com/test/new.png",
            "public_id": "new-profile",
        }
        with SessionLocal() as db:
            user = db.query(User).filter(User.email == "testdoctor@example.com").first()
            user.profile_image_public_id = "old-profile"
            db.commit()

        token = self.login_user("testdoctor@example.com", "password123")
        response = self.client.post(
            "/api/v1/users/me/profile-image",
            headers=self.auth_header(token),
            files={"file": ("avatar.png", b"new-bytes", "image/png")},
        )

        self.assertEqual(response.status_code, 200)
        mock_delete_asset.assert_called_once_with("old-profile", resource_type="image")

    def test_invalid_file_rejected(self):
        token = self.login_user("testdoctor@example.com", "password123")
        response = self.client.post(
            "/api/v1/users/me/profile-image",
            headers=self.auth_header(token),
            files={"file": ("avatar.txt", b"not-an-image", "text/plain")},
        )

        self.assertEqual(response.status_code, 400)

    def test_oversized_file_rejected(self):
        token = self.login_user("testdoctor@example.com", "password123")
        oversized = b"x" * (10 * 1024 * 1024 + 1)
        response = self.client.post(
            "/api/v1/users/me/profile-image",
            headers=self.auth_header(token),
            files={"file": ("avatar.png", oversized, "image/png")},
        )

        self.assertEqual(response.status_code, 400)


if __name__ == "__main__":
    unittest.main()

import json
import random
import re
import smtplib
import ssl
import urllib.parse
import urllib.request
from datetime import datetime, timedelta, timezone
from email.message import EmailMessage
from typing import Dict, Optional

from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.security import HTTPBearer

from ...core.config import settings
from ...core.security import get_password_hash, verify_password, create_access_token, verify_token
from ...schemas.auth import (
    RegisterRequest,
    VerifyRequest,
    LoginRequest,
    GoogleLoginRequest,
    LoginResponse,
    UserResponse,
)

router = APIRouter(prefix="/auth", tags=["auth"])
security = HTTPBearer()

# In-memory storage (replace with database in production)
users_db: Dict[str, dict] = {}
verification_db: Dict[str, dict] = {}


# Seed test users for development/testing
def _seed_test_users():
    """Seed test users for development"""
    test_users = {
        "testdoctor@example.com": {
            "name": "Dr. Test Doctor",
            "email": "testdoctor@example.com",
            "role": "doctor",
            "hashed_password": get_password_hash("password123"),
            "is_verified": True,
            "profile_image": None,
            "bio": None,
            "city": None,
            "specialization": None,
            "hospital": None,
            "followers_count": 0,
            "following_count": 0,
            "posts_count": 0,
            "created_at": datetime.utcnow().isoformat(),
        },
        "testpatient@example.com": {
            "name": "John Patient",
            "email": "testpatient@example.com",
            "role": "patient",
            "hashed_password": get_password_hash("password123"),
            "is_verified": True,
            "profile_image": None,
            "bio": None,
            "city": None,
            "specialization": None,
            "hospital": None,
            "followers_count": 0,
            "following_count": 0,
            "posts_count": 0,
            "created_at": datetime.utcnow().isoformat(),
        }
    }
    users_db.update(test_users)
    print("✓ Test users seeded:", list(test_users.keys()))


_seed_test_users()


def send_verification_email(email: str, otp: str) -> None:
    """Send OTP verification email"""
    smtp_host = settings.SMTP_HOST
    smtp_port = settings.SMTP_PORT
    sender_email = settings.SMTP_EMAIL
    sender_password = settings.SMTP_PASSWORD

    message = EmailMessage()
    message["Subject"] = "Healthcare Platform - Email Verification"
    message["From"] = sender_email
    message["To"] = email
    message.set_content(
        f"Your Healthcare Platform verification code is: {otp}\n"
        "Enter this code in the app to verify your email.\n"
        "This code expires in 10 minutes."
    )

    try:
        context = ssl.create_default_context()
        with smtplib.SMTP_SSL(smtp_host, smtp_port, context=context) as server:
            server.login(sender_email, sender_password)
            server.send_message(message)
    except Exception as e:
        print(f"Email sending failed: {e}")


def is_valid_email(email: str) -> bool:
    """Validate email format"""
    pattern = r"^[^@\s]+@[^@\s]+\.[^@\s]+$"
    return re.match(pattern, email) is not None


def _validate_google_token(credential: str) -> dict:
    """Validate a Google ID token via Google's public tokeninfo endpoint."""
    if not credential:
        raise HTTPException(status_code=400, detail="Google credential is required")

    url = f"https://oauth2.googleapis.com/tokeninfo?id_token={urllib.parse.quote(credential)}"
    try:
        with urllib.request.urlopen(url, timeout=5) as response:
            payload = json.load(response)
    except Exception as exc:
        raise HTTPException(status_code=401, detail="Invalid Google login credential") from exc

    if not payload.get("email_verified"):
        raise HTTPException(status_code=401, detail="Google account is not verified")

    return payload


def get_current_user(credentials = Depends(security)) -> dict:
    """Get current authenticated user from JWT token"""
    token = credentials.credentials
    payload = verify_token(token)
    
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    return payload


@router.post("/register", response_model=dict)
def register(payload: RegisterRequest):
    """Register a new user"""
    email = str(payload.email).lower().strip()

    if not is_valid_email(email):
        raise HTTPException(status_code=400, detail="Invalid email format")

    if email in users_db:
        raise HTTPException(status_code=400, detail="Email already registered")

    if len(payload.password) < 6:
        raise HTTPException(status_code=400, detail="Password must be at least 6 characters")

    otp = f"{random.randint(100000, 999999)}"
    users_db[email] = {
        "name": payload.name,
        "email": email,
        "role": payload.role.value,
        "hashed_password": get_password_hash(payload.password),
        "is_verified": False,
        "profile_image": None,
        "bio": None,
        "city": None,
        "specialization": None,
        "hospital": None,
        "followers_count": 0,
        "following_count": 0,
        "posts_count": 0,
        "created_at": datetime.utcnow().isoformat(),
    }
    verification_db[email] = {
        "otp": otp,
        "expires_at": datetime.now(timezone.utc) + timedelta(minutes=10),
    }

    try:
        send_verification_email(email, otp)
    except Exception:
        pass

    return {
        "message": "Verification code sent",
        "email": email,
    }


@router.post("/verify", response_model=dict)
def verify(payload: VerifyRequest):
    """Verify email with OTP"""
    email = str(payload.email).lower().strip()
    record = verification_db.get(email)

    if not record:
        raise HTTPException(status_code=400, detail="No verification request found")

    if datetime.now(timezone.utc) > record["expires_at"]:
        raise HTTPException(status_code=400, detail="Verification code expired")

    if record["otp"] != payload.otp:
        raise HTTPException(status_code=400, detail="Invalid verification code")

    user = users_db.get(email)
    if user:
        user["is_verified"] = True
        del verification_db[email]

    return {"message": "Email verified successfully"}


@router.post("/google-login", response_model=LoginResponse)
def google_login(payload: GoogleLoginRequest):
    """Authenticate with a Google ID token and issue a JWT token."""
    google_user = _validate_google_token(payload.credential)
    email = str(google_user.get("email", "")).lower().strip()

    if not email:
        raise HTTPException(status_code=400, detail="Google account email is required")

    user = users_db.get(email)
    if not user:
        users_db[email] = {
            "name": google_user.get("name") or email.split("@", 1)[0],
            "email": email,
            "role": "patient",
            "hashed_password": get_password_hash(f"google-oauth:{email}"),
            "is_verified": True,
            "profile_image": google_user.get("picture"),
            "bio": None,
            "city": None,
            "specialization": None,
            "hospital": None,
            "followers_count": 0,
            "following_count": 0,
            "posts_count": 0,
            "created_at": datetime.utcnow().isoformat(),
        }
        user = users_db[email]
    else:
        user["is_verified"] = True
        user["profile_image"] = google_user.get("picture") or user.get("profile_image")
        if not user.get("name"):
            user["name"] = google_user.get("name") or email.split("@", 1)[0]

    access_token = create_access_token(data={"email": user["email"], "role": user["role"]})
    user_response = UserResponse(
        id=hash(email) % (10 ** 8),
        name=user["name"],
        email=user["email"],
        role=user["role"],
        profile_image=user.get("profile_image"),
        bio=user.get("bio"),
        city=user.get("city"),
        specialization=user.get("specialization"),
        hospital=user.get("hospital"),
        followers_count=user.get("followers_count", 0),
        following_count=user.get("following_count", 0),
        posts_count=user.get("posts_count", 0),
        is_verified=user.get("is_verified", False),
    )

    return LoginResponse(
        message="Login successful",
        access_token=access_token,
        token_type="bearer",
        user=user_response,
    )


@router.post("/login", response_model=LoginResponse)
def login(payload: LoginRequest):
    """Login user and return JWT token"""
    email = str(payload.email).lower().strip()
    user = users_db.get(email)

    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    if not user.get("is_verified"):
        raise HTTPException(status_code=403, detail="Email not verified. Please verify your email first.")

    if not verify_password(payload.password, user["hashed_password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    # Create JWT token
    access_token = create_access_token(
        data={"email": user["email"], "role": user["role"]}
    )

    user_response = UserResponse(
        id=hash(email) % (10 ** 8),  # Simple ID generation for now
        name=user["name"],
        email=user["email"],
        role=user["role"],
        profile_image=user.get("profile_image"),
        bio=user.get("bio"),
        city=user.get("city"),
        specialization=user.get("specialization"),
        hospital=user.get("hospital"),
        followers_count=user.get("followers_count", 0),
        following_count=user.get("following_count", 0),
        posts_count=user.get("posts_count", 0),
        is_verified=user.get("is_verified", False),
    )

    return LoginResponse(
        message="Login successful",
        access_token=access_token,
        token_type="bearer",
        user=user_response,
    )


@router.get("/me", response_model=UserResponse)
def get_current_user_info(current_user: dict = Depends(get_current_user)):
    """Get current user profile"""
    email = current_user.get("email")
    user = users_db.get(email)

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return UserResponse(
        id=hash(email) % (10 ** 8),
        name=user["name"],
        email=user["email"],
        role=user["role"],
        profile_image=user.get("profile_image"),
        bio=user.get("bio"),
        city=user.get("city"),
        specialization=user.get("specialization"),
        hospital=user.get("hospital"),
        followers_count=user.get("followers_count", 0),
        following_count=user.get("following_count", 0),
        posts_count=user.get("posts_count", 0),
        is_verified=user.get("is_verified", False),
    )


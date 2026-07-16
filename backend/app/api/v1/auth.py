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
from sqlalchemy.orm import Session

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
from app.core.database import get_db, SessionLocal
from app.models.user import User, RoleEnum
from app.models.email_verification import EmailVerification

from pydantic import BaseModel

class SetRoleRequest(BaseModel):
    role: str

router = APIRouter(prefix="/auth", tags=["auth"])
security = HTTPBearer()


def seed_test_users():
    """Seed or refresh development test users with known credentials."""
    test_accounts = (
        ("testdoctor@example.com", "Dr. Test Doctor", RoleEnum.DOCTOR),
        ("testpatient@example.com", "John Patient", RoleEnum.PATIENT),
    )
    db = SessionLocal()
    try:
        for email, name, role in test_accounts:
            user = db.query(User).filter(User.email == email).first()
            if user:
                user.name = name
                user.role = role
                user.hashed_password = get_password_hash("password123")
                user.is_verified = True
            else:
                db.add(
                    User(
                        name=name,
                        email=email,
                        role=role,
                        hashed_password=get_password_hash("password123"),
                        is_verified=True,
                    )
                )

        db.commit()
        print("[seed] Test users seeded (db)")
    finally:
        db.close()


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
def register(payload: RegisterRequest, db: Session = Depends(get_db)):
    """Register a new user"""
    email = str(payload.email).lower().strip()

    if not is_valid_email(email):
        raise HTTPException(status_code=400, detail="Invalid email format")

    if db.query(User).filter(User.email == email).first():
        raise HTTPException(status_code=400, detail="Email already registered")

    if len(payload.password) < 6:
        raise HTTPException(status_code=400, detail="Password must be at least 6 characters")

    otp = f"{random.randint(100000, 999999)}"
    user = User(
        name=payload.name,
        email=email,
        role=RoleEnum.PENDING,
        hashed_password=get_password_hash(payload.password),
        is_verified=False,
    )
    db.add(user)

    verification = EmailVerification(
        email=email,
        otp=otp,
        expires_at=datetime.now(timezone.utc) + timedelta(minutes=10),
    )
    db.add(verification)
    db.commit()

    try:
        send_verification_email(email, otp)
    except Exception:
        pass

    return {
        "message": "Verification code sent",
        "email": email,
    }


@router.post("/verify", response_model=dict)
def verify(payload: VerifyRequest, db: Session = Depends(get_db)):
    """Verify email with OTP"""
    email = str(payload.email).lower().strip()
    record = db.query(EmailVerification).filter(EmailVerification.email == email).first()

    if not record:
        raise HTTPException(status_code=400, detail="No verification request found")

    current_time = datetime.now(timezone.utc)
    expires_at = record.expires_at
    if expires_at.tzinfo is None:
        expires_at = expires_at.replace(tzinfo=timezone.utc)

    if current_time > expires_at:
        raise HTTPException(status_code=400, detail="Verification code expired")

    if record.otp != payload.otp:
        raise HTTPException(status_code=400, detail="Invalid verification code")

    user = db.query(User).filter(User.email == email).first()
    if user:
        user.is_verified = True
        db.delete(record)
        db.commit()

    return {"message": "Email verified successfully"}


@router.post("/google-login", response_model=LoginResponse)
def google_login(payload: GoogleLoginRequest, db: Session = Depends(get_db)):
    """Authenticate with a Google ID token and issue a JWT token."""
    google_user = _validate_google_token(payload.credential)
    email = str(google_user.get("email", "")).lower().strip()

    if not email:
        raise HTTPException(status_code=400, detail="Google account email is required")

    user = db.query(User).filter(User.email == email).first()
    if not user:
        user = User(
            name=google_user.get("name") or email.split("@", 1)[0],
            email=email,
            role=RoleEnum.PENDING,
            hashed_password=get_password_hash(f"google-oauth:{email}"),
            is_verified=True,
            profile_image=google_user.get("picture"),
        )
        db.add(user)
        db.commit()
        db.refresh(user)
    else:
        user.is_verified = True
        user.profile_image = google_user.get("picture") or user.profile_image
        if not user.name:
            user.name = google_user.get("name") or email.split("@", 1)[0]
        db.commit()

    access_token = create_access_token(data={"email": user.email, "role": user.role.value})
    user_response = UserResponse(
        id=user.id,
        name=user.name,
        email=user.email,
        role=user.role.value,
        profile_image=user.profile_image,
        bio=user.bio,
        city=user.city,
        specialization=user.specialization,
        hospital=user.hospital,
        followers_count=user.followers_count or 0,
        following_count=user.following_count or 0,
        posts_count=user.posts_count or 0,
        is_verified=user.is_verified or False,
    )

    return LoginResponse(
        message="Login successful",
        access_token=access_token,
        token_type="bearer",
        user=user_response,
    )


@router.post("/login", response_model=LoginResponse)
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    """Login user and return JWT token"""
    email = str(payload.email).lower().strip()
    user = db.query(User).filter(User.email == email).first()

    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    if not user.is_verified:
        raise HTTPException(status_code=403, detail="Email not verified. Please verify your email first.")

    if not verify_password(payload.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    access_token = create_access_token(
        data={"email": user.email, "role": user.role.value}
    )

    user_response = UserResponse(
        id=user.id,
        name=user.name,
        email=user.email,
        role=user.role.value,
        profile_image=user.profile_image,
        bio=user.bio,
        city=user.city,
        specialization=user.specialization,
        hospital=user.hospital,
        followers_count=user.followers_count or 0,
        following_count=user.following_count or 0,
        posts_count=user.posts_count or 0,
        is_verified=user.is_verified or False,
    )

    return LoginResponse(
        message="Login successful",
        access_token=access_token,
        token_type="bearer",
        user=user_response,
    )


@router.get("/me", response_model=UserResponse)
def get_current_user_info(current_user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    """Get current user profile"""
    email = current_user.get("email")
    user = db.query(User).filter(User.email == email).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return UserResponse(
        id=user.id,
        name=user.name,
        email=user.email,
        role=user.role.value,
        profile_image=user.profile_image,
        bio=user.bio,
        city=user.city,
        specialization=user.specialization,
        hospital=user.hospital,
        followers_count=user.followers_count or 0,
        following_count=user.following_count or 0,
        posts_count=user.posts_count or 0,
        is_verified=user.is_verified or False,
    )


@router.post("/set-role", response_model=LoginResponse)
def set_role(payload: SetRoleRequest, current_user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    email = current_user.get("email")
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    role_str = payload.role.lower().strip()
    if role_str not in ["doctor", "patient"]:
        raise HTTPException(status_code=400, detail="Invalid role selected")
        
    user.role = RoleEnum(role_str)
    db.commit()
    db.refresh(user)
    
    access_token = create_access_token(data={"email": user.email, "role": user.role.value})
    user_response = UserResponse(
        id=user.id,
        name=user.name,
        email=user.email,
        role=user.role.value,
        profile_image=user.profile_image,
        bio=user.bio,
        city=user.city,
        specialization=user.specialization,
        hospital=user.hospital,
        followers_count=user.followers_count or 0,
        following_count=user.following_count or 0,
        posts_count=user.posts_count or 0,
        is_verified=user.is_verified or False,
    )

    return LoginResponse(
        message="Role updated successfully",
        access_token=access_token,
        token_type="bearer",
        user=user_response,
    )

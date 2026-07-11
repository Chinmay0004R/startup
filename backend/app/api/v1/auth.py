import random
import re
import smtplib
import ssl
from datetime import datetime, timedelta, timezone
from email.message import EmailMessage
from typing import Dict

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr

from app.core.security import get_password_hash, verify_password

router = APIRouter(prefix="/auth", tags=["auth"])


class RegisterRequest(BaseModel):
    name: str
    email: EmailStr
    password: str


class VerifyRequest(BaseModel):
    email: EmailStr
    otp: str


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


users_db: Dict[str, dict] = {}
verification_db: Dict[str, dict] = {}


def send_verification_email(email: str, otp: str) -> None:
    smtp_host = "smtp.gmail.com"
    smtp_port = 465
    sender_email = "murkarchinmay20@gmail.com"
    sender_password = "frrd vwdt pjmz llau"

    message = EmailMessage()
    message["Subject"] = "Doctor Safety Network verification code"
    message["From"] = sender_email
    message["To"] = email
    message.set_content(
        f"Your Doctor Safety Network verification code is: {otp}\n"
        "Enter this code in the app to verify your email."
    )

    context = ssl.create_default_context()
    with smtplib.SMTP_SSL(smtp_host, smtp_port, context=context) as server:
        server.login(sender_email, sender_password)
        server.send_message(message)


def is_valid_email(email: str) -> bool:
    pattern = r"^[^@\s]+@[^@\s]+\.[^@\s]+$"
    return re.match(pattern, email) is not None


@router.post("/register")
def register(payload: RegisterRequest):
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
        "hashed_password": get_password_hash(payload.password),
        "is_verified": False,
    }
    verification_db[email] = {
        "otp": otp,
        "expires_at": datetime.now(timezone.utc) + timedelta(minutes=10),
    }

    try:
        send_verification_email(email, otp)
    except Exception:
        pass

    return {"message": "Verification code sent"}


@router.post("/verify")
def verify(payload: VerifyRequest):
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

    return {"message": "Email verified successfully"}


@router.post("/login")
def login(payload: LoginRequest):
    email = str(payload.email).lower().strip()
    user = users_db.get(email)

    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    if not user.get("is_verified"):
        raise HTTPException(status_code=403, detail="Email not verified")

    if not verify_password(payload.password, user["hashed_password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    return {"message": "Login successful", "user": {"name": user["name"], "email": user["email"]}}

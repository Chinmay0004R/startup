from datetime import datetime

from sqlalchemy import Column, Integer, String, DateTime

from app.core.database import Base


class EmailVerification(Base):
    __tablename__ = "email_verifications"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(150), nullable=False, index=True, unique=True)
    otp = Column(String(20), nullable=False)
    expires_at = Column(DateTime, nullable=False)

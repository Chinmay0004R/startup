from datetime import datetime

from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship

from app.core.database import Base


class DoctorProfile(Base):
    __tablename__ = "doctor_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    name = Column(String(150), nullable=False)
    email = Column(String(100), nullable=False, unique=True, index=True)
    specialty = Column(String(150), nullable=True)
    specialization = Column(String(150), nullable=True)
    hospital = Column(String(150), nullable=True)
    registration_number = Column(String(100), unique=True, nullable=True)
    years_experience = Column(Integer, default=0)
    bio = Column(String(1000), nullable=True)
    city = Column(String(100), nullable=True)
    state = Column(String(100), nullable=True)
    profile_photo = Column(String(255), nullable=True)
    license_document_url = Column(String(255), nullable=True)
    license_public_id = Column(String(255), nullable=True)
    verification_status = Column(String(50), nullable=True)
    verified = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User", back_populates="doctor_profile")
    reviews = relationship("Review", back_populates="doctor", cascade="all, delete-orphan")
    certificates = relationship("Certificate", back_populates="doctor", cascade="all, delete-orphan")
    sos_incidents = relationship("SOSIncident", back_populates="doctor", cascade="all, delete-orphan")

from datetime import datetime

from sqlalchemy import Column, Integer, String, DateTime, Boolean, Float, Enum as SQLEnum
from sqlalchemy.orm import relationship

from app.core.database import Base
import enum


class RoleEnum(str, enum.Enum):
    DOCTOR = "doctor"
    PATIENT = "patient"
    RETIRED_POLICE = "retired_police"


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    role = Column(SQLEnum(RoleEnum), default=RoleEnum.PATIENT, nullable=False)
    
    # Profile Information
    profile_image = Column(String(500), nullable=True)
    profile_image_public_id = Column(String(255), nullable=True)
    bio = Column(String(500), nullable=True)
    city = Column(String(100), nullable=True)
    
    # Doctor-specific fields
    specialization = Column(String(100), nullable=True)
    hospital = Column(String(255), nullable=True)
    years_experience = Column(Float, nullable=True)
    medical_license = Column(String(255), nullable=True)
    
    # Social Stats
    followers_count = Column(Integer, default=0)
    following_count = Column(Integer, default=0)
    posts_count = Column(Integer, default=0)
    
    # Account Status
    is_verified = Column(Boolean, default=False)
    is_active = Column(Boolean, default=True)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    doctor_profile = relationship("DoctorProfile", back_populates="user", uselist=False)
    patient_profile = relationship("PatientProfile", back_populates="user", uselist=False)
    retired_police_profile = relationship("RetiredPoliceProfile", back_populates="user", uselist=False)
    posts = relationship("Post", back_populates="author", cascade="all, delete-orphan")
    comments = relationship("Comment", back_populates="user", cascade="all, delete-orphan")
    notifications = relationship("Notification", back_populates="user", cascade="all, delete-orphan")
    reviews = relationship("Review", back_populates="reviewer", cascade="all, delete-orphan")
    complaints_submitted = relationship("Complaint", foreign_keys="Complaint.submitted_by", back_populates="submitted_by_user", cascade="all, delete-orphan")
    complaints_against = relationship("Complaint", foreign_keys="Complaint.against_user", back_populates="against_user_obj", cascade="all, delete-orphan")
    followers = relationship("Follow", foreign_keys="Follow.following_id", back_populates="following", cascade="all, delete-orphan")
    following = relationship("Follow", foreign_keys="Follow.follower_id", back_populates="follower", cascade="all, delete-orphan")


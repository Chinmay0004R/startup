from datetime import datetime

from sqlalchemy import Column, Integer, String, DateTime, Boolean, Float, Enum as SQLEnum

from app.core.database import Base
import enum


class RoleEnum(str, enum.Enum):
    DOCTOR = "doctor"
    PATIENT = "patient"
    ADMIN = "admin"


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    role = Column(SQLEnum(RoleEnum), default=RoleEnum.PATIENT, nullable=False)
    
    # Profile Information
    profile_image = Column(String(500), nullable=True)
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


from datetime import datetime

from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship

from app.core.database import Base


class SOSIncident(Base):
    __tablename__ = "sos_incidents"

    id = Column(Integer, primary_key=True, index=True)
    doctor_id = Column(Integer, ForeignKey("doctor_profiles.id"), nullable=True)
    doctor_name = Column(String(100), nullable=True)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    location = Column(String(255), nullable=True)
    description = Column(String(1000), nullable=False)
    status = Column(String(50), default="received")
    created_at = Column(DateTime, default=datetime.utcnow)

    doctor = relationship("DoctorProfile", back_populates="sos_incidents")

from datetime import datetime

from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship

from app.core.database import Base


class Certificate(Base):
    __tablename__ = "certificates"

    id = Column(Integer, primary_key=True, index=True)
    doctor_id = Column(Integer, ForeignKey("doctor_profiles.id"), nullable=False)
    title = Column(String(150), nullable=False)
    certificate_url = Column(String(255), nullable=False)
    public_id = Column(String(255), nullable=True)
    uploaded_at = Column(DateTime, default=datetime.utcnow)

    doctor = relationship("DoctorProfile", back_populates="certificates")

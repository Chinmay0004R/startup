from datetime import datetime

from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship

from app.core.database import Base


class RetiredPoliceProfile(Base):
    __tablename__ = "retired_police_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    rank = Column(String(100), nullable=True)
    years_of_service = Column(Integer, default=0)
    city = Column(String(100), nullable=True)
    availability = Column(String(100), nullable=True)
    verification_status = Column(String(50), default="pending")
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User", back_populates="retired_police_profile")

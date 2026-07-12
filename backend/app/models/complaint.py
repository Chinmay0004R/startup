from datetime import datetime

from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship

from app.core.database import Base


class Complaint(Base):
    __tablename__ = "complaints"

    id = Column(Integer, primary_key=True, index=True)
    reporter_name = Column(String(150), nullable=False)
    submitted_by = Column(Integer, ForeignKey("users.id"), nullable=True)
    against_user = Column(Integer, ForeignKey("users.id"), nullable=True)
    category = Column(String(100), nullable=False)
    description = Column(String(1000), nullable=False)
    evidence_url = Column(String(255), nullable=True)
    status = Column(String(50), default="submitted")
    created_at = Column(DateTime, default=datetime.utcnow)

    submitted_by_user = relationship("User", foreign_keys=[submitted_by], back_populates="complaints_submitted")
    against_user_obj = relationship("User", foreign_keys=[against_user], back_populates="complaints_against")

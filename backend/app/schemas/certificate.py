from datetime import datetime
from pydantic import BaseModel
from typing import Optional


class CertificateCreate(BaseModel):
    doctor_id: int
    title: str
    certificate_url: str
    public_id: Optional[str] = None


class CertificateRead(BaseModel):
    id: int
    doctor_id: int
    title: str
    certificate_url: str
    public_id: Optional[str] = None
    uploaded_at: datetime

    class Config:
        from_attributes = True

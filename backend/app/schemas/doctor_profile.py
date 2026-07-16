from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class DoctorProfileCreate(BaseModel):
    user_id: int
    specialty: str
    hospital: str | None = None
    years_experience: int | None = None
    bio: str | None = None


class DoctorProfileRead(BaseModel):
    id: int
    user_id: int
    specialty: str
    hospital: str | None = None
    years_experience: int | None = None
    bio: str | None = None
    license_document_url: str | None = None
    verification_status: str | None = None
    verification_date: datetime | None = None
    rejection_reason: str | None = None
    verified: bool | None = None

    class Config:
        from_attributes = True

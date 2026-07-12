from typing import Optional

from pydantic import BaseModel


class DoctorProfileCreate(BaseModel):
    user_id: int
    specialty: str
    hospital: str | None = None
    years_experience: str | None = None
    medical_license: str | None = None
    bio: str | None = None


class DoctorProfileRead(BaseModel):
    id: int
    user_id: int
    specialty: str
    hospital: str | None = None
    years_experience: str | None = None
    medical_license: str | None = None
    bio: str | None = None
    license_document_url: str | None = None
    verification_status: str | None = None

    class Config:
        orm_mode = True

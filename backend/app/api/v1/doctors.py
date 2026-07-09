from typing import List

from fastapi import APIRouter

from app.schemas.doctor import DoctorCreate, DoctorRead

router = APIRouter(prefix="/doctors", tags=["doctors"])

DOCTORS: List[DoctorRead] = []


@router.get("/", response_model=List[DoctorRead])
def list_doctors():
    return DOCTORS


@router.post("/", response_model=DoctorRead)
def create_doctor(payload: DoctorCreate):
    doctor = DoctorRead(
        id=len(DOCTORS) + 1,
        name=payload.name,
        specialty=payload.specialty,
        email=payload.email,
        hospital=getattr(payload, "hospital", "Pending verification"),
        years_experience=getattr(payload, "years_experience", 0),
        verified=getattr(payload, "verified", False),
    )
    DOCTORS.append(doctor)
    return doctor

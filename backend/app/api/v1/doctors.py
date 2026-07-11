from typing import List

from fastapi import APIRouter, HTTPException

from app.schemas.doctor import DoctorCreate, DoctorRead

router = APIRouter(prefix="/doctors", tags=["doctors"])

DOCTORS: List[DoctorRead] = []


@router.get("/", response_model=List[DoctorRead])
def list_doctors(search: str | None = None):
    query = (search or "").strip().lower()
    if not query:
        return DOCTORS

    return [
        doctor
        for doctor in DOCTORS
        if query in (doctor.name or "").lower()
        or query in (doctor.specialty or "").lower()
        or query in (doctor.email or "").lower()
        or query in (doctor.hospital or "").lower()
        or query in (doctor.registration_number or "").lower()
    ]


@router.get("/{doctor_id}", response_model=DoctorRead)
def get_doctor(doctor_id: int):
    for doctor in DOCTORS:
        if doctor.id == doctor_id:
            return doctor

    raise HTTPException(status_code=404, detail="Doctor not found")


@router.post("/", response_model=DoctorRead)
def create_doctor(payload: DoctorCreate):
    doctor = DoctorRead(
        id=len(DOCTORS) + 1,
        name=payload.name,
        specialty=payload.specialty,
        email=payload.email,
        hospital=getattr(payload, "hospital", "Pending verification"),
        years_experience=getattr(payload, "years_experience", 0),
        registration_number=payload.registration_number,
        verified=getattr(payload, "verified", False),
    )
    DOCTORS.append(doctor)
    return doctor

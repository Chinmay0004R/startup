from typing import List

from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session

from app.schemas.doctor import DoctorCreate, DoctorRead
from app.core.database import get_db
from app.models.user import User, RoleEnum

router = APIRouter(prefix="/doctors", tags=["doctors"])


@router.get("/", response_model=List[DoctorRead])
def list_doctors(search: str | None = None, db: Session = Depends(get_db)):
    query = (search or "").strip().lower()
    users = db.query(User).filter(User.role == RoleEnum.DOCTOR).all()

    doctors = [
        DoctorRead(
            id=u.id,
            name=u.name,
            specialty=u.specialization,
            email=u.email,
            hospital=u.hospital,
            years_experience=int(u.years_experience) if u.years_experience is not None else None,
            registration_number=u.medical_license,
            verified=bool(u.is_verified),
            profile_image=u.profile_image,
        )
        for u in users
    ]

    if not query:
        return doctors

    return [
        doctor
        for doctor in doctors
        if query in (doctor.name or "").lower()
        or query in (doctor.specialty or "").lower()
        or query in (doctor.email or "").lower()
        or query in (doctor.hospital or "").lower()
        or query in (doctor.registration_number or "").lower()
    ]


@router.get("/{doctor_id}", response_model=DoctorRead)
def get_doctor(doctor_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == doctor_id, User.role == RoleEnum.DOCTOR).first()
    if not user:
        raise HTTPException(status_code=404, detail="Doctor not found")

    return DoctorRead(
        id=user.id,
        name=user.name,
        specialty=user.specialization,
        email=user.email,
        hospital=user.hospital,
        years_experience=int(user.years_experience) if user.years_experience is not None else None,
        registration_number=user.medical_license,
        verified=bool(user.is_verified),
    )


@router.post("/", response_model=DoctorRead)
def create_doctor(payload: DoctorCreate, db: Session = Depends(get_db)):
    user = User(
        name=payload.name,
        specialization=payload.specialty,
        email=payload.email,
        hospital=payload.hospital,
        years_experience=payload.years_experience,
        medical_license=payload.registration_number,
        is_verified=payload.verified,
        role=RoleEnum.DOCTOR,
        hashed_password="",
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    return DoctorRead(
        id=user.id,
        name=user.name,
        specialty=user.specialization,
        email=user.email,
        hospital=user.hospital,
        years_experience=int(user.years_experience) if user.years_experience is not None else None,
        registration_number=user.medical_license,
        verified=bool(user.is_verified),
    )

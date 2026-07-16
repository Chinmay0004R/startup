from typing import List

from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from sqlalchemy import or_

from app.schemas.doctor import DoctorCreate, DoctorRead
from app.core.database import get_db
from app.models.user import User, RoleEnum
from app.models.doctor_profile import DoctorProfile

router = APIRouter(prefix="/doctors", tags=["doctors"])


@router.get("/", response_model=List[DoctorRead])
def list_doctors(
    search: str | None = None,
    name: str | None = None,
    registration_number: str | None = None,
    hospital: str | None = None,
    city: str | None = None,
    state: str | None = None,
    specialization: str | None = None,
    verified: bool | None = None,
    min_experience: int | None = None,
    max_experience: int | None = None,
    db: Session = Depends(get_db),
):
    query = (search or "").strip().lower()
    base_query = db.query(User).filter(User.role == RoleEnum.DOCTOR).outerjoin(DoctorProfile, DoctorProfile.user_id == User.id)

    if name:
        base_query = base_query.filter(User.name.ilike(f"%{name.strip()}%"))
    if registration_number:
        base_query = base_query.filter(User.medical_license.ilike(f"%{registration_number.strip()}%"))
    if hospital:
        base_query = base_query.filter(User.hospital.ilike(f"%{hospital.strip()}%"))
    if city:
        base_query = base_query.filter(or_(User.city.ilike(f"%{city.strip()}%"), DoctorProfile.city.ilike(f"%{city.strip()}%")))
    if state:
        base_query = base_query.filter(DoctorProfile.state.ilike(f"%{state.strip()}%"))
    if specialization:
        base_query = base_query.filter(User.specialization.ilike(f"%{specialization.strip()}%"))

    users = base_query.all()
    doctors = [
        DoctorRead(
            id=u.id,
            name=u.name,
            specialty=u.specialization,
            email=u.email,
            hospital=u.hospital,
            years_experience=int(u.years_experience) if u.years_experience is not None else None,
            registration_number=u.medical_license,
            verified=bool(u.is_verified or (u.doctor_profile and u.doctor_profile.verification_status == "verified")),
            profile_image=u.profile_image,
            verification_status=u.doctor_profile.verification_status if u.doctor_profile else None,
            verification_date=u.doctor_profile.verification_date if u.doctor_profile else None,
            rejection_reason=u.doctor_profile.rejection_reason if u.doctor_profile else None,
        )
        for u in users
    ]

    if verified is not None:
        doctors = [doctor for doctor in doctors if doctor.verified is verified]
    if min_experience is not None:
        doctors = [doctor for doctor in doctors if (doctor.years_experience or 0) >= min_experience]
    if max_experience is not None:
        doctors = [doctor for doctor in doctors if (doctor.years_experience or 0) <= max_experience]

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
        verified=bool(user.is_verified or (user.doctor_profile and user.doctor_profile.verification_status == "verified")),
        profile_image=user.profile_image,
        verification_status=user.doctor_profile.verification_status if user.doctor_profile else None,
        verification_date=user.doctor_profile.verification_date if user.doctor_profile else None,
        rejection_reason=user.doctor_profile.rejection_reason if user.doctor_profile else None,
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
        verified=bool(user.is_verified or (user.doctor_profile and user.doctor_profile.verification_status == "verified")),
        profile_image=user.profile_image,
        verification_status=user.doctor_profile.verification_status if user.doctor_profile else None,
        verification_date=user.doctor_profile.verification_date if user.doctor_profile else None,
        rejection_reason=user.doctor_profile.rejection_reason if user.doctor_profile else None,
    )

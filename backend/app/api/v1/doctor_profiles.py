from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.doctor_profile import DoctorProfile
from app.models.user import User, RoleEnum
from app.schemas.doctor_profile import DoctorProfileCreate, DoctorProfileRead
from app.api.v1.auth import get_current_user

router = APIRouter(prefix="/doctor-profiles", tags=["doctor_profiles"])


@router.post("/", response_model=DoctorProfileRead)
def create_doctor_profile(payload: DoctorProfileCreate, current_user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    if current_user.get("role") != RoleEnum.DOCTOR.value:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only doctors can create profiles")

    user = db.query(User).filter(User.email == current_user.get("email")).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    if user.id != payload.user_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Profile user mismatch")

    existing = db.query(DoctorProfile).filter(DoctorProfile.user_id == user.id).first()
    if existing:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Doctor profile already exists")

    profile = DoctorProfile(
        user_id=user.id,
        specialty=payload.specialty,
        hospital=payload.hospital,
        years_experience=payload.years_experience,
        medical_license=payload.medical_license,
        bio=payload.bio,
    )
    db.add(profile)
    db.commit()
    db.refresh(profile)

    return profile


@router.get("/", response_model=List[DoctorProfileRead])
def list_doctor_profiles(db: Session = Depends(get_db)):
    profiles = db.query(DoctorProfile).all()
    return profiles


@router.get("/{profile_id}", response_model=DoctorProfileRead)
def get_doctor_profile(profile_id: int, db: Session = Depends(get_db)):
    profile = db.query(DoctorProfile).filter(DoctorProfile.id == profile_id).first()
    if not profile:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Doctor profile not found")
    return profile


@router.put("/{profile_id}", response_model=DoctorProfileRead)
def update_doctor_profile(profile_id: int, payload: DoctorProfileCreate, current_user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    profile = db.query(DoctorProfile).filter(DoctorProfile.id == profile_id).first()
    if not profile:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Doctor profile not found")

    user = db.query(User).filter(User.email == current_user.get("email")).first()
    if not user or user.id != profile.user_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Cannot update this doctor profile")

    profile.specialty = payload.specialty
    profile.hospital = payload.hospital
    profile.years_experience = payload.years_experience
    profile.medical_license = payload.medical_license
    profile.bio = payload.bio
    db.commit()
    db.refresh(profile)

    return profile


@router.delete("/{profile_id}", response_model=DoctorProfileRead)
def delete_doctor_profile(profile_id: int, current_user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    profile = db.query(DoctorProfile).filter(DoctorProfile.id == profile_id).first()
    if not profile:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Doctor profile not found")

    user = db.query(User).filter(User.email == current_user.get("email")).first()
    if not user or user.id != profile.user_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Cannot delete this doctor profile")

    db.delete(profile)
    db.commit()
    return profile

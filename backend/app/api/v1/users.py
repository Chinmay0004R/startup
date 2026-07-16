from typing import List

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.core.database import get_db
from app.models.user import User
from app.models.complaint import Complaint
from app.models.follow import Follow
from app.models.doctor_profile import DoctorProfile
from app.schemas.user import UserRead, UserUpdate
from app.api.v1.auth import get_current_user
from app.services.cloudinary_service import delete_asset, upload_image

from pydantic import BaseModel
from app.core.security import verify_password
from app.models.certificate import Certificate

class DeleteAccountRequest(BaseModel):
    password: str

router = APIRouter(prefix="/users", tags=["users"])


@router.get("/", response_model=List[UserRead])
def list_users(current_user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    users = db.query(User).all()
    return users


@router.get("/{user_id}", response_model=UserRead)
def get_user(user_id: int, current_user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.put("/{user_id}", response_model=UserRead)
def update_user(user_id: int, payload: UserUpdate, current_user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    if current_user.get("email") != user.email:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Cannot update another user's profile")

    for field, value in payload.dict(exclude_unset=True).items():
        setattr(user, field, value)

    db.commit()
    db.refresh(user)
    return user


@router.post("/me/profile-image", response_model=UserRead)
async def upload_profile_image(
    file: UploadFile = File(...),
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if not current_user.get("email"):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid authentication credentials")

    user = db.query(User).filter(User.email == current_user["email"]).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    try:
        if user.profile_image_public_id:
            try:
                delete_asset(user.profile_image_public_id, resource_type="image")
            except Exception:
                pass

        upload_result = await upload_image(file)
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc))
    except Exception:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to upload profile image")

    user.profile_image = upload_result.get("secure_url")
    user.profile_image_public_id = upload_result.get("public_id")
    db.commit()
    db.refresh(user)
    return UserRead(
        id=user.id,
        name=user.name,
        email=user.email,
        profile_image=user.profile_image,
        bio=user.bio,
        city=user.city,
        specialization=user.specialization,
        hospital=user.hospital,
        years_experience=user.years_experience,
        medical_license=user.medical_license,
        followers_count=user.followers_count or 0,
        following_count=user.following_count or 0,
        posts_count=user.posts_count or 0,
        is_verified=user.is_verified or False,
    )


@router.delete("/me")
def delete_my_account(payload: DeleteAccountRequest, current_user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    email = current_user.get("email")
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    # Verify password if user has a standard password
    if not user.hashed_password.startswith("google-oauth:"):
        if not verify_password(payload.password, user.hashed_password):
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect password")

    try:
        # Collect Cloudinary public IDs to delete
        public_ids_to_delete = []
        if user.profile_image_public_id:
            public_ids_to_delete.append(user.profile_image_public_id)
        
        if user.doctor_profile:
            if user.doctor_profile.license_public_id:
                public_ids_to_delete.append(user.doctor_profile.license_public_id)
            for cert in user.doctor_profile.certificates:
                if cert.public_id:
                    public_ids_to_delete.append(cert.public_id)
        
        # Delete Cloudinary assets
        for public_id in public_ids_to_delete:
            try:
                delete_asset(public_id)
            except Exception as e:
                print(f"Failed to delete Cloudinary asset {public_id}: {e}")

        # Database deletion
        db.delete(user)
        db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to delete account")
        
    return {"message": "Account deleted successfully"}


@router.delete("/{user_id}")
def delete_user(user_id: int, current_user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    if current_user.get("email") != user.email:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Cannot delete another user's account")

    db.delete(user)
    db.commit()
    return {"message": "User deleted"}


@router.get("/{user_id}/statistics", response_model=dict)
def get_user_statistics(user_id: int, current_user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    """Get comprehensive statistics for a user"""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    
    # Get complaints submitted by user
    complaints_submitted = db.query(func.count(Complaint.id)).filter(
        Complaint.submitted_by == user_id
    ).scalar() or 0
    
    # Get following doctors count
    following_doctors = db.query(func.count(Follow.id)).filter(
        Follow.follower_id == user_id
    ).scalar() or 0
    
    return {
        "followers": user.followers_count or 0,
        "following": user.following_count or 0,
        "posts": user.posts_count or 0,
        "complaints_submitted": complaints_submitted,
        "following_doctors": following_doctors,
    }


@router.get("/{user_id}/following-doctors", response_model=List[dict])
def get_user_following_doctors(user_id: int, current_user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    """Get list of doctors that user is following"""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    
    # Get doctors that this user is following
    following_relationships = db.query(Follow).filter(Follow.follower_id == user_id).all()
    doctor_ids = [rel.following_id for rel in following_relationships]
    
    doctors = db.query(User).filter(User.id.in_(doctor_ids)).all() if doctor_ids else []
    
    return [
        {
            "id": doc.id,
            "name": doc.name,
            "specialization": doc.specialization,
            "hospital": doc.hospital,
            "profile_image": doc.profile_image,
            "city": doc.city,
        }
        for doc in doctors
    ]


@router.get("/{user_id}/complaints-history", response_model=List[dict])
def get_user_complaint_history(user_id: int, current_user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    """Get complaint history for a user"""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    
    complaints = db.query(Complaint).filter(Complaint.submitted_by == user_id).all()
    
    return [
        {
            "id": c.id,
            "reporter_name": c.reporter_name,
            "category": c.category,
            "details": c.description,
            "status": c.status,
            "created_at": c.created_at,
        }
        for c in complaints
    ]


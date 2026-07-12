from typing import List

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.user import User
from app.schemas.user import UserRead, UserUpdate
from app.api.v1.auth import get_current_user
from app.services.cloudinary_service import delete_asset, upload_image

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

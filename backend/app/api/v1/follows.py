from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import or_

from app.core.database import get_db
from app.models.follow import Follow
from app.models.user import User, RoleEnum
from app.schemas.follow import FollowCreate, FollowRead
from app.api.v1.auth import get_current_user

router = APIRouter(prefix="/follows", tags=["follows"])


@router.post("/", response_model=FollowRead)
def create_follow(payload: FollowCreate, current_user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    if current_user.get("role") not in {RoleEnum.PATIENT.value, RoleEnum.DOCTOR.value, RoleEnum.RETIRED_POLICE.value}:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Invalid user role for following")

    follower = db.query(User).filter(User.email == current_user.get("email")).first()
    if not follower:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Follower not found")

    following = db.query(User).filter(User.id == payload.following_id).first()
    if not following:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Follow target not found")

    if follower.id == following.id:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Cannot follow yourself")

    existing = db.query(Follow).filter(Follow.follower_id == follower.id, Follow.following_id == following.id).first()
    if existing:
        return existing

    follow_rel = Follow(
        follower_id=follower.id,
        following_id=following.id,
    )
    db.add(follow_rel)
    db.commit()
    db.refresh(follow_rel)

    return follow_rel


@router.delete("/", response_model=dict)
def unfollow(payload: FollowCreate, current_user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    follower = db.query(User).filter(User.email == current_user.get("email")).first()
    if not follower or follower.id != payload.follower_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Cannot unfollow on behalf of another user")

    follow_rel = db.query(Follow).filter(Follow.follower_id == payload.follower_id, Follow.following_id == payload.following_id).first()
    if not follow_rel:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Follow relationship not found")

    db.delete(follow_rel)
    db.commit()
    return {"message": "Unfollowed successfully"}


@router.get("/followers/{user_id}", response_model=List[FollowRead])
def list_followers(user_id: int, current_user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    follows = db.query(Follow).filter(Follow.following_id == user_id).all()
    return follows


@router.get("/following/{user_id}", response_model=List[FollowRead])
def list_following(user_id: int, current_user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    follows = db.query(Follow).filter(Follow.follower_id == user_id).all()
    return follows

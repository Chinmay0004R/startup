from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.notification import Notification
from app.models.user import User
from app.schemas.notification import NotificationCreate, NotificationRead
from app.api.v1.auth import get_current_user

router = APIRouter(prefix="/notifications", tags=["notifications"])


@router.post("/", response_model=NotificationRead)
def create_notification(payload: NotificationCreate, current_user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    sender = db.query(User).filter(User.email == current_user.get("email")).first()
    if not sender:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    if payload.user_id != sender.id and current_user.get("role") != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Cannot create notifications for other users")

    user = db.query(User).filter(User.id == payload.user_id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Recipient user not found")

    notification = Notification(
        user_id=payload.user_id,
        title=payload.title,
        message=payload.message,
    )
    db.add(notification)
    db.commit()
    db.refresh(notification)

    return notification


@router.get("/user/{user_id}", response_model=List[NotificationRead])
def list_notifications(user_id: int, current_user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    if current_user.get("role") != "admin" and current_user.get("email") != user.email:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")

    notifications = db.query(Notification).filter(Notification.user_id == user_id).all()
    return notifications


@router.get("/{notification_id}", response_model=NotificationRead)
def get_notification(notification_id: int, current_user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    notification = db.query(Notification).filter(Notification.id == notification_id).first()
    if not notification:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Notification not found")

    user = db.query(User).filter(User.id == notification.user_id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Notification owner not found")

    if current_user.get("role") != "admin" and current_user.get("email") != user.email:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")

    return notification


@router.patch("/{notification_id}/read", response_model=NotificationRead)
def mark_notification_read(notification_id: int, current_user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    notification = db.query(Notification).filter(Notification.id == notification_id).first()
    if not notification:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Notification not found")

    user = db.query(User).filter(User.id == notification.user_id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Notification owner not found")

    if current_user.get("role") != "admin" and current_user.get("email") != user.email:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")

    notification.is_read = True
    db.commit()
    db.refresh(notification)
    return notification

from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.review import Review
from app.models.user import User, RoleEnum
from app.models.doctor_profile import DoctorProfile
from app.schemas.review import ReviewCreate, ReviewRead, ReviewUpdate
from app.api.v1.auth import get_current_user

router = APIRouter(prefix="/reviews", tags=["reviews"])


@router.post("/", response_model=ReviewRead)
def create_review(payload: ReviewCreate, current_user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    if current_user.get("role") != RoleEnum.PATIENT.value:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only patients may create reviews")

    reviewer = db.query(User).filter(User.email == current_user.get("email")).first()
    if not reviewer:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Reviewer not found")

    doctor = db.query(DoctorProfile).filter(DoctorProfile.id == payload.doctor_id).first()
    if not doctor:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Doctor profile not found")

    review = Review(
        reviewer_id=reviewer.id,
        doctor_id=payload.doctor_id,
        rating=payload.rating,
        comment=payload.comment,
    )
    db.add(review)
    db.commit()
    db.refresh(review)

    return ReviewRead(
        id=review.id,
        reviewer_id=review.reviewer_id,
        reviewer_name=reviewer.name,
        doctor_id=review.doctor_id,
        rating=review.rating,
        comment=review.comment,
        created_at=review.created_at,
    )


@router.get("/doctor/{doctor_id}", response_model=List[ReviewRead])
def list_reviews_for_doctor(doctor_id: int, db: Session = Depends(get_db)):
    reviews = db.query(Review).filter(Review.doctor_id == doctor_id).all()
    return [
        ReviewRead(
            id=r.id,
            reviewer_id=r.reviewer_id,
            reviewer_name=r.reviewer.name if r.reviewer else None,
            doctor_id=r.doctor_id,
            rating=r.rating,
            comment=r.comment,
            created_at=r.created_at,
        )
        for r in reviews
    ]


@router.put("/{review_id}", response_model=ReviewRead)
def update_review(review_id: int, payload: ReviewUpdate, current_user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    review = db.query(Review).filter(Review.id == review_id).first()
    if not review:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Review not found")

    reviewer = db.query(User).filter(User.email == current_user.get("email")).first()
    if not reviewer or review.reviewer_id != reviewer.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Cannot edit another user's review")

    if payload.rating is not None:
        review.rating = payload.rating
    if payload.comment is not None:
        review.comment = payload.comment

    db.commit()
    db.refresh(review)

    return ReviewRead(
        id=review.id,
        reviewer_id=review.reviewer_id,
        reviewer_name=reviewer.name,
        doctor_id=review.doctor_id,
        rating=review.rating,
        comment=review.comment,
        created_at=review.created_at,
    )


@router.delete("/{review_id}")
def delete_review(review_id: int, current_user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    review = db.query(Review).filter(Review.id == review_id).first()
    if not review:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Review not found")

    reviewer = db.query(User).filter(User.email == current_user.get("email")).first()
    if not reviewer or review.reviewer_id != reviewer.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Cannot delete another user's review")

    db.delete(review)
    db.commit()
    return {"message": "Review deleted"}

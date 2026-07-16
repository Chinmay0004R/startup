from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.schemas.complaint import ComplaintCreate, ComplaintRead
from app.core.database import get_db
from app.models.complaint import Complaint
from app.models.user import User
from app.api.v1.auth import get_current_user

router = APIRouter(prefix="/complaints", tags=["complaints"])


@router.get("/", response_model=List[ComplaintRead])
def list_complaints(current_user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    complaints = db.query(Complaint).all()
    return complaints


@router.post("/", response_model=ComplaintRead)
def create_complaint(payload: ComplaintCreate, current_user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == current_user.get("email")).first()
    
    complaint = Complaint(
        reporter_name=payload.reporter_name,
        category=payload.category,
        description=payload.description,
        evidence_url=payload.evidence_url,
        submitted_by=user.id if user else None,
        status="submitted",
    )
    db.add(complaint)
    db.commit()
    db.refresh(complaint)

    return complaint


@router.get("/{complaint_id}", response_model=ComplaintRead)
def get_complaint(complaint_id: int, current_user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    complaint = db.query(Complaint).filter(Complaint.id == complaint_id).first()
    if not complaint:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Complaint not found")
    return complaint


@router.put("/{complaint_id}", response_model=ComplaintRead)
def update_complaint(complaint_id: int, payload: ComplaintCreate, current_user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    complaint = db.query(Complaint).filter(Complaint.id == complaint_id).first()
    if not complaint:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Complaint not found")

    complaint.reporter_name = payload.reporter_name
    complaint.category = payload.category
    complaint.description = payload.description
    complaint.evidence_url = payload.evidence_url
    db.commit()
    db.refresh(complaint)

    return complaint


@router.delete("/{complaint_id}")
def delete_complaint(complaint_id: int, current_user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    complaint = db.query(Complaint).filter(Complaint.id == complaint_id).first()
    if not complaint:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Complaint not found")

    db.delete(complaint)
    db.commit()
    return {"message": "Complaint deleted"}

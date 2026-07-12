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
    return [
        ComplaintRead(
            id=c.id,
            reporter_name=c.reporter_name,
            category=c.category,
            details=c.description,
            status=c.status,
        )
        for c in complaints
    ]


@router.post("/", response_model=ComplaintRead)
def create_complaint(payload: ComplaintCreate, current_user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    complaint = Complaint(
        reporter_name=payload.reporter_name,
        category=payload.category,
        description=payload.details,
        status="submitted",
    )
    db.add(complaint)
    db.commit()
    db.refresh(complaint)

    return ComplaintRead(
        id=complaint.id,
        reporter_name=complaint.reporter_name,
        category=complaint.category,
        details=complaint.description,
        status=complaint.status,
    )


@router.get("/{complaint_id}", response_model=ComplaintRead)
def get_complaint(complaint_id: int, current_user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    complaint = db.query(Complaint).filter(Complaint.id == complaint_id).first()
    if not complaint:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Complaint not found")
    return ComplaintRead(
        id=complaint.id,
        reporter_name=complaint.reporter_name,
        category=complaint.category,
        details=complaint.description,
        status=complaint.status,
    )


@router.put("/{complaint_id}", response_model=ComplaintRead)
def update_complaint(complaint_id: int, payload: ComplaintCreate, current_user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    complaint = db.query(Complaint).filter(Complaint.id == complaint_id).first()
    if not complaint:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Complaint not found")

    complaint.reporter_name = payload.reporter_name
    complaint.category = payload.category
    complaint.description = payload.details
    db.commit()
    db.refresh(complaint)

    return ComplaintRead(
        id=complaint.id,
        reporter_name=complaint.reporter_name,
        category=complaint.category,
        details=complaint.description,
        status=complaint.status,
    )


@router.delete("/{complaint_id}")
def delete_complaint(complaint_id: int, current_user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    complaint = db.query(Complaint).filter(Complaint.id == complaint_id).first()
    if not complaint:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Complaint not found")

    db.delete(complaint)
    db.commit()
    return {"message": "Complaint deleted"}

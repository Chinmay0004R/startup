from typing import List

from fastapi import APIRouter

from app.schemas.complaint import ComplaintCreate, ComplaintRead

router = APIRouter(prefix="/complaints", tags=["complaints"])

COMPLAINTS: List[ComplaintRead] = []


@router.get("/", response_model=List[ComplaintRead])
def list_complaints():
    return COMPLAINTS


@router.post("/", response_model=ComplaintRead)
def create_complaint(payload: ComplaintCreate):
    complaint = ComplaintRead(
        id=len(COMPLAINTS) + 1,
        reporter_name=payload.reporter_name,
        category=payload.category,
        details=payload.details,
        status="submitted",
    )
    COMPLAINTS.append(complaint)
    return complaint

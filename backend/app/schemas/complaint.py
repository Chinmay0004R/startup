from datetime import datetime
from pydantic import BaseModel
from typing import Optional


class ComplaintCreate(BaseModel):
    reporter_name: str
    category: str
    description: str
    evidence_url: Optional[str] = None


class ComplaintRead(BaseModel):
    id: int
    reporter_name: str
    category: str
    description: str
    status: str = "submitted"
    evidence_url: Optional[str] = None
    submitted_by: Optional[int] = None
    against_user: Optional[int] = None
    created_at: datetime

    class Config:
        orm_mode = True

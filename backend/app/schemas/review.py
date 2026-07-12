from datetime import datetime

from pydantic import BaseModel


class ReviewCreate(BaseModel):
    doctor_id: int
    rating: int
    comment: str


class ReviewUpdate(BaseModel):
    rating: int | None = None
    comment: str | None = None


class ReviewRead(BaseModel):
    id: int
    reviewer_id: int
    reviewer_name: str | None = None
    doctor_id: int
    rating: int
    comment: str
    created_at: datetime

    class Config:
        orm_mode = True

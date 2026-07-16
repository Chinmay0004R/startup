from datetime import datetime
from pydantic import BaseModel


class CommentCreate(BaseModel):
    post_id: int
    user_id: int
    comment: str


class CommentRead(BaseModel):
    id: int
    post_id: int
    user_id: int
    comment: str
    created_at: datetime

    class Config:
        from_attributes = True

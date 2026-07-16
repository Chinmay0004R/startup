from datetime import datetime
from pydantic import BaseModel
from typing import Optional


class PostBase(BaseModel):
    author_name: str
    content: str
    likes: int = 0
    author_id: int | None = None


class PostCreate(PostBase):
    pass


class PostRead(PostBase):
    id: int
    image_url: Optional[str] = None
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True

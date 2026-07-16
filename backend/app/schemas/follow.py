from datetime import datetime

from pydantic import BaseModel


class FollowCreate(BaseModel):
    follower_id: int
    following_id: int


class FollowRead(BaseModel):
    id: int
    follower_id: int
    following_id: int
    created_at: datetime

    class Config:
        from_attributes = True

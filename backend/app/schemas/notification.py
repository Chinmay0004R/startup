from datetime import datetime

from pydantic import BaseModel


class NotificationCreate(BaseModel):
    user_id: int
    title: str
    message: str


class NotificationRead(BaseModel):
    id: int
    user_id: int
    title: str
    message: str
    is_read: bool = False
    created_at: datetime

    class Config:
        orm_mode = True

from pydantic import BaseModel, EmailStr
from typing import Optional


class UserBase(BaseModel):
    name: str
    email: EmailStr


class UserCreate(UserBase):
    password: str


class UserUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    profile_image: Optional[str] = None
    bio: Optional[str] = None
    city: Optional[str] = None
    specialization: Optional[str] = None
    hospital: Optional[str] = None
    years_experience: Optional[float] = None
    medical_license: Optional[str] = None


class UserRead(UserBase):
    id: int
    profile_image: Optional[str] = None
    bio: Optional[str] = None
    city: Optional[str] = None
    specialization: Optional[str] = None
    hospital: Optional[str] = None
    years_experience: Optional[float] = None
    medical_license: Optional[str] = None
    followers_count: int = 0
    following_count: int = 0
    posts_count: int = 0
    is_verified: bool = False
    role: Optional[str] = None

    class Config:
        from_attributes = True

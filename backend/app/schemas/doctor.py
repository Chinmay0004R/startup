from pydantic import BaseModel, EmailStr


class DoctorBase(BaseModel):
    name: str
    specialty: str
    email: EmailStr


class DoctorCreate(DoctorBase):
    pass


class DoctorRead(DoctorBase):
    id: int

    class Config:
        orm_mode = True

from pydantic import BaseModel, EmailStr


class DoctorBase(BaseModel):
    name: str
    specialty: str
    email: EmailStr
    hospital: str | None = None
    years_experience: int | None = None
    verified: bool = False


class DoctorCreate(DoctorBase):
    pass


class DoctorRead(DoctorBase):
    id: int

    class Config:
        orm_mode = True

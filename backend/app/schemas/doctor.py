from pydantic import BaseModel, EmailStr


class DoctorBase(BaseModel):
    name: str
    specialty: str | None = None
    email: EmailStr
    hospital: str | None = None
    years_experience: int | None = None
    registration_number: str | None = None
    verified: bool = False
    profile_image: str | None = None


class DoctorCreate(DoctorBase):
    pass


class DoctorRead(DoctorBase):
    id: int

    model_config = {
        "from_attributes": True,
    }

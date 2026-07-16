from pydantic import BaseModel


class SafetyAlertCreate(BaseModel):
    doctor_name: str
    location: str
    details: str


class SafetyAlertUpdate(BaseModel):
    doctor_name: str | None = None
    location: str | None = None
    details: str | None = None
    status: str | None = None


class SafetyAlertRead(BaseModel):
    id: int
    doctor_name: str | None = None
    location: str | None = None
    description: str
    status: str = "received"

    class Config:
        from_attributes = True

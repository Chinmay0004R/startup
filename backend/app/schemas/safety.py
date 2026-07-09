from pydantic import BaseModel


class SafetyAlertCreate(BaseModel):
    doctor_name: str
    location: str
    details: str


class SafetyAlertRead(BaseModel):
    id: int
    doctor_name: str
    location: str
    details: str
    status: str = "received"

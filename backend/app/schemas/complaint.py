from pydantic import BaseModel


class ComplaintCreate(BaseModel):
    reporter_name: str
    category: str
    details: str


class ComplaintRead(BaseModel):
    id: int
    reporter_name: str
    category: str
    details: str
    status: str = "submitted"

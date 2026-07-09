from typing import List

from fastapi import APIRouter

from app.schemas.safety import SafetyAlertCreate, SafetyAlertRead

router = APIRouter(prefix="/safety", tags=["safety"])

ALERTS: List[SafetyAlertRead] = []


@router.get("/alerts/", response_model=List[SafetyAlertRead])
def list_alerts():
    return ALERTS


@router.post("/alerts/", response_model=SafetyAlertRead)
def create_alert(payload: SafetyAlertCreate):
    alert = SafetyAlertRead(
        id=len(ALERTS) + 1,
        doctor_name=payload.doctor_name,
        location=payload.location,
        details=payload.details,
        status="received",
    )
    ALERTS.append(alert)
    return alert

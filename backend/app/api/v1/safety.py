from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.schemas.safety import SafetyAlertCreate, SafetyAlertRead, SafetyAlertUpdate
from app.core.database import get_db
from app.models.sos_incident import SOSIncident
from app.models.user import RoleEnum
from app.api.v1.auth import get_current_user

router = APIRouter(prefix="/safety", tags=["safety"])


@router.get("/alerts/", response_model=List[SafetyAlertRead])
def list_alerts(current_user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    alerts = db.query(SOSIncident).all()
    return alerts


@router.post("/alerts/", response_model=SafetyAlertRead)
def create_alert(payload: SafetyAlertCreate, current_user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    if current_user.get("role") != RoleEnum.DOCTOR.value:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only doctors can trigger SOS alerts")

    alert = SOSIncident(
        doctor_name=payload.doctor_name,
        location=payload.location,
        description=payload.details,
        status="received",
    )
    db.add(alert)
    db.commit()
    db.refresh(alert)

    return alert


@router.get("/alerts/{alert_id}", response_model=SafetyAlertRead)
def get_alert(alert_id: int, current_user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    alert = db.query(SOSIncident).filter(SOSIncident.id == alert_id).first()
    if not alert:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="SOS alert not found")
    return alert


@router.put("/alerts/{alert_id}", response_model=SafetyAlertRead)
def update_alert(alert_id: int, payload: SafetyAlertUpdate, current_user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    alert = db.query(SOSIncident).filter(SOSIncident.id == alert_id).first()
    if not alert:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="SOS alert not found")

    if current_user.get("role") != RoleEnum.DOCTOR.value:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only doctors can update SOS alerts")

    # Only update fields that are provided (partial update)
    if payload.doctor_name is not None:
        alert.doctor_name = payload.doctor_name
    if payload.location is not None:
        alert.location = payload.location
    if payload.details is not None:
        alert.description = payload.details
    if payload.status is not None:
        alert.status = payload.status
    
    db.commit()
    db.refresh(alert)

    return alert


@router.delete("/alerts/{alert_id}")
def delete_alert(alert_id: int, current_user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    alert = db.query(SOSIncident).filter(SOSIncident.id == alert_id).first()
    if not alert:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="SOS alert not found")

    if current_user.get("role") != RoleEnum.DOCTOR.value:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only doctors can delete SOS alerts")

    db.delete(alert)
    db.commit()
    return {"message": "SOS alert deleted"}

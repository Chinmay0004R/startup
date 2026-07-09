from fastapi import APIRouter

router = APIRouter(prefix="/doctors", tags=["doctors"])

@router.get("/")
def list_doctors():
    return {"message": "List doctors placeholder"}

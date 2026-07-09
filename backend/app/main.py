from fastapi import FastAPI

from app.core.config import settings
from app.api.v1 import router as api_router

app = FastAPI(title=settings.PROJECT_NAME, version=settings.VERSION)
app.include_router(api_router, prefix="/api/v1")


@app.get("/")
def read_root():
    return {"message": "Hospital management backend is running"}

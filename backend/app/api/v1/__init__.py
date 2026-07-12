from fastapi import APIRouter

from .auth import router as auth_router
from .complaints import router as complaints_router
from .doctors import router as doctors_router
from .posts import router as posts_router
from .safety import router as safety_router
from .users import router as users_router
from .doctor_profiles import router as doctor_profiles_router
from .reviews import router as reviews_router
from .follows import router as follows_router
from .notifications import router as notifications_router

router = APIRouter()
router.include_router(auth_router)
router.include_router(users_router)
router.include_router(doctors_router)
router.include_router(doctor_profiles_router)
router.include_router(reviews_router)
router.include_router(follows_router)
router.include_router(notifications_router)
router.include_router(safety_router)
router.include_router(posts_router)
router.include_router(complaints_router)

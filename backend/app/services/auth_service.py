from app.core.security import verify_password, get_password_hash
from app.models.user import User


def authenticate_user(username: str, password: str):
    # Placeholder for authentication logic
    return None


def create_user(username: str, email: str, password: str):
    hashed_password = get_password_hash(password)
    return User(username=username, email=email, hashed_password=hashed_password)

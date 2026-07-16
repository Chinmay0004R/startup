import os
from pathlib import Path

_INSECURE_SECRET_KEYS = frozenset({"", "change-me-in-production", "your_secret_key_here"})
_DEFAULT_DEV_CORS_ORIGINS = [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:5174",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]


_BACKEND_ROOT = Path(__file__).resolve().parents[2]
_DEFAULT_SQLITE_PATH = (_BACKEND_ROOT / "app.db").as_posix()
_DEFAULT_DATABASE_URL = f"sqlite:///{_DEFAULT_SQLITE_PATH}"


def _load_env_file() -> None:
    env_path = Path(__file__).resolve().parents[2] / ".env"
    if not env_path.exists():
        return

    for line in env_path.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue

        key, value = line.split("=", 1)
        os.environ.setdefault(key.strip(), value.strip().strip('"').strip("'"))


def _parse_cors_origins() -> list[str]:
    raw = os.getenv("CORS_ORIGINS", "")
    if raw.strip():
        return [origin.strip() for origin in raw.split(",") if origin.strip()]
    return list(_DEFAULT_DEV_CORS_ORIGINS)


_load_env_file()


class Settings:
    PROJECT_NAME: str = os.getenv("PROJECT_NAME", "Healthcare Social Platform")
    VERSION: str = os.getenv("VERSION", "2.0.0")
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")
    DEBUG: bool = os.getenv("DEBUG", "False").lower() == "true"
    DATABASE_URL: str = os.getenv("DATABASE_URL", _DEFAULT_DATABASE_URL)
    SECRET_KEY: str = os.getenv("SECRET_KEY", "change-me-in-production")

    # JWT Settings
    JWT_ALGORITHM: str = os.getenv("JWT_ALGORITHM", "HS256")
    JWT_EXPIRATION_HOURS: int = int(os.getenv("JWT_EXPIRATION_HOURS", "24"))
    JWT_REFRESH_EXPIRATION_DAYS: int = int(os.getenv("JWT_REFRESH_EXPIRATION_DAYS", "7"))

    # SMTP Settings
    SMTP_HOST: str = os.getenv("SMTP_HOST", "smtp.gmail.com")
    SMTP_PORT: int = int(os.getenv("SMTP_PORT", "465"))
    SMTP_EMAIL: str = os.getenv("SMTP_EMAIL", "")
    SMTP_PASSWORD: str = os.getenv("SMTP_PASSWORD", "")

    # Google Settings
    GOOGLE_CLIENT_ID: str = os.getenv("GOOGLE_CLIENT_ID", "")

    # Cloudinary Settings
    CLOUDINARY_CLOUD_NAME: str = os.getenv("CLOUDINARY_CLOUD_NAME", "")
    CLOUDINARY_API_KEY: str = os.getenv("CLOUDINARY_API_KEY", "")
    CLOUDINARY_API_SECRET: str = os.getenv("CLOUDINARY_API_SECRET", "")

    # CORS Settings
    CORS_ORIGINS: list[str] = _parse_cors_origins()

    @property
    def is_production(self) -> bool:
        return self.ENVIRONMENT.lower() == "production"

    def validate(self) -> None:
        """Fail fast when required production settings are missing or insecure."""
        if not self.is_production:
            return

        if self.SECRET_KEY in _INSECURE_SECRET_KEYS:
            raise RuntimeError(
                "SECRET_KEY must be set to a strong random value when ENVIRONMENT=production"
            )

        if self.DATABASE_URL.startswith("sqlite"):
            raise RuntimeError(
                "DATABASE_URL must not use SQLite when ENVIRONMENT=production"
            )

        if not self.CORS_ORIGINS:
            raise RuntimeError(
                "CORS_ORIGINS must be set when ENVIRONMENT=production"
            )


settings = Settings()

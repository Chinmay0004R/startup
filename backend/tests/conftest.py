from pathlib import Path

import pytest
from alembic import command
from alembic.config import Config
from fastapi.testclient import TestClient

from app.main import app
from app.api.v1.auth import seed_test_users

BACKEND_ROOT = Path(__file__).resolve().parents[1]


def _apply_migrations() -> None:
    alembic_cfg = Config(str(BACKEND_ROOT / "alembic.ini"))
    alembic_cfg.set_main_option("script_location", str(BACKEND_ROOT / "alembic"))
    command.upgrade(alembic_cfg, "head")


@pytest.fixture(scope="session", autouse=True)
def _prepare_test_database():
    _apply_migrations()
    seed_test_users()


@pytest.fixture
def client():
    with TestClient(app) as test_client:
        yield test_client

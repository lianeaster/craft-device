import os
import sys
from pathlib import Path
from pydantic_settings import BaseSettings


def _default_db_url() -> str:
    """Build a SQLite URL that points to the directory next to the exe (frozen)
    or the backend/ directory (development)."""
    if getattr(sys, "frozen", False):
        base = Path(os.environ.get("CRAFT_APP_DIR", Path(sys.executable).parent))
    else:
        base = Path(__file__).resolve().parent.parent  # backend/
    db_path = base / "craft_device.db"
    return f"sqlite:///{db_path}"


class Settings(BaseSettings):
    APP_NAME: str = "Craft-Device"
    SECRET_KEY: str = "craft-device-super-secret-key-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24
    DATABASE_URL: str = _default_db_url()
    UPLOAD_DIR: str = "app/static/uploads"

    class Config:
        env_file = ".env"


settings = Settings()

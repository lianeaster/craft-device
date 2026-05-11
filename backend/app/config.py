from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    APP_NAME: str = "Craft-Device"
    SECRET_KEY: str = "craft-device-super-secret-key-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24
    DATABASE_URL: str = "sqlite:///./craft_device.db"
    UPLOAD_DIR: str = "app/static/uploads"

    class Config:
        env_file = ".env"


settings = Settings()

from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class PortfolioCreate(BaseModel):
    title: str
    description: Optional[str] = None
    tags: list[str] = []
    materials: Optional[str] = None
    production_time_days: Optional[int] = None


class PortfolioOut(BaseModel):
    id: int
    owner_id: int
    title: str
    description: Optional[str] = None
    images: list = []
    tags: list = []
    materials: Optional[str] = None
    production_time_days: Optional[int] = None
    created_at: datetime
    owner_name: str = ""
    owner_company: Optional[str] = None

    model_config = {"from_attributes": True}


class CategoryOut(BaseModel):
    id: int
    name: str
    slug: str
    description: Optional[str] = None
    icon: Optional[str] = None
    image_url: Optional[str] = None

    model_config = {"from_attributes": True}

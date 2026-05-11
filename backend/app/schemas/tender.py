from pydantic import BaseModel
from typing import Optional
from datetime import datetime

from app.models.tender import TenderStatus, BidStatus


class TenderCreate(BaseModel):
    title: str
    description: str
    category_id: Optional[int] = None
    budget_min: Optional[float] = None
    budget_max: Optional[float] = None
    currency: str = "UAH"
    deadline: Optional[datetime] = None
    location: Optional[str] = None


class TenderOut(BaseModel):
    id: int
    title: str
    description: str
    owner_id: int
    category_id: Optional[int] = None
    budget_min: Optional[float] = None
    budget_max: Optional[float] = None
    currency: str
    status: TenderStatus
    deadline: Optional[datetime] = None
    image_url: Optional[str] = None
    attachments: list = []
    location: Optional[str] = None
    created_at: datetime
    bids_count: int = 0
    owner_name: str = ""
    category_name: Optional[str] = None

    model_config = {"from_attributes": True}


class BidCreate(BaseModel):
    amount: float
    message: Optional[str] = None
    estimated_days: Optional[int] = None


class BidOut(BaseModel):
    id: int
    tender_id: int
    bidder_id: int
    amount: float
    currency: str
    message: Optional[str] = None
    estimated_days: Optional[int] = None
    status: BidStatus
    created_at: datetime
    bidder_name: str = ""
    bidder_rating: int = 0
    bidder_company: Optional[str] = None

    model_config = {"from_attributes": True}


class MyBidOut(BidOut):
    tender_title: str = ""
    tender_status: Optional[TenderStatus] = None
    tender_budget_min: Optional[float] = None
    tender_budget_max: Optional[float] = None

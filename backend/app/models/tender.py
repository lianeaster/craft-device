from sqlalchemy import (
    Column, Integer, String, Text, DateTime, Float,
    ForeignKey, Enum as SAEnum, JSON,
)
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
import enum

from app.database import Base


class TenderStatus(str, enum.Enum):
    DRAFT = "draft"
    ACTIVE = "active"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    CANCELLED = "cancelled"


class BidStatus(str, enum.Enum):
    PENDING = "pending"
    ACCEPTED = "accepted"
    REJECTED = "rejected"
    WITHDRAWN = "withdrawn"


class Tender(Base):
    __tablename__ = "tenders"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(300), nullable=False)
    description = Column(Text, nullable=False)
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    category_id = Column(Integer, ForeignKey("categories.id"))
    budget_min = Column(Float)
    budget_max = Column(Float)
    currency = Column(String(10), default="UAH")
    status = Column(SAEnum(TenderStatus), default=TenderStatus.ACTIVE)
    deadline = Column(DateTime)
    image_url = Column(String(500))
    attachments = Column(JSON, default=list)
    location = Column(String(200))
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, onupdate=lambda: datetime.now(timezone.utc))

    owner = relationship("User", back_populates="tenders", foreign_keys=[owner_id])
    category = relationship("Category", back_populates="tenders")
    bids = relationship("TenderBid", back_populates="tender", order_by="TenderBid.amount")


class TenderBid(Base):
    __tablename__ = "tender_bids"

    id = Column(Integer, primary_key=True, index=True)
    tender_id = Column(Integer, ForeignKey("tenders.id"), nullable=False)
    bidder_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    amount = Column(Float, nullable=False)
    currency = Column(String(10), default="UAH")
    message = Column(Text)
    estimated_days = Column(Integer)
    status = Column(SAEnum(BidStatus), default=BidStatus.PENDING)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    tender = relationship("Tender", back_populates="bids")
    bidder = relationship("User", back_populates="bids", foreign_keys=[bidder_id])

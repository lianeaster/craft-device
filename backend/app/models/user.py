from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text, Enum as SAEnum
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
import enum

from app.database import Base


class UserRole(str, enum.Enum):
    CUSTOMER = "customer"
    MANUFACTURER = "manufacturer"
    ADMIN = "admin"


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=False)
    company_name = Column(String(255))
    phone = Column(String(50))
    role = Column(SAEnum(UserRole), default=UserRole.CUSTOMER, nullable=False)
    bio = Column(Text)
    avatar_url = Column(String(500))
    city = Column(String(100))
    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=False)
    rating = Column(Integer, default=0)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    tenders = relationship("Tender", back_populates="owner", foreign_keys="Tender.owner_id")
    bids = relationship("TenderBid", back_populates="bidder", foreign_keys="TenderBid.bidder_id")
    portfolio_items = relationship("PortfolioItem", back_populates="owner")

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User, UserRole
from app.models.tender import Tender, TenderBid
from app.models.portfolio import PortfolioItem

router = APIRouter(prefix="/api/stats", tags=["stats"])


@router.get("")
def get_stats(db: Session = Depends(get_db)):
    return {
        "manufacturers": db.query(User).filter(User.role == UserRole.MANUFACTURER).count(),
        "tenders": db.query(Tender).count(),
        "bids": db.query(TenderBid).count(),
        "portfolio_items": db.query(PortfolioItem).count(),
    }

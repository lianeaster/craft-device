from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session, joinedload
from typing import Optional

from app.database import get_db
from app.models.user import User
from app.models.tender import Tender, TenderBid, TenderStatus, BidStatus
from app.models.category import Category
from app.schemas.tender import TenderCreate, TenderOut, BidCreate, BidOut
from app.services.auth import require_auth, get_current_user

router = APIRouter(prefix="/api/tenders", tags=["tenders"])


def _tender_to_out(t: Tender) -> TenderOut:
    return TenderOut(
        id=t.id,
        title=t.title,
        description=t.description,
        owner_id=t.owner_id,
        category_id=t.category_id,
        budget_min=t.budget_min,
        budget_max=t.budget_max,
        currency=t.currency,
        status=t.status,
        deadline=t.deadline,
        image_url=t.image_url,
        attachments=t.attachments or [],
        location=t.location,
        created_at=t.created_at,
        bids_count=len(t.bids) if t.bids else 0,
        owner_name=t.owner.full_name if t.owner else "",
        category_name=t.category.name if t.category else None,
    )


@router.get("", response_model=list[TenderOut])
def list_tenders(
    status: Optional[TenderStatus] = None,
    category_id: Optional[int] = None,
    search: Optional[str] = None,
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
):
    q = db.query(Tender).options(joinedload(Tender.owner), joinedload(Tender.category), joinedload(Tender.bids))

    if status:
        q = q.filter(Tender.status == status)
    else:
        q = q.filter(Tender.status == TenderStatus.ACTIVE)

    if category_id:
        q = q.filter(Tender.category_id == category_id)

    if search:
        q = q.filter(Tender.title.ilike(f"%{search}%") | Tender.description.ilike(f"%{search}%"))

    tenders = q.order_by(Tender.created_at.desc()).offset(skip).limit(limit).all()
    return [_tender_to_out(t) for t in tenders]


@router.get("/{tender_id}", response_model=TenderOut)
def get_tender(tender_id: int, db: Session = Depends(get_db)):
    t = (
        db.query(Tender)
        .options(joinedload(Tender.owner), joinedload(Tender.category), joinedload(Tender.bids))
        .filter(Tender.id == tender_id)
        .first()
    )
    if not t:
        raise HTTPException(status_code=404, detail="Тендер не знайдено")
    return _tender_to_out(t)


@router.post("", response_model=TenderOut)
def create_tender(payload: TenderCreate, user: User = Depends(require_auth), db: Session = Depends(get_db)):
    tender = Tender(
        title=payload.title,
        description=payload.description,
        owner_id=user.id,
        category_id=payload.category_id,
        budget_min=payload.budget_min,
        budget_max=payload.budget_max,
        currency=payload.currency,
        deadline=payload.deadline,
        location=payload.location,
    )
    db.add(tender)
    db.commit()
    db.refresh(tender)

    t = (
        db.query(Tender)
        .options(joinedload(Tender.owner), joinedload(Tender.category), joinedload(Tender.bids))
        .filter(Tender.id == tender.id)
        .first()
    )
    return _tender_to_out(t)


@router.get("/{tender_id}/bids", response_model=list[BidOut])
def list_bids(tender_id: int, db: Session = Depends(get_db)):
    tender = db.query(Tender).filter(Tender.id == tender_id).first()
    if not tender:
        raise HTTPException(status_code=404, detail="Тендер не знайдено")

    bids = (
        db.query(TenderBid)
        .options(joinedload(TenderBid.bidder))
        .filter(TenderBid.tender_id == tender_id)
        .order_by(TenderBid.amount.asc())
        .all()
    )
    return [
        BidOut(
            id=b.id,
            tender_id=b.tender_id,
            bidder_id=b.bidder_id,
            amount=b.amount,
            currency=b.currency,
            message=b.message,
            estimated_days=b.estimated_days,
            status=b.status,
            created_at=b.created_at,
            bidder_name=b.bidder.full_name if b.bidder else "",
            bidder_rating=b.bidder.rating if b.bidder else 0,
            bidder_company=b.bidder.company_name if b.bidder else None,
        )
        for b in bids
    ]


@router.post("/{tender_id}/bids", response_model=BidOut)
def place_bid(
    tender_id: int,
    payload: BidCreate,
    user: User = Depends(require_auth),
    db: Session = Depends(get_db),
):
    tender = db.query(Tender).filter(Tender.id == tender_id).first()
    if not tender:
        raise HTTPException(status_code=404, detail="Тендер не знайдено")
    if tender.status != TenderStatus.ACTIVE:
        raise HTTPException(status_code=400, detail="Тендер не активний")
    if tender.owner_id == user.id:
        raise HTTPException(status_code=400, detail="Не можна робити ставку на свій тендер")

    existing = db.query(TenderBid).filter(TenderBid.tender_id == tender_id, TenderBid.bidder_id == user.id).first()
    if existing:
        raise HTTPException(status_code=400, detail="Ви вже зробили ставку на цей тендер")

    bid = TenderBid(
        tender_id=tender_id,
        bidder_id=user.id,
        amount=payload.amount,
        currency=tender.currency,
        message=payload.message,
        estimated_days=payload.estimated_days,
    )
    db.add(bid)
    db.commit()
    db.refresh(bid)

    return BidOut(
        id=bid.id,
        tender_id=bid.tender_id,
        bidder_id=bid.bidder_id,
        amount=bid.amount,
        currency=bid.currency,
        message=bid.message,
        estimated_days=bid.estimated_days,
        status=bid.status,
        created_at=bid.created_at,
        bidder_name=user.full_name,
        bidder_rating=user.rating,
        bidder_company=user.company_name,
    )


@router.post("/{tender_id}/bids/{bid_id}/accept")
def accept_bid(
    tender_id: int,
    bid_id: int,
    user: User = Depends(require_auth),
    db: Session = Depends(get_db),
):
    tender = db.query(Tender).filter(Tender.id == tender_id).first()
    if not tender or tender.owner_id != user.id:
        raise HTTPException(status_code=403, detail="Тільки власник тендера може приймати ставки")

    bid = db.query(TenderBid).filter(TenderBid.id == bid_id, TenderBid.tender_id == tender_id).first()
    if not bid:
        raise HTTPException(status_code=404, detail="Ставку не знайдено")

    bid.status = BidStatus.ACCEPTED
    tender.status = TenderStatus.IN_PROGRESS
    db.query(TenderBid).filter(
        TenderBid.tender_id == tender_id, TenderBid.id != bid_id
    ).update({"status": BidStatus.REJECTED})
    db.commit()
    return {"message": "Ставку прийнято"}

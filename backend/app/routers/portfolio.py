import os
import uuid

from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Query
from sqlalchemy.orm import Session, joinedload
from typing import Optional

from app.config import settings
from app.database import get_db
from app.models.user import User
from app.models.portfolio import PortfolioItem
from app.schemas.portfolio import PortfolioCreate, PortfolioOut
from app.services.auth import require_auth

router = APIRouter(prefix="/api/portfolio", tags=["portfolio"])


def _item_to_out(item: PortfolioItem) -> PortfolioOut:
    return PortfolioOut(
        id=item.id,
        owner_id=item.owner_id,
        title=item.title,
        description=item.description,
        images=item.images or [],
        tags=item.tags or [],
        materials=item.materials,
        production_time_days=item.production_time_days,
        created_at=item.created_at,
        owner_name=item.owner.full_name if item.owner else "",
        owner_company=item.owner.company_name if item.owner else None,
    )


@router.get("", response_model=list[PortfolioOut])
def list_portfolio(
    owner_id: Optional[int] = None,
    search: Optional[str] = None,
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
):
    q = db.query(PortfolioItem).options(joinedload(PortfolioItem.owner))

    if owner_id:
        q = q.filter(PortfolioItem.owner_id == owner_id)
    if search:
        q = q.filter(PortfolioItem.title.ilike(f"%{search}%"))

    items = q.order_by(PortfolioItem.created_at.desc()).offset(skip).limit(limit).all()
    return [_item_to_out(i) for i in items]


@router.post("", response_model=PortfolioOut)
def create_portfolio_item(
    payload: PortfolioCreate,
    user: User = Depends(require_auth),
    db: Session = Depends(get_db),
):
    item = PortfolioItem(
        owner_id=user.id,
        title=payload.title,
        description=payload.description,
        tags=payload.tags,
        materials=payload.materials,
        production_time_days=payload.production_time_days,
    )
    db.add(item)
    db.commit()
    db.refresh(item)

    return _item_to_out(
        db.query(PortfolioItem).options(joinedload(PortfolioItem.owner)).filter(PortfolioItem.id == item.id).first()
    )


@router.post("/{item_id}/upload-image")
async def upload_portfolio_image(
    item_id: int,
    file: UploadFile = File(...),
    user: User = Depends(require_auth),
    db: Session = Depends(get_db),
):
    item = db.query(PortfolioItem).filter(PortfolioItem.id == item_id).first()
    if not item or item.owner_id != user.id:
        raise HTTPException(status_code=403, detail="Немає доступу")

    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
    ext = os.path.splitext(file.filename)[1] if file.filename else ".jpg"
    filename = f"{uuid.uuid4().hex}{ext}"
    filepath = os.path.join(settings.UPLOAD_DIR, filename)

    content = await file.read()
    with open(filepath, "wb") as f:
        f.write(content)

    images = item.images or []
    images.append(f"/static/uploads/{filename}")
    item.images = images
    db.commit()

    return {"url": f"/static/uploads/{filename}"}

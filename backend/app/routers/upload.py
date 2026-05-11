import os
import uuid

from fastapi import APIRouter, Depends, UploadFile, File
from app.config import settings
from app.models.user import User
from app.services.auth import require_auth

router = APIRouter(prefix="/api/upload", tags=["upload"])

ALLOWED_EXTENSIONS = {".pdf", ".dwg", ".dxf", ".step", ".stp", ".iges", ".stl", ".obj", ".png", ".jpg", ".jpeg"}


@router.post("")
async def upload_file(
    file: UploadFile = File(...),
    user: User = Depends(require_auth),
):
    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
    ext = os.path.splitext(file.filename)[1].lower() if file.filename else ""

    if ext not in ALLOWED_EXTENSIONS:
        return {"error": f"Формат {ext} не підтримується. Дозволені: {', '.join(sorted(ALLOWED_EXTENSIONS))}"}

    filename = f"{uuid.uuid4().hex}{ext}"
    filepath = os.path.join(settings.UPLOAD_DIR, filename)

    content = await file.read()
    with open(filepath, "wb") as f:
        f.write(content)

    return {
        "url": f"/static/uploads/{filename}",
        "original_name": file.filename,
        "size": len(content),
    }

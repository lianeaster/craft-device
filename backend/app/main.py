from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import os
from pathlib import Path

from app.database import engine, Base, SessionLocal
from app.models import User, Tender, TenderBid, PortfolioItem, Category
from app.routers import auth, tenders, portfolio, categories, upload, stats

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Craft-Device API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

os.makedirs("app/static/uploads", exist_ok=True)
app.mount("/static", StaticFiles(directory="app/static"), name="static")

app.include_router(auth.router)
app.include_router(tenders.router)
app.include_router(portfolio.router)
app.include_router(categories.router)
app.include_router(upload.router)
app.include_router(stats.router)


@app.get("/api/health")
def health():
    return {"status": "ok", "app": "Craft-Device"}


# --- Serve built React frontend in production ---
_base = Path(os.environ.get("CRAFT_BASE_PATH", Path(__file__).resolve().parent.parent.parent))
_dist = _base / "frontend" / "dist"

if _dist.is_dir():
    app.mount("/assets", StaticFiles(directory=str(_dist / "assets")), name="frontend-assets")

    @app.api_route("/{full_path:path}", methods=["GET"], include_in_schema=False)
    async def serve_spa(request: Request, full_path: str):
        if full_path.startswith("api/") or full_path.startswith("static/"):
            from fastapi import HTTPException
            raise HTTPException(status_code=404)
        file = _dist / full_path
        if file.is_file():
            return FileResponse(str(file))
        return FileResponse(str(_dist / "index.html"))


@app.on_event("startup")
def seed_database():
    db = SessionLocal()
    if db.query(Category).count() == 0:
        defaults = [
            Category(name="Металообробка", slug="metalwork", description="Обладнання для обробки металу", icon="⚙️"),
            Category(name="Деревообробка", slug="woodwork", description="Обладнання для обробки дерева", icon="🪵"),
            Category(name="Харчове обладнання", slug="food-equipment", description="Крафтове харчове обладнання", icon="🍺"),
            Category(name="Скло та кераміка", slug="glass-ceramics", description="Обладнання для скла та кераміки", icon="🏺"),
            Category(name="Текстиль", slug="textile", description="Обладнання для текстильного виробництва", icon="🧵"),
            Category(name="Фільтрація", slug="filtration", description="Фільтри та системи очищення", icon="🔬"),
            Category(name="Пакування", slug="packaging", description="Обладнання для пакування", icon="📦"),
            Category(name="Інше", slug="other", description="Інше крафтове обладнання", icon="🔧"),
        ]
        db.add_all(defaults)
        db.commit()
    db.close()

    from app.seed import seed_all
    seed_all()

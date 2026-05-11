from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os

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


@app.get("/api/health")
def health():
    return {"status": "ok", "app": "Craft-Device"}

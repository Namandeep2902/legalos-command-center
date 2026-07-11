from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from app.database import ping_db
from app.routes import cases, documents, users

load_dotenv()

app = FastAPI(
    title="LegalOS Backend API",
    description="AI-powered legal operations backend for insurance companies.",
    version="1.0.0",
)

# ── CORS ─────────────────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8080", "http://localhost:8081", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Routers ───────────────────────────────────────────────────────────────────
app.include_router(cases.router)
app.include_router(documents.router)
app.include_router(users.router)


# ── Health Check ──────────────────────────────────────────────────────────────
@app.get("/", tags=["Health"])
def root():
    db_ok = ping_db()
    return {
        "status": "online",
        "service": "LegalOS Backend",
        "version": "1.0.0",
        "mongodb": "connected" if db_ok else "disconnected",
    }


@app.get("/health", tags=["Health"])
def health():
    db_ok = ping_db()
    return {
        "api": "ok",
        "mongodb": "ok" if db_ok else "error",
    }

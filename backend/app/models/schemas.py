from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


# ─── User ────────────────────────────────────────────────────────────────────
class UserCreate(BaseModel):
    name: str
    email: str
    role: str  # Admin | Counsel | Analyst | Claims | External


class UserOut(BaseModel):
    id: str
    name: str
    email: str
    role: str


# ─── Case ────────────────────────────────────────────────────────────────────
class CaseCreate(BaseModel):
    title: str
    case_type: str           # Motor | Health | Property | Life
    risk: str                # High | Medium | Low
    priority: str            # HIGH | MEDIUM | LOW
    health_score: int = 50
    money: str               # e.g. "₹42,80,000"
    stage: str               # Pre-Litigation | Consumer Court | High Court …
    next_hearing: Optional[str] = None
    status: str = "Under Review"


class CaseOut(CaseCreate):
    id: str
    created_at: datetime


# ─── Document ────────────────────────────────────────────────────────────────
class DocumentOut(BaseModel):
    id: str
    case_id: str
    filename: str
    category: str            # FIR | Claim Form | Policy | Survey Report …
    text: str
    uploaded_at: datetime


# ─── AI Analysis ─────────────────────────────────────────────────────────────
class CrossDocFinding(BaseModel):
    field: str
    severity: str            # critical | high | medium | low
    documents: list[dict]    # [{"name": "FIR", "value": "12 Jan"}]
    analysis: str
    impact: str
    recommendation: str


class AIAnalysisOut(BaseModel):
    id: str
    case_id: str
    brief: str
    timeline: list[dict]
    missing_docs: list[str]
    recommendations: list[dict]
    cross_doc: list[CrossDocFinding]
    risk_reason: str
    confidence: int
    created_at: datetime


# ─── Note ────────────────────────────────────────────────────────────────────
class NoteCreate(BaseModel):
    case_id: str
    author: str
    message: str


class NoteOut(NoteCreate):
    id: str
    created_at: datetime

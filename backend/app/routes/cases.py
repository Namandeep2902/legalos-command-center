from fastapi import APIRouter, HTTPException
from bson import ObjectId
from datetime import datetime
from app.database import cases_col, documents_col, ai_analysis_col, notes_col
from app.models.schemas import CaseCreate

router = APIRouter(prefix="/cases", tags=["Cases"])


def _id(doc: dict) -> dict:
    """Convert MongoDB ObjectId to string id."""
    doc["id"] = str(doc.pop("_id"))
    return doc


@router.get("/")
def list_cases(user_id: str = None):
    query = {}
    if user_id:
        query["user_id"] = user_id
    cases = list(cases_col.find(query).sort("created_at", -1))
    return [_id(c) for c in cases]


@router.post("/")
def create_case(payload: CaseCreate):
    data = payload.model_dump()
    data["created_at"] = datetime.utcnow()
    result = cases_col.insert_one(data)
    data["id"] = str(result.inserted_id)
    data.pop("_id", None)
    return data


@router.get("/{case_id}")
def get_case(case_id: str):
    try:
        case = cases_col.find_one({"_id": ObjectId(case_id)})
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid case ID")
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")
    return _id(case)


@router.get("/{case_id}/documents")
def get_case_documents(case_id: str):
    docs = list(documents_col.find({"case_id": case_id}).sort("uploaded_at", -1))
    for d in docs:
        d["id"] = str(d.pop("_id"))
        d.pop("text", None)  # Don't return full text in list view
    return docs


@router.get("/{case_id}/analysis")
def get_case_analysis(case_id: str):
    analysis = ai_analysis_col.find_one({"case_id": case_id})
    if not analysis:
        raise HTTPException(status_code=404, detail="No AI analysis yet. Upload documents first.")
    analysis["id"] = str(analysis.pop("_id"))
    return analysis

@router.delete("/{case_id}")
def delete_case(case_id: str):
    try:
        case = cases_col.find_one({"_id": ObjectId(case_id)})
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid case ID")
    
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")
        
    # Delete case and all associated data
    cases_col.delete_one({"_id": ObjectId(case_id)})
    documents_col.delete_many({"case_id": case_id})
    ai_analysis_col.delete_many({"case_id": case_id})
    notes_col.delete_many({"case_id": case_id})
    
    return {"status": "success", "message": "Case and all associated data deleted"}


@router.get("/{case_id}/notes")
def get_case_notes(case_id: str):
    notes = list(notes_col.find({"case_id": case_id}).sort("created_at", -1))
    for n in notes:
        n["id"] = str(n.pop("_id"))
    return notes


@router.post("/{case_id}/notes")
def add_note(case_id: str, payload: dict):
    note = {
        "case_id": case_id,
        "author": payload.get("author", "Unknown"),
        "message": payload.get("message", ""),
        "created_at": datetime.utcnow(),
    }
    result = notes_col.insert_one(note)
    note["id"] = str(result.inserted_id)
    note.pop("_id", None)
    return note


@router.delete("/{case_id}")
def delete_case(case_id: str):
    try:
        cases_col.delete_one({"_id": ObjectId(case_id)})
        documents_col.delete_many({"case_id": case_id})
        ai_analysis_col.delete_many({"case_id": case_id})
        notes_col.delete_many({"case_id": case_id})
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid case ID")
    return {"message": "Case and all related data deleted."}

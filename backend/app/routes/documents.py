from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from typing import Optional
from datetime import datetime, timedelta
from app.database import documents_col, cases_col
from app.services.document_service import process_uploaded_document

router = APIRouter(prefix="/documents", tags=["Documents"])


@router.get("/")
def list_documents(limit: int = 50, user_id: str = None):
    """
    Fetch all uploaded documents, sorted by upload time (newest first).
    If user_id is provided, only fetch documents for cases belonging to that user.
    """
    query = {}
    if user_id:
        user_cases = list(cases_col.find({"user_id": user_id}))
        case_ids = [str(c["_id"]) for c in user_cases]
        query["case_id"] = {"$in": case_ids}
        
    docs = list(documents_col.find(query).sort("uploaded_at", -1).limit(limit))
    result = []
    for d in docs:
        uploaded_at = d.get("uploaded_at", datetime.utcnow())
        # Format as relative time
        diff = datetime.utcnow() - uploaded_at
        if diff.total_seconds() < 3600:
            time_str = f"Today, {uploaded_at.strftime('%H:%M')}"
        elif diff.days == 0:
            time_str = f"Today, {uploaded_at.strftime('%H:%M')}"
        elif diff.days == 1:
            time_str = "Yesterday"
        else:
            time_str = f"{diff.days} days ago"

        result.append({
            "id": str(d["_id"]),
            "name": d.get("filename", "Unknown"),
            "type": d.get("category", "Other"),
            "source": "PDF Upload",
            "uploaded": time_str,
            "uploaded_at": uploaded_at.isoformat(),
            "status": "Processed",
            "confidence": d.get("confidence", 0),
            "case_id": d.get("case_id", ""),
        })
    return result


@router.post("/upload")
async def upload_document(
    file: UploadFile = File(...),
    case_id: Optional[str] = Form(None),
    user_id: Optional[str] = Form(None),
):
    """
    Upload a PDF document for a case.
    Pipeline: PDF → Extract Text → Fireworks AI → MongoDB → Cross-Doc Intel
    """
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported.")

    file_bytes = await file.read()

    if len(file_bytes) == 0:
        raise HTTPException(status_code=400, detail="Uploaded file is empty.")

    try:
        result = process_uploaded_document(
            file_bytes=file_bytes,
            filename=file.filename,
            case_id=case_id,
            user_id=user_id,
        )
        return {
            "status": "success",
            "message": f"Document '{file.filename}' processed successfully.",
            "data": result
        }
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Processing failed: {str(e)}")

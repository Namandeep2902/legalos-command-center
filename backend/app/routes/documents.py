from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from app.services.document_service import process_uploaded_document

router = APIRouter(prefix="/documents", tags=["Documents"])


@router.post("/upload")
async def upload_document(
    file: UploadFile = File(...),
    case_id: str = Form(...),
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
        )
        return {
            "status": "success",
            "message": f"Document '{file.filename}' processed successfully.",
            **result,
        }
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Processing failed: {str(e)}")

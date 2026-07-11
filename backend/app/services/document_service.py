from datetime import datetime
from bson import ObjectId
from app.database import documents_col, ai_analysis_col, cases_col
from app.utils.pdf_extractor import extract_text_from_pdf
from app.services.fireworks_service import call_fireworks
from app.prompts.legal_prompts import (
    CASE_ANALYSIS_PROMPT,
    CROSS_DOC_PROMPT,
    CASE_SUMMARY_PROMPT,
)


def process_uploaded_document(
    file_bytes: bytes,
    filename: str,
    case_id: str,
) -> dict:
    """
    Full pipeline:
    1. Extract text from PDF
    2. Send to Fireworks → get structured analysis JSON
    3. Store document + analysis in MongoDB
    4. Trigger cross-document intelligence update
    5. Return result
    """

    # ── STEP 1: Extract text ──────────────────────────────────────────────────
    text = extract_text_from_pdf(file_bytes)
    if not text:
        raise ValueError("Could not extract text from PDF. File may be scanned image without OCR layer.")

    # ── STEP 2: Fireworks analysis ────────────────────────────────────────────
    prompt = CASE_ANALYSIS_PROMPT.format(text=text[:8000])  # trim to token limit
    analysis = call_fireworks(prompt)

    category = analysis.get("category", "Other")
    confidence = analysis.get("confidence", 70)

    # ── STEP 3: Store document in MongoDB ─────────────────────────────────────
    doc_record = {
        "case_id": case_id,
        "filename": filename,
        "category": category,
        "text": text,
        "analysis": analysis,
        "confidence": confidence,
        "uploaded_at": datetime.utcnow(),
    }
    doc_result = documents_col.insert_one(doc_record)
    doc_id = str(doc_result.inserted_id)

    # ── STEP 4: Re-run cross-document intelligence for the case ──────────────
    _run_cross_doc_intel(case_id)

    return {
        "doc_id": doc_id,
        "filename": filename,
        "category": category,
        "confidence": confidence,
        "brief": analysis.get("brief", ""),
        "risk_signals": analysis.get("risk_signals", []),
    }


def _run_cross_doc_intel(case_id: str):
    """
    Fetch all documents for a case, run cross-document comparison via Fireworks,
    then upsert the ai_analysis collection.
    """
    docs = list(documents_col.find({"case_id": case_id}))
    if len(docs) < 2:
        return  # Need at least 2 documents to compare

    # Build a summary of all documents for the prompt
    doc_summaries = []
    for d in docs:
        doc_summaries.append(
            f"Document: {d['filename']} (Category: {d['category']})\n"
            f"Extracted Text (truncated):\n{d['text'][:2000]}\n"
        )
    documents_text = "\n---\n".join(doc_summaries)

    # Cross-doc comparison
    cross_doc_prompt = CROSS_DOC_PROMPT.format(documents=documents_text)
    cross_doc_findings = call_fireworks(cross_doc_prompt)

    # Case summary
    summary_prompt = CASE_SUMMARY_PROMPT.format(summary=documents_text[:6000])
    case_summary = call_fireworks(summary_prompt)

    # Upsert into ai_analysis collection
    ai_analysis_col.update_one(
        {"case_id": case_id},
        {
            "$set": {
                "case_id": case_id,
                "brief": case_summary.get("brief", ""),
                "timeline": case_summary.get("timeline", []),
                "missing_docs": case_summary.get("missing_docs", []),
                "recommendations": case_summary.get("recommendations", []),
                "cross_doc": cross_doc_findings if isinstance(cross_doc_findings, list) else [],
                "risk_reason": case_summary.get("risk_reason", ""),
                "confidence": 85,
                "created_at": datetime.utcnow(),
            }
        },
        upsert=True,
    )

    # Also update case health score and risk
    risk_level = case_summary.get("risk_level", "Medium")
    health_score = case_summary.get("health_score", 60)
    cases_col.update_one(
        {"_id": ObjectId(case_id)},
        {"$set": {"risk": risk_level, "health_score": health_score}},
    )

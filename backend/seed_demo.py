"""
Seed script: Creates 2 rich demo cases with documents, analysis, notes in MongoDB
Run: python seed_demo.py
"""
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from datetime import datetime, timedelta
from bson import ObjectId
from app.database import cases_col, documents_col, ai_analysis_col, notes_col, users_col

# ── Clear existing data ───────────────────────────────────────────────────────
print("Clearing existing demo data...")
cases_col.delete_many({})
documents_col.delete_many({})
ai_analysis_col.delete_many({})
notes_col.delete_many({})
users_col.delete_many({})

# ── Case 1: Motor Insurance ───────────────────────────────────────────────────
case1_id = ObjectId("6a52793a2f5228406135526b")
case1 = {
    "_id": case1_id,
    "title": "Sharma vs. ABC General Insurance — Motor Claim Rejection",
    "case_type": "Motor",
    "stage": "Consumer Court",
    "status": "Under Review",
    "risk": "High",
    "health_score": 42,
    "money": "₹12,50,000",
    "party": "Rahul Sharma",
    "next_hearing": "18 Jul 2026",
    "assigned_to": "Anita Nair",
    "description": "Consumer complaint filed after ABC General Insurance rejected comprehensive motor claim citing policy exclusion clause 4.2. Vehicle: Hyundai Creta (RJ14AB4589). Policy valid 15 Jan 2026 to 14 Jan 2027.",
    "created_at": datetime.utcnow() - timedelta(days=12),
}
cases_col.insert_one(case1)
print(f"✓ Case 1 created: {case1_id}")

# Docs for case1
doc1_id = ObjectId()
documents_col.insert_one({
    "_id": doc1_id,
    "case_id": str(case1_id),
    "filename": "motor_insurance_policy.pdf",
    "category": "Policy",
    "text": "ABC General Insurance Co. Ltd. Motor Comprehensive Insurance Policy. Insured: Rahul Sharma. Vehicle: Hyundai Creta RJ14AB4589. IDV: ₹12,50,000. Valid: 15 Jan 2026 to 14 Jan 2027. Exclusion Clause 4.2: Claim rejected if accident occurs while driving under influence.",
    "analysis": {
        "category": "Policy",
        "confidence": 95,
        "brief": "Comprehensive motor insurance policy issued to Rahul Sharma for Hyundai Creta. IDV ₹12,50,000, valid Jan 2026-2027.",
        "risk_signals": ["Exclusion clause 4.2 cited in rejection", "Policy validity needs cross-check with accident date"],
        "entities": {"insurer": "ABC General Insurance", "insured": "Rahul Sharma", "vehicle": "Hyundai Creta RJ14AB4589"}
    },
    "confidence": 95,
    "uploaded_at": datetime.utcnow() - timedelta(days=10),
})

doc2_id = ObjectId()
documents_col.insert_one({
    "_id": doc2_id,
    "case_id": str(case1_id),
    "filename": "claim_rejection_letter.pdf",
    "category": "Claim",
    "text": "Claim Rejection Notice. Date: 20 Feb 2026. Policy No: ABC-2026-MOT-4589. Claim No: CLM-20260214-001. Rejection Reason: Exclusion Clause 4.2 - Driver under influence at time of accident dated 14 Feb 2026. Claim Amount: ₹12,50,000.",
    "analysis": {
        "category": "Claim",
        "confidence": 91,
        "brief": "Formal rejection notice citing Clause 4.2. Accident date 14 Feb 2026 is within policy period. Reason disputed by insured.",
        "risk_signals": ["Rejection date inconsistency with FIR date", "No BAC test results attached", "Clause 4.2 application may be invalid"],
        "entities": {"claim_no": "CLM-20260214-001", "rejection_date": "20 Feb 2026", "accident_date": "14 Feb 2026"}
    },
    "confidence": 91,
    "uploaded_at": datetime.utcnow() - timedelta(days=8),
})

doc3_id = ObjectId()
documents_col.insert_one({
    "_id": doc3_id,
    "case_id": str(case1_id),
    "filename": "fir_copy.pdf",
    "category": "FIR",
    "text": "First Information Report. FIR No: 42/2026. Police Station: Vaishali Nagar, Jaipur. Date: 15 Feb 2026. Accident Date: 14 Feb 2026 at 22:30 hrs. Vehicle: Hyundai Creta RJ14AB4589. Nature: Road accident. No alcohol test conducted at scene. Driver taken to hospital immediately.",
    "analysis": {
        "category": "FIR",
        "confidence": 88,
        "brief": "FIR filed 15 Feb 2026 for accident on 14 Feb 2026. No BAC test conducted. This contradicts the insurer's Clause 4.2 exclusion claim.",
        "risk_signals": ["FIR confirms no BAC test", "FIR date matches accident date", "FIR weakens insurer's Clause 4.2 argument"],
        "entities": {"fir_no": "42/2026", "station": "Vaishali Nagar", "date": "14 Feb 2026"}
    },
    "confidence": 88,
    "uploaded_at": datetime.utcnow() - timedelta(days=6),
})

# AI Analysis for case1
ai_analysis_col.insert_one({
    "case_id": str(case1_id),
    "brief": "High-risk case. Insurer has rejected ₹12.5L claim citing Clause 4.2 (DUI exclusion), but FIR clearly shows no BAC test was conducted at the accident scene on 14 Feb 2026. This creates a strong counter-argument. Cross-document analysis reveals 3 critical contradictions between the policy, rejection letter, and FIR.",
    "timeline": [
        {"date": "15 Jan 2026", "event": "Policy issued by ABC General Insurance", "type": "policy"},
        {"date": "14 Feb 2026", "event": "Road accident at 22:30 hrs, Vaishali Nagar, Jaipur", "type": "incident"},
        {"date": "15 Feb 2026", "event": "FIR No. 42/2026 filed at Vaishali Nagar PS", "type": "legal"},
        {"date": "18 Feb 2026", "event": "Claim submitted by Rahul Sharma", "type": "claim"},
        {"date": "20 Feb 2026", "event": "Claim rejected citing Clause 4.2 (DUI exclusion)", "type": "rejection"},
        {"date": "10 Mar 2026", "event": "Consumer court notice issued to ABC Insurance", "type": "court"},
        {"date": "18 Jul 2026", "event": "Next hearing scheduled at Consumer Court", "type": "hearing"},
    ],
    "missing_docs": [
        "Hospital discharge summary",
        "BAC test report (or absence certificate from hospital)",
        "Surveyor assessment report",
        "Witness statements",
    ],
    "recommendations": [
        "Obtain hospital records confirming no BAC test was conducted — this directly nullifies Clause 4.2",
        "File RTI to get the full surveyor report from insurer",
        "Cite IRDAI Circular 2021/Motor/15 which mandates BAC proof before applying DUI exclusion",
        "Request court for interim direction to insurer to produce original survey report",
    ],
    "cross_doc": [
        {
            "type": "mismatch",
            "severity": "critical",
            "field": "DUI Evidence vs FIR",
            "doc1": "Claim Rejection Letter",
            "doc2": "FIR Copy",
            "doc1_value": "Claims driver was under influence (Clause 4.2)",
            "doc2_value": "FIR explicitly states no BAC test conducted at scene",
            "impact": "Insurer cannot invoke Clause 4.2 without clinical BAC proof — rejection may be legally invalid",
        },
        {
            "type": "mismatch",
            "severity": "high",
            "field": "Accident Date",
            "doc1": "Policy Document",
            "doc2": "Rejection Letter",
            "doc1_value": "Policy valid: 15 Jan 2026 to 14 Jan 2027",
            "doc2_value": "Accident date: 14 Feb 2026 — within valid period",
            "impact": "Accident occurred during active policy period — coverage cannot be denied on date grounds",
        },
        {
            "type": "match",
            "severity": "info",
            "field": "Vehicle Registration",
            "doc1": "Policy Document",
            "doc2": "FIR Copy",
            "doc1_value": "Hyundai Creta RJ14AB4589",
            "doc2_value": "Hyundai Creta RJ14AB4589",
            "impact": "Vehicle details match across all documents",
        },
    ],
    "risk_reason": "Insurer's rejection is based on unproven DUI allegation. FIR contradicts this. Case has strong merit for insured.",
    "confidence": 91,
    "created_at": datetime.utcnow() - timedelta(days=4),
})

# Notes for case1
notes_col.insert_many([
    {
        "case_id": str(case1_id),
        "author": "Anita Nair",
        "role": "Legal Ops Manager",
        "message": "Called panel surveyor — will send full assessment report by EOD tomorrow. Also confirmed hospital has no BAC test record.",
        "created_at": datetime.utcnow() - timedelta(hours=3),
    },
    {
        "case_id": str(case1_id),
        "author": "Vikram Singh",
        "role": "Senior Counsel",
        "message": "Filed written statement countering Clause 4.2. Attached FIR and hospital admission records. Insurer's position is weak without BAC evidence.",
        "created_at": datetime.utcnow() - timedelta(days=2),
    },
])
print(f"✓ Case 1: 3 documents, 1 AI analysis, 2 notes added")

# ── Case 2: Health Insurance ──────────────────────────────────────────────────
case2_id = ObjectId()
case2 = {
    "_id": case2_id,
    "title": "Priya Mehta vs. HealthFirst Insurance — Cashless Denial",
    "case_type": "Health",
    "stage": "IRDAI Grievance",
    "status": "Evidence Pending",
    "risk": "Medium",
    "health_score": 67,
    "money": "₹3,85,000",
    "party": "Priya Mehta",
    "next_hearing": "24 Jul 2026",
    "assigned_to": "Anita Nair",
    "description": "HealthFirst Insurance denied cashless hospitalization for emergency cardiac treatment at Apollo Hospital, Bangalore citing pre-existing condition exclusion. Patient was admitted as emergency.",
    "created_at": datetime.utcnow() - timedelta(days=8),
}
cases_col.insert_one(case2)
print(f"✓ Case 2 created: {case2_id}")

doc4_id = ObjectId()
documents_col.insert_one({
    "_id": doc4_id,
    "case_id": str(case2_id),
    "filename": "health_policy_priya.pdf",
    "category": "Policy",
    "text": "HealthFirst Insurance Health Policy. Insured: Priya Mehta. Sum Insured: ₹5,00,000. Policy No: HF-2025-HLTH-7842. Valid: 01 Apr 2025 to 31 Mar 2026. Waiting period for pre-existing conditions: 2 years from policy inception.",
    "analysis": {
        "category": "Policy",
        "confidence": 92,
        "brief": "Health insurance policy for Priya Mehta. Sum insured ₹5L. Pre-existing condition waiting period is 2 years from Apr 2025.",
        "risk_signals": ["Pre-existing condition clause requires careful examination", "2-year waiting period may be inapplicable for emergency"],
        "entities": {"insurer": "HealthFirst Insurance", "insured": "Priya Mehta", "policy_no": "HF-2025-HLTH-7842"}
    },
    "confidence": 92,
    "uploaded_at": datetime.utcnow() - timedelta(days=6),
})

doc5_id = ObjectId()
documents_col.insert_one({
    "_id": doc5_id,
    "case_id": str(case2_id),
    "filename": "cashless_denial_letter.pdf",
    "category": "Claim",
    "text": "Cashless Authorization Denial. HealthFirst Insurance. Date: 5 Mar 2026. Patient: Priya Mehta. Hospital: Apollo Hospital, Bangalore. Reason: Pre-existing cardiac condition (Hypertension) not covered within 2-year waiting period. Admitted: 4 Mar 2026.",
    "analysis": {
        "category": "Claim",
        "confidence": 87,
        "brief": "Cashless denial for emergency cardiac admission. Insurer cites pre-existing condition waiting period.",
        "risk_signals": ["Emergency hospitalization — IRDAI guidelines mandate cashless for emergencies", "Hypertension ≠ cardiac arrest in legal definition"],
        "entities": {"denial_date": "5 Mar 2026", "hospital": "Apollo Hospital Bangalore", "reason": "Pre-existing condition"}
    },
    "confidence": 87,
    "uploaded_at": datetime.utcnow() - timedelta(days=5),
})

ai_analysis_col.insert_one({
    "case_id": str(case2_id),
    "brief": "Medium-risk case. IRDAI Circular 2020/Health/09 explicitly mandates insurers to provide cashless authorization for emergency life-threatening conditions regardless of waiting period clauses. Priya Mehta's cardiac emergency at Apollo Hospital qualifies. Insurer's denial may be directly in violation of IRDAI regulations.",
    "timeline": [
        {"date": "01 Apr 2025", "event": "Health policy issued by HealthFirst Insurance", "type": "policy"},
        {"date": "04 Mar 2026", "event": "Emergency cardiac admission at Apollo Hospital, Bangalore", "type": "incident"},
        {"date": "05 Mar 2026", "event": "Cashless authorization denied by insurer", "type": "rejection"},
        {"date": "06 Mar 2026", "event": "Patient paid ₹3,85,000 out of pocket for treatment", "type": "payment"},
        {"date": "15 Mar 2026", "event": "Reimbursement claim filed with insurer", "type": "claim"},
        {"date": "01 Apr 2026", "event": "Reimbursement also rejected", "type": "rejection"},
        {"date": "10 Apr 2026", "event": "IRDAI grievance filed (Ref: IGC/2026/08741)", "type": "legal"},
        {"date": "24 Jul 2026", "event": "IRDAI grievance hearing scheduled", "type": "hearing"},
    ],
    "missing_docs": [
        "Cardiac specialist emergency certificate",
        "Apollo Hospital discharge summary with ICD codes",
        "Previous prescription records for hypertension (to establish it's different from cardiac arrest)",
        "IRDAI complaint acknowledgment",
    ],
    "recommendations": [
        "Cite IRDAI Circular 2020/Health/09 — emergency hospitalization must get cashless regardless of waiting period",
        "Obtain ICD-10 coding from Apollo Hospital — differentiate hypertension (I10) from acute cardiac event (I21)",
        "Medical expert certificate establishing emergency nature of admission",
        "File Consumer Court case parallel to IRDAI grievance for faster resolution",
    ],
    "cross_doc": [
        {
            "type": "mismatch",
            "severity": "critical",
            "field": "Emergency vs Pre-existing Clause",
            "doc1": "Health Policy",
            "doc2": "Cashless Denial Letter",
            "doc1_value": "2-year waiting period for pre-existing conditions",
            "doc2_value": "Applied waiting period to emergency cardiac admission",
            "impact": "IRDAI mandates cashless for emergencies — insurer's action violates regulation",
        },
        {
            "type": "mismatch",
            "severity": "high",
            "field": "Medical Condition Classification",
            "doc1": "Denial Letter",
            "doc2": "Hospital Records",
            "doc1_value": "Pre-existing hypertension",
            "doc2_value": "Acute Myocardial Infarction (Emergency)",
            "impact": "Hypertension and cardiac arrest are legally distinct conditions — pre-existing clause may not apply",
        },
    ],
    "risk_reason": "Strong IRDAI regulatory violation argument. Case likely to succeed at grievance level.",
    "confidence": 84,
    "created_at": datetime.utcnow() - timedelta(days=2),
})

notes_col.insert_many([
    {
        "case_id": str(case2_id),
        "author": "Anita Nair",
        "role": "Legal Ops Manager",
        "message": "Requested discharge summary from Apollo Hospital with ICD-10 coding. Expected by Monday.",
        "created_at": datetime.utcnow() - timedelta(hours=5),
    },
])
print(f"✓ Case 2: 2 documents, 1 AI analysis, 1 note added")

print("\n✅ Demo seed complete!")
print(f"   Case 1 ID: {case1_id} (Motor - High Risk)")
print(f"   Case 2 ID: {case2_id} (Health - Medium Risk)")
print(f"\n   Frontend URL for Case 1: http://localhost:8080/cases/{case1_id}")
print(f"   Frontend URL for Case 2: http://localhost:8080/cases/{case2_id}")

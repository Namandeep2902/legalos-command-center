export type Priority = "HIGH" | "MEDIUM" | "LOW";
export type Risk = "High" | "Medium" | "Low";

export const overviewStats = [
  { label: "Total Active Cases", value: 248, delta: "+12 this week", tone: "info" as const },
  { label: "High Risk Cases", value: 18, delta: "+3 vs last week", tone: "destructive" as const },
  { label: "Upcoming Hearings", value: 12, delta: "Next in 2 days", tone: "warning" as const },
  { label: "Pending Actions", value: 34, delta: "8 due today", tone: "primary" as const },
  { label: "Avg Case Health", value: "76/100", delta: "↑ 4 from last week", tone: "success" as const },
  { label: "AI Insights Today", value: 14, delta: "6 high-risk flagged", tone: "info" as const },
];

export const aiInsights = [
  { text: "AI detected 6 high-risk cases requiring immediate attention today.", icon: "alert" as const },
  { text: "12 cases have missing evidence that could impact upcoming hearings.", icon: "evidence" as const },
  { text: "3 hearings are due in the next 48 hours — preparation incomplete.", icon: "hearing" as const },
  { text: "Cross-Document Intelligence found 8 mismatches across 4 cases.", icon: "mismatch" as const },
];

export const priorityCases = [
  {
    id: "10245",
    title: "Motor Insurance Claim Dispute",
    riskScore: 92,
    reason: "Hearing tomorrow · FIR missing · Claim > ₹42L",
    amount: "₹42,80,000",
  },
  {
    id: "6650",
    title: "Third Party Liability Claim",
    riskScore: 87,
    reason: "High Court case · Missing evidence · ₹65L exposure",
    amount: "₹65,00,000",
  },
  {
    id: "8932",
    title: "Vehicle Damage Claim",
    riskScore: 78,
    reason: "Survey report missing · Pre-litigation stage",
    amount: "₹8,40,000",
  },
];

export const priorityActions = [
  {
    id: "a1",
    title: "Consumer Court Hearing Tomorrow",
    caseNo: "Case #10245",
    caseTitle: "Motor Insurance Claim",
    action: "Review missing evidence",
    priority: "HIGH" as Priority,
    due: "Tomorrow, 10:30 AM",
  },
  {
    id: "a2",
    title: "Survey Report Missing",
    caseNo: "Case #8932",
    caseTitle: "Vehicle Damage Claim",
    action: "Upload survey report",
    priority: "HIGH" as Priority,
    due: "Due today",
  },
  {
    id: "a3",
    title: "Legal Notice Response Due",
    caseNo: "Case #9821",
    caseTitle: "Health Insurance Dispute",
    action: "Draft response",
    priority: "MEDIUM" as Priority,
    due: "3 days remaining",
  },
  {
    id: "a4",
    title: "Policy Clause Review Requested",
    caseNo: "Case #7712",
    caseTitle: "Policy Coverage Dispute",
    action: "Verify clause 4.2 applicability",
    priority: "MEDIUM" as Priority,
    due: "5 days remaining",
  },
];

export const riskDistribution = [
  { level: "High" as Risk, count: 18, color: "var(--destructive)" },
  { level: "Medium" as Risk, count: 76, color: "var(--warning)" },
  { level: "Low" as Risk, count: 154, color: "var(--success)" },
];

export const caseloadTrend = [
  { month: "Feb", opened: 32, closed: 24 },
  { month: "Mar", opened: 41, closed: 28 },
  { month: "Apr", opened: 38, closed: 35 },
  { month: "May", opened: 49, closed: 40 },
  { month: "Jun", opened: 44, closed: 47 },
  { month: "Jul", opened: 52, closed: 39 },
];

export const casesList = [
  {
    id: "10245",
    title: "Motor Insurance Claim Dispute",
    party: "Rajesh Sharma",
    type: "Motor Insurance Claim",
    stage: "Consumer Court",
    risk: "High" as Risk,
    riskScore: 87,
    amount: "₹42,80,000",
    hearing: "12 Aug 2026",
    status: "Under Review",
  },
  {
    id: "8932",
    title: "Vehicle Damage Claim",
    party: "Priya Malhotra",
    type: "Motor Insurance Claim",
    stage: "Pre-Litigation",
    risk: "High" as Risk,
    riskScore: 78,
    amount: "₹8,40,000",
    hearing: "18 Aug 2026",
    status: "Evidence Pending",
  },
  {
    id: "9821",
    title: "Cashless Treatment Denial",
    party: "Amit Verma",
    type: "Health Insurance Dispute",
    stage: "Notice Stage",
    risk: "Medium" as Risk,
    riskScore: 54,
    amount: "₹3,20,000",
    hearing: "24 Aug 2026",
    status: "Response Due",
  },
  {
    id: "7712",
    title: "Fire Damage Coverage Dispute",
    party: "Sunrise Textiles Pvt Ltd",
    type: "Policy Coverage Dispute",
    stage: "District Court",
    risk: "Medium" as Risk,
    riskScore: 61,
    amount: "₹1,25,00,000",
    hearing: "02 Sep 2026",
    status: "Under Review",
  },
  {
    id: "6650",
    title: "Third Party Liability Claim",
    party: "Mohammed Iqbal",
    type: "Motor Insurance Claim",
    stage: "High Court",
    risk: "High" as Risk,
    riskScore: 82,
    amount: "₹65,00,000",
    hearing: "10 Aug 2026",
    status: "Under Review",
  },
  {
    id: "5521",
    title: "Mediclaim Reimbursement",
    party: "Kavita Iyer",
    type: "Health Insurance Dispute",
    stage: "Consumer Court",
    risk: "Low" as Risk,
    riskScore: 32,
    amount: "₹1,80,000",
    hearing: "28 Aug 2026",
    status: "Ready",
  },
];

export const inboxDocuments = [
  {
    id: "d1",
    name: "legal_notice_motor_claim.pdf",
    type: "Consumer Complaint",
    source: "Email",
    uploaded: "Today, 09:42",
    status: "Processed",
    confidence: 97,
    caseCreated: "Case #10245",
  },
  {
    id: "d2",
    name: "survey_report_scan.pdf",
    type: "Survey Report",
    source: "PDF Upload",
    uploaded: "Today, 08:15",
    status: "Processing",
    confidence: 84,
    caseCreated: "Case #8932",
  },
  {
    id: "d3",
    name: "policy_document_health.pdf",
    type: "Policy Copy",
    source: "API",
    uploaded: "Yesterday",
    status: "Processed",
    confidence: 99,
    caseCreated: "Case #9821",
  },
  {
    id: "d4",
    name: "court_summons_dc.pdf",
    type: "Court Notice",
    source: "Scan",
    uploaded: "Yesterday",
    status: "Processed",
    confidence: 92,
    caseCreated: "Case #7712",
  },
  {
    id: "d5",
    name: "email_attachment_fir.jpg",
    type: "FIR (Scanned)",
    source: "Email",
    uploaded: "2 days ago",
    status: "Failed",
    confidence: 0,
    caseCreated: "—",
  },
  {
    id: "d6",
    name: "claim_form_priya.pdf",
    type: "Claim Form",
    source: "PDF Upload",
    uploaded: "2 days ago",
    status: "Processed",
    confidence: 95,
    caseCreated: "Case #8932",
  },
  {
    id: "d7",
    name: "medical_report_verma.pdf",
    type: "Medical Report",
    source: "Email",
    uploaded: "3 days ago",
    status: "Processed",
    confidence: 91,
    caseCreated: "Case #9821",
  },
];

export const caseTimeline = [
  {
    date: "12 Jan 2024",
    event: "Policy Purchased",
    detail: "Comprehensive motor policy issued for ₹8L IDV",
    impact: "Baseline coverage established for accident claims.",
    tone: "neutral" as const,
  },
  {
    date: "04 Mar 2026",
    event: "Accident Reported",
    detail: "Insured party filed accident intimation via helpline",
    impact: "Claim window opened; investigation triggered.",
    tone: "neutral" as const,
  },
  {
    date: "12 Mar 2026",
    event: "Claim Raised",
    detail: "Formal claim submitted with damage estimates",
    impact: "Documentation trail begins; verify claim form fields.",
    tone: "info" as const,
  },
  {
    date: "28 Mar 2026",
    event: "Claim Rejected",
    detail: "Rejection cited under exclusion clause 4.2",
    impact:
      "Litigation risk increased because rejection reason documentation is incomplete.",
    tone: "destructive" as const,
  },
  {
    date: "14 Apr 2026",
    event: "Legal Notice Received",
    detail: "Notice sent by claimant's counsel seeking ₹42.8L",
    impact: "Amount conflict detected vs original claim form (₹38L).",
    tone: "warning" as const,
  },
  {
    date: "02 Jun 2026",
    event: "Court Filing",
    detail: "Consumer complaint filed at District Consumer Court",
    impact: "Formal proceedings initiated; response window active.",
    tone: "warning" as const,
  },
  {
    date: "12 Aug 2026",
    event: "Next Hearing",
    detail: "Consumer Court, Bench II — 10:30 AM",
    impact: "Prepare survey report and clause interpretation before appearance.",
    tone: "info" as const,
  },
];

export const evidenceItems = [
  { name: "Policy Copy", status: "Completed", importance: "High" },
  { name: "Claim Form", status: "Completed", importance: "High" },
  { name: "FIR", status: "Missing", importance: "Critical" },
  { name: "Survey Report", status: "Missing", importance: "Critical" },
  { name: "Medical Report", status: "Available", importance: "Medium" },
  { name: "Vehicle Registration", status: "Completed", importance: "High" },
  { name: "Driver License", status: "Available", importance: "Medium" },
  { name: "Repair Invoices", status: "Partial", importance: "Medium" },
] as const;

export const documentIntelligenceAlerts = [
  {
    severity: "high" as const,
    title: "Date Mismatch",
    detail:
      "Accident date on Claim Form (12 March) conflicts with Legal Notice (14 March).",
    docs: ["Claim Form", "Legal Notice"],
  },
  {
    severity: "high" as const,
    title: "Claim Amount Conflict",
    detail:
      "Claim Form states ₹38,00,000 while Legal Notice demands ₹42,80,000. 12.6% variance.",
    docs: ["Claim Form", "Legal Notice"],
  },
  {
    severity: "medium" as const,
    title: "Missing Referenced Document",
    detail:
      "Legal Notice references a Survey Report from 22 March — document not present in case file.",
    docs: ["Legal Notice"],
  },
  {
    severity: "low" as const,
    title: "Policy Clause Reference",
    detail:
      "Rejection cites clause 4.2 (exclusions). Clause language ambiguous on third-party liability.",
    docs: ["Policy", "Rejection Letter"],
  },
];

export const recommendations = [
  {
    id: "r1",
    title: "Collect Survey Report",
    reason: "Required evidence missing before hearing on 12 Aug.",
    priority: "HIGH" as Priority,
    confidence: 92,
  },
  {
    id: "r2",
    title: "Review Policy Clause 4.2",
    reason: "Claim rejection cites exclusion clause with ambiguous scope.",
    priority: "HIGH" as Priority,
    confidence: 89,
  },
  {
    id: "r3",
    title: "Reconcile Claim Amount",
    reason: "12.6% variance between claim form and legal notice requires clarification.",
    priority: "MEDIUM" as Priority,
    confidence: 84,
  },
  {
    id: "r4",
    title: "Prepare Response Bundle",
    reason: "Compile chronological document set for counsel briefing.",
    priority: "MEDIUM" as Priority,
    confidence: 78,
  },
];

/* ─────────────────────────────────────────────────────────
   ⭐ CROSS-DOCUMENT INTELLIGENCE — Hero Feature
   ───────────────────────────────────────────────────────── */

export interface CrossDocComparison {
  id: string;
  field: string;
  severity: "critical" | "high" | "medium" | "low";
  documents: {
    name: string;
    value: string;
    icon: string;
  }[];
  analysis: string;
  impact: string;
  recommendation: string;
}

export const crossDocComparisons: CrossDocComparison[] = [
  {
    id: "cdi-1",
    field: "Accident Date",
    severity: "critical",
    documents: [
      { name: "FIR", value: "12 January 2026", icon: "📄" },
      { name: "Claim Form", value: "13 January 2026", icon: "📋" },
      { name: "Medical Report", value: "12 January 2026", icon: "🏥" },
    ],
    analysis: "Date discrepancy of 1 day between FIR and Claim Form. Medical Report corroborates FIR date. Claim Form may contain a data entry error or deliberate alteration.",
    impact: "Opposing counsel could challenge claim credibility based on date inconsistency. Weakens position in consumer court.",
    recommendation: "Request amended claim form from policyholder with correct date matching FIR record.",
  },
  {
    id: "cdi-2",
    field: "Coverage Applicability",
    severity: "critical",
    documents: [
      { name: "Policy Document", value: "Flood Damage: NOT COVERED (Exclusion §4.2)", icon: "📑" },
      { name: "Claim Form", value: "Cause: Flood Damage to Vehicle", icon: "📋" },
      { name: "Survey Report", value: "Cause: Water logging + structural impact", icon: "🔍" },
    ],
    analysis: "Direct conflict — Policy explicitly excludes flood damage under clause 4.2, but claim is filed for flood damage. Survey report uses ambiguous phrasing 'water logging + structural impact' which could be argued either way.",
    impact: "This is the core legal issue. If court interprets 'water logging' differently from 'flood', the exclusion clause may not apply. Exposure: ₹42.8L.",
    recommendation: "Prepare legal brief on distinction between 'flood' and 'water logging' in insurance law. Reference NCDRC/2022/RP/1187 precedent.",
  },
  {
    id: "cdi-3",
    field: "Claim Amount",
    severity: "high",
    documents: [
      { name: "Claim Form", value: "₹38,00,000", icon: "📋" },
      { name: "Legal Notice", value: "₹42,80,000", icon: "⚖️" },
      { name: "Repair Invoice", value: "₹35,60,000", icon: "🧾" },
    ],
    analysis: "Three different amounts across three documents. Legal notice demands 12.6% more than claim form. Repair invoice is 6.3% less than claim form. Indicates potential inflation from claim to legal notice stage.",
    impact: "Amount inflation pattern suggests opportunistic escalation. Can be used defensively to question claim authenticity.",
    recommendation: "Create comparison table for court submission highlighting amount escalation across documents.",
  },
  {
    id: "cdi-4",
    field: "Vehicle Speed at Accident",
    severity: "high",
    documents: [
      { name: "Survey Report", value: "Estimated speed: 60 km/h", icon: "🔍" },
      { name: "FIR (Police Report)", value: "Reported speed: 85 km/h", icon: "📄" },
      { name: "Witness Statement", value: "Approximate speed: 70–80 km/h", icon: "👤" },
    ],
    analysis: "Survey report estimates significantly lower speed than police report and witness statement. Possible surveyor underestimation to minimize insurer liability, or police overestimation.",
    impact: "Speed discrepancy affects negligence assessment. If insured was speeding (>80 km/h in zone), it could invoke contributory negligence defense.",
    recommendation: "Commission independent accident reconstruction expert to determine actual speed from damage pattern.",
  },
  {
    id: "cdi-5",
    field: "Driver Identity",
    severity: "medium",
    documents: [
      { name: "Claim Form", value: "Driver: Rajesh Sharma (Policyholder)", icon: "📋" },
      { name: "FIR", value: "Driver: Suresh Kumar (Employee)", icon: "📄" },
    ],
    analysis: "Claim form states the policyholder was driving, but the FIR names a different individual as the driver. This is a significant discrepancy that could indicate policy violation if the named driver was not authorized.",
    impact: "If unauthorized driver, entire claim may be void under standard motor policy terms. Major defense point.",
    recommendation: "Verify driver authorization under policy terms. Cross-check with driver license records submitted.",
  },
  {
    id: "cdi-6",
    field: "Hospital Admission Time",
    severity: "medium",
    documents: [
      { name: "Medical Report", value: "Admitted: 12 Jan, 3:45 PM", icon: "🏥" },
      { name: "FIR", value: "Accident time: 12 Jan, 6:30 PM", icon: "📄" },
    ],
    analysis: "Medical report shows hospital admission 2 hours 45 minutes BEFORE the FIR-recorded accident time. This is a chronological impossibility if both documents refer to the same incident.",
    impact: "Strongest inconsistency — direct evidence of timeline fabrication or incorrect FIR timing. Could invalidate the entire claim narrative.",
    recommendation: "Subpoena hospital CCTV and admission register to establish actual admission time. File objection citing temporal impossibility.",
  },
  {
    id: "cdi-7",
    field: "Vehicle Registration",
    severity: "low",
    documents: [
      { name: "Policy Document", value: "Registration: MH-02-AB-1234", icon: "📑" },
      { name: "FIR", value: "Registration: MH-02-AB-1234", icon: "📄" },
      { name: "Survey Report", value: "Registration: MH-02-AB-1234", icon: "🔍" },
    ],
    analysis: "Vehicle registration number is consistent across all documents. No discrepancy found.",
    impact: "Positive finding — vehicle identity is established beyond dispute.",
    recommendation: "No action required. Mark as verified in evidence checklist.",
  },
];

export const crossDocSummary = {
  documentsAnalyzed: 8,
  comparisonsPerformed: 42,
  inconsistenciesFound: 6,
  criticalFindings: 2,
  highFindings: 2,
  mediumFindings: 2,
  lowFindings: 1,
  overallRisk: "High" as Risk,
  lastAnalyzed: "2 minutes ago",
};

/* ─────────── Team Members ─────────── */

export const teamMembers = [
  { name: "Anita Nair", role: "Legal Ops Manager", initials: "AN", status: "Lead" },
  { name: "Vikram Sethi", role: "Senior Counsel", initials: "VS", status: "Active" },
  { name: "Priya Rao", role: "Paralegal", initials: "PR", status: "Active" },
  { name: "Rahul Mehra", role: "Claims Officer", initials: "RM", status: "Active" },
  { name: "Deepak Joshi", role: "External Lawyer", initials: "DJ", status: "On Retainer" },
];

/* ─────────── Reports Data ─────────── */

export const caseDistribution = [
  { category: "Motor Insurance", count: 98, color: "var(--primary)" },
  { category: "Health Insurance", count: 72, color: "var(--info)" },
  { category: "Property", count: 44, color: "var(--warning)" },
  { category: "Life Insurance", count: 22, color: "var(--success)" },
  { category: "Other", count: 12, color: "var(--muted-foreground)" },
];

export const evidenceCompletionData = [
  { month: "Feb", completion: 71 },
  { month: "Mar", completion: 74 },
  { month: "Apr", completion: 78 },
  { month: "May", completion: 76 },
  { month: "Jun", completion: 82 },
  { month: "Jul", completion: 86 },
];

export const resolutionTimeData = [
  { month: "Feb", days: 142 },
  { month: "Mar", days: 138 },
  { month: "Apr", days: 125 },
  { month: "May", days: 118 },
  { month: "Jun", days: 112 },
  { month: "Jul", days: 105 },
];

export const departmentPerformance = [
  { department: "Motor Claims", resolved: 45, pending: 53, score: 82 },
  { department: "Health Claims", resolved: 38, pending: 34, score: 78 },
  { department: "Property Claims", resolved: 22, pending: 22, score: 75 },
  { department: "Life Insurance", resolved: 18, pending: 4, score: 91 },
];

export const winLossData = [
  { outcome: "Won", count: 68, color: "var(--success)" },
  { outcome: "Settled", count: 42, color: "var(--info)" },
  { outcome: "Lost", count: 14, color: "var(--destructive)" },
  { outcome: "Ongoing", count: 124, color: "var(--warning)" },
];

/* ─────────── Settings Data ─────────── */

export const settingsUsers = [
  { name: "Anita Nair", email: "anita.nair@novainsurance.in", role: "Admin", status: "Active", lastActive: "Now" },
  { name: "Vikram Sethi", email: "vikram.sethi@novainsurance.in", role: "Counsel", status: "Active", lastActive: "2h ago" },
  { name: "Priya Rao", email: "priya.rao@novainsurance.in", role: "Analyst", status: "Active", lastActive: "1h ago" },
  { name: "Rahul Mehra", email: "rahul.mehra@novainsurance.in", role: "Claims", status: "Active", lastActive: "30m ago" },
  { name: "Deepak Joshi", email: "deepak@joshilaw.in", role: "External", status: "Active", lastActive: "Yesterday" },
  { name: "Sneha Kapoor", email: "sneha.kapoor@novainsurance.in", role: "Analyst", status: "Invited", lastActive: "—" },
];

export const settingsIntegrations = [
  { name: "Microsoft Outlook", desc: "Email ingestion & notifications", status: "Connected", icon: "📧" },
  { name: "Google Drive", desc: "Document sync & backup", status: "Connected", icon: "📁" },
  { name: "CoreClaim CRM", desc: "Claims management system", status: "Connected", icon: "🔗" },
  { name: "DigiLocker", desc: "Government document verification", status: "Available", icon: "🏛️" },
  { name: "WhatsApp Business", desc: "Client communication", status: "Available", icon: "💬" },
];

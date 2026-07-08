export type Priority = "HIGH" | "MEDIUM" | "LOW";
export type Risk = "High" | "Medium" | "Low";

export const overviewStats = [
  { label: "Total Active Cases", value: 248, delta: "+12 this week", tone: "info" as const },
  { label: "High Risk Cases", value: 18, delta: "+3 vs last week", tone: "destructive" as const },
  { label: "Upcoming Hearings", value: 12, delta: "Next in 2 days", tone: "warning" as const },
  { label: "Pending Actions", value: 34, delta: "8 due today", tone: "primary" as const },
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
    uploaded: "Today, 09:42",
    status: "Processed",
    caseCreated: "Case #10245",
  },
  {
    id: "d2",
    name: "survey_report_scan.pdf",
    type: "Survey Report",
    uploaded: "Today, 08:15",
    status: "Processing",
    caseCreated: "Case #8932",
  },
  {
    id: "d3",
    name: "policy_document_health.pdf",
    type: "Policy Copy",
    uploaded: "Yesterday",
    status: "Processed",
    caseCreated: "Case #9821",
  },
  {
    id: "d4",
    name: "court_summons_dc.pdf",
    type: "Court Notice",
    uploaded: "Yesterday",
    status: "Processed",
    caseCreated: "Case #7712",
  },
  {
    id: "d5",
    name: "email_attachment_fir.jpg",
    type: "FIR (Scanned)",
    uploaded: "2 days ago",
    status: "Failed",
    caseCreated: "—",
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

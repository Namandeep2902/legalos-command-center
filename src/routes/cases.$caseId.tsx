import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowLeft,
  Sparkles,
  Gavel,
  IndianRupee,
  Calendar,
  User,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  FileText,
  Circle,
  ChevronRight,
  ShieldAlert,
  Check,
  X,
  Pencil,
  MessageSquare,
  Download,
  Share2,
  GitCompare,
  Zap,
  Eye,
  Users,
  TrendingDown,
  Scale,
  Search,
  ArrowRight,
} from "lucide-react";
import { RiskBadge, PriorityBadge, StatusPill } from "@/components/legal/RiskBadge";
import {
  caseTimeline,
  evidenceItems,
  documentIntelligenceAlerts,
  recommendations,
  crossDocComparisons,
  crossDocSummary,
  teamMembers,
} from "@/lib/mock-data";
import { getCase, getCaseDocuments, getCaseAnalysis, getCaseNotes, addCaseNote } from "@/lib/api";
import { cn } from "@/lib/utils";
import { demo, demoOk, demoWarn } from "@/lib/demo-actions";

export const Route = createFileRoute("/cases/$caseId")({
  component: CaseWorkspace,
});

const TABS = [
  "Overview",
  "Documents",
  "Timeline",
  "Evidence",
  "Cross-Doc Intel",
  "AI Insights",
  "Notes",
] as const;
type Tab = (typeof TABS)[number];

function CaseWorkspace() {
  const { caseId } = Route.useParams();
  const [tab, setTab] = useState<Tab>("Overview");
  
  // Dynamic State
  const [caseObj, setCaseObj] = useState<any>(null);
  const [documents, setDocuments] = useState<any[]>([]);
  const [analysis, setAnalysis] = useState<any>(null);
  const [notes, setNotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadAllData = async () => {
    setLoading(true);
    const [c, docs, ana, nts] = await Promise.all([
      getCase(caseId),
      getCaseDocuments(caseId),
      getCaseAnalysis(caseId),
      getCaseNotes(caseId)
    ]);
    setCaseObj(c);
    setDocuments(docs);
    setAnalysis(ana);
    setNotes(nts);
    setLoading(false);
  };

  useEffect(() => {
    loadAllData();
  }, [caseId]);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <span className="text-sm font-semibold text-muted-foreground">Loading case workspace...</span>
      </div>
    );
  }

  const riskValue = caseObj?.risk || "High";
  const healthScore = caseObj?.health_score || 81;
  const claimValue = caseObj?.money || caseObj?.amount || "₹42,80,000";

  return (
    <div className="mx-auto max-w-[1600px] p-4 md:p-8">
      {/* Back link */}
      <Link
        to="/cases"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground mb-4"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to Cases
      </Link>

      {/* Case header */}
      <div className="card-elevated overflow-hidden">
        <div className="p-6 border-b border-border">
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_auto] gap-4">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                  Case #{caseId}
                </span>
                <StatusPill status={caseObj?.status || "Under Review"} tone="warning" />
                <RiskBadge risk={riskValue} />
                <span className="text-xs text-muted-foreground">
                  Risk score: <span className="font-bold text-foreground">{healthScore + 6}</span>/100
                </span>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground text-balance">
                {caseObj?.title || "Motor Insurance Claim Dispute"}
              </h1>
              <p className="mt-1.5 text-sm text-muted-foreground">
                {caseObj?.case_type === "Health" 
                  ? "Health insurance dispute regarding cashless treatment denial." 
                  : "Consumer complaint filed against rejection of comprehensive motor claim."}
              </p>
            </div>
            <div className="flex items-start gap-2 shrink-0">
              <button
                onClick={() => demoOk("Case link copied", "Shareable link with view-only access has been copied.")}
                className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-border bg-background px-3 text-sm font-medium hover:bg-secondary"
              >
                <Share2 className="h-4 w-4" /> Share
              </button>
              <button
                onClick={() => demo("Preparing case export…", "PDF bundle with documents, timeline, and AI insights.")}
                className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-border bg-background px-3 text-sm font-medium hover:bg-secondary"
              >
                <Download className="h-4 w-4" /> Export
              </button>
              <button
                onClick={() => demoOk("Ask AI", "Nova Legal LLM opened for this case.")}
                className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-primary px-3.5 text-sm font-semibold text-primary-foreground hover:opacity-90"
              >
                <Sparkles className="h-4 w-4" /> Ask AI
              </button>
            </div>
          </div>
        </div>

        {/* Summary strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-border">
          <SummaryCell
            icon={<IndianRupee className="h-4 w-4" />}
            label="Claim Amount"
            value={claimValue}
          />
          <SummaryCell
            icon={<Gavel className="h-4 w-4" />}
            label="Current Stage"
            value={caseObj?.stage || "Consumer Court"}
            hint="Active Proceedings"
          />
          <SummaryCell
            icon={<Calendar className="h-4 w-4" />}
            label="Next Hearing"
            value={caseObj?.next_hearing || "Not Scheduled"}
            hint="Scheduled"
            tone="warning"
          />
          <SummaryCell
            icon={<User className="h-4 w-4" />}
            label="Opposing Party"
            value={caseObj?.party || "Rajesh Sharma"}
            hint="Counsel Represented"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-6 flex flex-wrap items-center gap-1 border-b border-border">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              "relative px-4 py-2.5 text-sm font-semibold transition-colors",
              tab === t
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground",
              t === "Cross-Doc Intel" && "flex items-center gap-1.5",
            )}
          >
            {t === "Cross-Doc Intel" && <GitCompare className="h-3.5 w-3.5" />}
            {t}
            {t === "Cross-Doc Intel" && (
              <span className="ml-1 rounded-full bg-destructive px-1.5 py-0.5 text-[9px] font-bold text-destructive-foreground">
                {analysis?.cross_doc?.length || 6}
              </span>
            )}
            {tab === t && (
              <span className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-primary" />
            )}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {tab === "Overview" && <OverviewTab caseObj={caseObj} analysis={analysis} />}
        {tab === "Documents" && <DocumentsTab caseId={caseId} documents={documents} />}
        {tab === "Timeline" && <TimelineTab analysis={analysis} />}
        {tab === "Evidence" && <EvidenceTab caseObj={caseObj} />}
        {tab === "Cross-Doc Intel" && <CrossDocIntelTab analysis={analysis} />}
        {tab === "AI Insights" && <InsightsTab analysis={analysis} />}
        {tab === "Notes" && <NotesTab caseId={caseId} notes={notes} onNoteAdded={loadAllData} />}
      </div>
    </div>
  );
}

function SummaryCell({
  icon,
  label,
  value,
  hint,
  tone,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  hint?: string;
  tone?: "warning" | "destructive";
}) {
  return (
    <div className="p-5">
      <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        <span className="text-muted-foreground/70">{icon}</span>
        {label}
      </div>
      <div
        className={cn(
          "mt-1.5 text-lg font-bold tabular-nums",
          tone === "warning" && "text-warning",
          tone === "destructive" && "text-destructive",
        )}
      >
        {value}
      </div>
      {hint && <div className="text-[11px] text-muted-foreground mt-0.5">{hint}</div>}
    </div>
  );
}

/* ─────────── Overview ─────────── */
function OverviewTab({ caseObj, analysis }: { caseObj: any; analysis: any }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] gap-6">
      <div className="space-y-6">
        {/* AI Case Intelligence */}
        <div className="rounded-xl border border-primary/15 bg-gradient-to-br from-primary/5 via-background to-background p-6 shadow-sm">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
                <Sparkles className="h-4 w-4" />
              </div>
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-widest text-primary">
                  Case Intelligence
                </div>
                <div className="text-base font-bold">30-Second Case Understanding</div>
              </div>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-success/30 bg-success/10 px-2.5 py-0.5 text-[11px] font-semibold text-success">
              <CheckCircle2 className="h-3 w-3" />
              {analysis?.confidence || 91}% confidence
            </span>
          </div>

          <dl className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 text-sm">
            <div>
              <dt className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Case Type
              </dt>
              <dd className="mt-1 font-semibold text-foreground">
                {caseObj?.case_type || "Motor Insurance Claim"}
              </dd>
            </div>
            <div>
              <dt className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Core Issue
              </dt>
              <dd className="mt-1 font-semibold text-foreground">
                {caseObj?.case_type === "Health" ? "Cashless denial challenge" : "Claim rejection dispute after accident"}
              </dd>
            </div>
            <div className="md:col-span-2">
              <dt className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                AI Summary
              </dt>
              <dd className="mt-1 text-foreground leading-relaxed">
                {analysis?.brief || "Policyholder has filed a consumer complaint after claim rejection under exclusion clause 4.2. Survey report referenced in the legal notice is missing from the case file, and a district consumer court hearing is scheduled in 5 days."}
              </dd>
            </div>
            <div className="md:col-span-2">
              <dt className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Recommended Operational Action
              </dt>
              <dd className="mt-1 rounded-lg border border-accent/25 bg-accent/10 px-3 py-2.5 text-foreground">
                {analysis?.recommendations?.[0]?.reason || "Collect the survey report from the panel surveyor and validate rejection reasoning against clause 4.2 wording before the next hearing."}
              </dd>
            </div>
          </dl>
        </div>

        {/* Cross-Doc Intel Teaser */}
        <div className="rounded-xl border-2 border-dashed border-destructive/30 bg-destructive/5 p-5">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-destructive text-destructive-foreground">
                <GitCompare className="h-4.5 w-4.5" />
              </div>
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-widest text-destructive">
                  Cross-Document Intelligence Alert
                </div>
                <div className="text-base font-bold text-foreground">
                  {analysis?.cross_doc?.length || 6} inconsistencies detected across {documents?.length || 8} documents
                </div>
              </div>
            </div>
            <span className="inline-flex items-center gap-1 rounded-full bg-destructive px-2.5 py-0.5 text-[10px] font-bold text-destructive-foreground uppercase tracking-wider">
              {analysis?.cross_doc?.filter((c: any) => c.severity === "critical").length || 2} Critical
            </span>
          </div>
          <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-2">
            {[
              { label: "Date Mismatch", severity: "critical" },
              { label: "Coverage Conflict", severity: "critical" },
              { label: "Amount Inflation", severity: "high" },
            ].map((f) => (
              <div key={f.label} className="flex items-center gap-2 rounded-md bg-background border border-border px-3 py-2">
                <AlertTriangle className={cn("h-3.5 w-3.5 shrink-0", f.severity === "critical" ? "text-destructive" : "text-warning")} />
                <span className="text-xs font-medium text-foreground">{f.label}</span>
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            AI compared all case documents side-by-side and found contradictions that may impact your legal position.
          </p>
        </div>

        {/* Recommendations */}
        <RecommendationsCard />
      </div>

      {/* Right column */}
      <div className="space-y-6">
        <CaseHealthCard score={caseObj?.health_score || 81} />
        <ExposureCard />
        <TeamCard />
        <ApprovalCard />
      </div>
    </div>
  );
}

/* ─────────── Case Health Score ─────────── */
function CaseHealthCard({ score = 81 }: { score?: number }) {
  const items = [
    { label: "Policy Copy", ok: true },
    { label: "Claim Form", ok: true },
    { label: "FIR", ok: false },
    { label: "Survey Report", ok: false },
    { label: "Medical Report", ok: true },
    { label: "Hearing Prep", ok: false },
  ];
  const breakdown = [
    { label: "Documents Available", value: 80 },
    { label: "Evidence Completeness", value: 60 },
    { label: "Deadline Readiness", value: 70 },
  ];

  return (
    <div className="card-elevated p-6">
      <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        Case Health Score
      </div>

      <div className="mt-4 flex items-center gap-5">
        <ScoreRing score={score} />
        <div>
          <div className="text-2xl font-bold text-foreground">Almost ready</div>
          <div className="text-xs text-muted-foreground mt-0.5">
            Close 2 evidence gaps to reach hearing-ready status.
          </div>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-2">
        {items.map((item) => (
          <div key={item.label} className="flex items-center gap-2 text-xs">
            {item.ok ? (
              <CheckCircle2 className="h-3.5 w-3.5 text-success shrink-0" />
            ) : (
              <XCircle className="h-3.5 w-3.5 text-destructive shrink-0" />
            )}
            <span className={item.ok ? "text-foreground" : "text-destructive font-medium"}>
              {item.label}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-5 space-y-3">
        {breakdown.map((b) => (
          <div key={b.label}>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground font-medium">{b.label}</span>
              <span className="font-semibold text-foreground tabular-nums">
                {b.value}%
              </span>
            </div>
            <div className="mt-1.5 h-1.5 rounded-full bg-secondary overflow-hidden">
              <div
                className={cn(
                  "h-full rounded-full transition-all",
                  b.value >= 75
                    ? "bg-success"
                    : b.value >= 60
                      ? "bg-warning"
                      : "bg-destructive",
                )}
                style={{ width: `${b.value}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─────────── Exposure Card ─────────── */
function ExposureCard() {
  return (
    <div className="card-elevated p-6 hero-gradient text-primary-foreground">
      <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-widest text-accent">
        <TrendingDown className="h-3.5 w-3.5" />
        Financial Exposure
      </div>
      <div className="mt-3 text-3xl font-bold tabular-nums">₹42.8L</div>
      <div className="text-xs text-primary-foreground/70 mt-1">
        Potential financial exposure at current stage
      </div>
      <div className="mt-4 space-y-2">
        <div className="flex justify-between text-xs">
          <span className="text-primary-foreground/70">Claim Amount</span>
          <span className="font-semibold">₹42,80,000</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-primary-foreground/70">Legal Costs (est.)</span>
          <span className="font-semibold">₹3,50,000</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-primary-foreground/70">Penalty Risk</span>
          <span className="font-semibold">₹2,14,000</span>
        </div>
        <div className="border-t border-white/15 pt-2 flex justify-between text-xs">
          <span className="text-primary-foreground/70 font-semibold">Total Exposure</span>
          <span className="font-bold text-accent">₹48,44,000</span>
        </div>
      </div>
      <div className="mt-4 rounded-md bg-white/10 px-3 py-2 text-[11px]">
        <span className="font-semibold text-accent">Stage:</span>{" "}
        <span className="text-primary-foreground/90">District Consumer Court · First Hearing</span>
      </div>
    </div>
  );
}

/* ─────────── Team Card ─────────── */
function TeamCard() {
  return (
    <div className="card-elevated p-6">
      <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        <Users className="h-3.5 w-3.5" />
        Assigned Team
      </div>
      <div className="mt-3 space-y-3">
        {teamMembers.slice(0, 4).map((m) => (
          <div key={m.name} className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
              {m.initials}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-sm font-semibold truncate">{m.name}</div>
              <div className="text-[11px] text-muted-foreground">{m.role}</div>
            </div>
            <span className={cn(
              "rounded-md px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider",
              m.status === "Lead" ? "bg-accent/15 text-accent" : "bg-secondary text-muted-foreground",
            )}>
              {m.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ScoreRing({ score }: { score: number }) {
  const radius = 42;
  const circ = 2 * Math.PI * radius;
  const offset = circ - (score / 100) * circ;
  const color = score >= 80 ? "var(--success)" : score >= 60 ? "var(--warning)" : "var(--destructive)";
  return (
    <div className="relative h-28 w-28 shrink-0">
      <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
        <circle
          cx="50"
          cy="50"
          r={radius}
          stroke="var(--secondary)"
          strokeWidth="8"
          fill="none"
        />
        <circle
          cx="50"
          cy="50"
          r={radius}
          stroke={color}
          strokeWidth="8"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          className="transition-all"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-2xl font-bold tabular-nums">{score}</div>
        <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
          / 100
        </div>
      </div>
    </div>
  );
}

function RecommendationsCard() {
  return (
    <div className="card-elevated p-6">
      <div className="flex items-center justify-between gap-3 mb-4">
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Decision Support
          </div>
          <h3 className="mt-0.5 text-lg font-bold text-foreground">
            Operational Recommendations
          </h3>
        </div>
        <span className="text-[11px] text-muted-foreground">
          Not legal advice · Human approval required
        </span>
      </div>

      <div className="space-y-3">
        {recommendations.map((r) => (
          <div
            key={r.id}
            className="rounded-lg border border-border bg-surface p-4 hover:border-primary/30 transition-colors"
          >
            <div className="flex items-start justify-between gap-3 flex-wrap">
              <div className="flex items-start gap-3 min-w-0 flex-1">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <div className="font-semibold text-foreground">{r.title}</div>
                    <PriorityBadge priority={r.priority} />
                  </div>
                  <div className="mt-1 text-sm text-muted-foreground">{r.reason}</div>
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <div className="text-right">
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                    Confidence
                  </div>
                  <div className="text-sm font-bold tabular-nums text-foreground">
                    {r.confidence}%
                  </div>
                </div>
                <button
                  onClick={() => demoOk(`Actioning: ${r.title}`, r.reason)}
                  className="inline-flex h-8 items-center gap-1 rounded-md border border-border bg-background px-3 text-xs font-semibold hover:bg-secondary"
                >
                  Act <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ApprovalCard() {
  return (
    <div className="card-elevated p-6">
      <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        Human Review
      </div>
      <h3 className="mt-0.5 text-lg font-bold text-foreground">Approval Queue</h3>

      <div className="mt-4 rounded-lg border border-border bg-secondary/40 p-4">
        <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-primary">
          <Sparkles className="h-3.5 w-3.5" />
          AI Suggestion
        </div>
        <div className="mt-1.5 text-sm font-semibold text-foreground">
          Collect additional survey evidence from panel surveyor Mr. K. Rao.
        </div>
        <div className="mt-1 text-xs text-muted-foreground">
          Auto-drafted email & callback request ready to send.
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2">
        <button
          onClick={() => demoOk("Approved", "Outbound email scheduled to Mr. K. Rao.")}
          className="inline-flex h-9 items-center justify-center gap-1.5 rounded-md bg-success text-success-foreground text-sm font-semibold hover:opacity-90"
        >
          <Check className="h-4 w-4" /> Approve
        </button>
        <button
          onClick={() => demo("Editing draft…", "Open the AI-drafted email in the editor.")}
          className="inline-flex h-9 items-center justify-center gap-1.5 rounded-md border border-border bg-background text-sm font-semibold hover:bg-secondary"
        >
          <Pencil className="h-4 w-4" /> Edit
        </button>
        <button
          onClick={() => demoWarn("Suggestion rejected", "Removed from approval queue and logged.")}
          className="inline-flex h-9 items-center justify-center gap-1.5 rounded-md border border-border bg-background text-sm font-semibold text-destructive hover:bg-destructive/10"
        >
          <X className="h-4 w-4" /> Reject
        </button>
      </div>

      <div className="mt-3 flex items-center gap-1.5 text-[11px] text-muted-foreground">
        <ShieldAlert className="h-3.5 w-3.5" />
        Human approval required before any outbound action.
      </div>
    </div>
  );
}

/* ─────────── Documents ─────────── */
function DocumentsTab({ caseId, documents }: { caseId: string; documents: any[] }) {
  const docs = documents.length > 0 ? documents.map((d: any) => ({
    name: d.filename,
    type: d.category,
    status: d.confidence > 90 ? "Verified" : d.confidence > 70 ? "Flagged" : "Missing",
    tone: d.confidence > 90 ? "success" as const : d.confidence > 70 ? "warning" as const : "destructive" as const
  })) : [
    { name: "Policy_Motor_2024.pdf", type: "Policy", status: "Verified", tone: "success" as const },
    { name: "Claim_Form_10245.pdf", type: "Claim Form", status: "Verified", tone: "success" as const },
    { name: "Rejection_Letter.pdf", type: "Correspondence", status: "Verified", tone: "success" as const },
    { name: "Legal_Notice_Sharma.pdf", type: "Legal Notice", status: "Flagged", tone: "warning" as const },
    { name: "Survey_Report.pdf", type: "Survey Report", status: "Missing", tone: "destructive" as const },
    { name: "FIR_Copy.pdf", type: "FIR", status: "Missing", tone: "destructive" as const },
  ];
  return (
    <div className="card-elevated overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-secondary/60 text-[11px] uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="text-left font-semibold px-5 py-3">Document</th>
              <th className="text-left font-semibold px-5 py-3">Type</th>
              <th className="text-left font-semibold px-5 py-3">Status</th>
              <th className="w-20" />
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {docs.map((d) => (
              <tr key={d.name} className="hover:bg-secondary/30">
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-2.5">
                    <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                    <span className="font-medium">{d.name}</span>
                  </div>
                </td>
                <td className="px-5 py-3.5 text-muted-foreground">{d.type}</td>
                <td className="px-5 py-3.5">
                  <StatusPill status={d.status} tone={d.tone} />
                </td>
                <td className="px-3 text-right">
                  <button
                    onClick={() => demo(`Opening ${d.name}`, `${d.type} · ${d.status}`)}
                    className="text-xs font-semibold text-primary hover:underline"
                  >
                    Open
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ─────────── Timeline ─────────── */
function TimelineTab({ analysis }: { analysis: any }) {
  const timeline = analysis?.timeline || caseTimeline;
  const toneClasses = {
    neutral: "bg-secondary text-muted-foreground border-border",
    info: "bg-info/10 text-info border-info/30",
    warning: "bg-warning/10 text-warning border-warning/30",
    destructive: "bg-destructive/10 text-destructive border-destructive/30",
  } as const;

  return (
    <div className="card-elevated p-6 md:p-8">
      <div className="mb-6">
        <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          Chronology
        </div>
        <h3 className="mt-0.5 text-lg font-bold text-foreground">
          AI-annotated Case Timeline
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          Every event tagged with its downstream impact on litigation risk.
        </p>
      </div>

      <div className="relative">
        <div className="absolute left-[15px] top-2 bottom-2 w-px bg-gradient-to-b from-border via-border to-transparent" />
        <ol className="space-y-6">
          {timeline.map((e: any, i: number) => (
            <li key={i} className="relative pl-10">
              <div
                className={cn(
                  "absolute left-0 top-1 flex h-8 w-8 items-center justify-center rounded-full border-2 bg-background",
                  toneClasses[e.tone],
                )}
              >
                {e.tone === "destructive" ? (
                  <AlertTriangle className="h-3.5 w-3.5" />
                ) : e.tone === "warning" ? (
                  <ShieldAlert className="h-3.5 w-3.5" />
                ) : e.tone === "info" ? (
                  <Circle className="h-2.5 w-2.5 fill-current" />
                ) : (
                  <Circle className="h-2.5 w-2.5 fill-current" />
                )}
              </div>
              <div className="flex flex-wrap items-baseline gap-2">
                <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground tabular-nums">
                  {e.date}
                </div>
                <div className="font-bold text-foreground">{e.event}</div>
              </div>
              <div className="mt-1 text-sm text-muted-foreground">{e.detail}</div>
              <div className="mt-2 flex items-start gap-2 rounded-md border border-primary/15 bg-primary/5 px-3 py-2 text-xs">
                <Sparkles className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-primary">AI Impact:</span>{" "}
                  <span className="text-foreground">{e.impact}</span>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

/* ─────────── Evidence ─────────── */
function EvidenceTab() {
  const completion = 65;
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] gap-6">
      <div className="card-elevated overflow-hidden">
        <div className="p-5 border-b border-border grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Evidence Completeness
            </div>
            <h3 className="mt-0.5 text-lg font-bold">Evidence Checklist</h3>
          </div>
          <span className="text-xs font-semibold tabular-nums text-muted-foreground shrink-0">
            {completion}% ready
          </span>
        </div>
        <div className="px-5 pt-4">
          <div className="h-2 rounded-full bg-secondary overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-warning to-success rounded-full"
              style={{ width: `${completion}%` }}
            />
          </div>
        </div>

        <table className="w-full text-sm mt-2">
          <thead className="text-[11px] uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="text-left font-semibold px-5 py-3">Evidence</th>
              <th className="text-left font-semibold px-5 py-3">Status</th>
              <th className="text-left font-semibold px-5 py-3">Importance</th>
              <th className="w-20" />
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {evidenceItems.map((e) => (
              <tr key={e.name} className="hover:bg-secondary/30">
                <td className="px-5 py-3.5 font-medium">{e.name}</td>
                <td className="px-5 py-3.5">
                  {e.status === "Completed" || e.status === "Available" ? (
                    <span className="inline-flex items-center gap-1.5 text-success text-xs font-semibold">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      {e.status}
                    </span>
                  ) : e.status === "Missing" ? (
                    <span className="inline-flex items-center gap-1.5 text-destructive text-xs font-semibold">
                      <XCircle className="h-3.5 w-3.5" />
                      Missing
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 text-warning text-xs font-semibold">
                      <AlertTriangle className="h-3.5 w-3.5" />
                      {e.status}
                    </span>
                  )}
                </td>
                <td className="px-5 py-3.5">
                  <span
                    className={cn(
                      "inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-semibold",
                      e.importance === "Critical" &&
                        "bg-destructive/10 text-destructive",
                      e.importance === "High" && "bg-warning/15 text-warning",
                      e.importance === "Medium" && "bg-secondary text-muted-foreground",
                    )}
                  >
                    {e.importance}
                  </span>
                </td>
                <td className="px-3 text-right">
                  <button
                    onClick={() =>
                      e.status === "Missing"
                        ? demoWarn(`Requesting: ${e.name}`, "Sent to opposing counsel and surveyor.")
                        : demo(`Viewing ${e.name}`, `${e.importance} · ${e.status}`)
                    }
                    className="text-xs font-semibold text-primary hover:underline"
                  >
                    {e.status === "Missing" ? "Request" : "View"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="space-y-6">
        <CaseHealthCard />
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   ⭐⭐⭐⭐⭐ CROSS-DOCUMENT INTELLIGENCE — HERO FEATURE
   ═══════════════════════════════════════════════════════════ */
function CrossDocIntelTab({ analysis }: { analysis: any }) {
  const comparisons = analysis?.cross_doc || crossDocComparisons;
  const [expandedId, setExpandedId] = useState<string | null>(comparisons[0]?.id ?? null);
  const [filter, setFilter] = useState<"all" | "critical" | "high" | "medium" | "low">("all");

  const filtered = filter === "all"
    ? comparisons
    : comparisons.filter((c: any) => c.severity === filter);

  const severityConfig = {
    critical: {
      bg: "bg-gradient-to-r from-destructive/10 via-destructive/5 to-transparent",
      border: "border-destructive/40",
      badge: "bg-destructive text-destructive-foreground",
      icon: "text-destructive",
      ring: "ring-destructive/20",
      glow: "shadow-destructive/10",
    },
    high: {
      bg: "bg-gradient-to-r from-warning/10 via-warning/5 to-transparent",
      border: "border-warning/40",
      badge: "bg-warning text-warning-foreground",
      icon: "text-warning",
      ring: "ring-warning/20",
      glow: "shadow-warning/10",
    },
    medium: {
      bg: "bg-gradient-to-r from-info/10 via-info/5 to-transparent",
      border: "border-info/30",
      badge: "bg-info text-info-foreground",
      icon: "text-info",
      ring: "ring-info/20",
      glow: "shadow-info/10",
    },
    low: {
      bg: "bg-gradient-to-r from-success/10 via-success/5 to-transparent",
      border: "border-success/30",
      badge: "bg-success text-success-foreground",
      icon: "text-success",
      ring: "ring-success/20",
      glow: "shadow-success/10",
    },
  };

  return (
    <div className="space-y-6">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-xl hero-gradient text-primary-foreground p-6 md:p-8 shadow-lg">
        <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-info/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

        <div className="relative">
          <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-widest text-accent">
            <GitCompare className="h-4 w-4" />
            Cross-Document Intelligence
            <span className="ml-1 rounded-full bg-accent px-2 py-0.5 text-[9px] font-bold text-accent-foreground uppercase">
              Signature Feature
            </span>
          </div>
          <h2 className="mt-2 text-2xl md:text-3xl font-bold tracking-tight">
            AI Document Comparison Engine
          </h2>
          <p className="mt-2 text-sm text-primary-foreground/70 max-w-2xl">
            LegalOS analyzed {crossDocSummary.documentsAnalyzed} documents across this case, performing{" "}
            {crossDocSummary.comparisonsPerformed} field-by-field comparisons. Every document is
            cross-referenced for inconsistencies, contradictions, and missing data.
          </p>

          {/* Stats row */}
          <div className="mt-6 grid grid-cols-2 md:grid-cols-5 gap-3">
            <div className="rounded-lg bg-white/10 backdrop-blur-sm border border-white/10 p-3">
              <div className="text-2xl font-bold tabular-nums">{crossDocSummary.documentsAnalyzed}</div>
              <div className="text-[10px] uppercase tracking-widest text-primary-foreground/60 mt-0.5">Docs Analyzed</div>
            </div>
            <div className="rounded-lg bg-white/10 backdrop-blur-sm border border-white/10 p-3">
              <div className="text-2xl font-bold tabular-nums">{crossDocSummary.comparisonsPerformed}</div>
              <div className="text-[10px] uppercase tracking-widest text-primary-foreground/60 mt-0.5">Comparisons</div>
            </div>
            <div className="rounded-lg bg-destructive/20 backdrop-blur-sm border border-destructive/30 p-3">
              <div className="text-2xl font-bold tabular-nums text-destructive-foreground">{crossDocSummary.criticalFindings}</div>
              <div className="text-[10px] uppercase tracking-widest text-destructive-foreground/70 mt-0.5">Critical</div>
            </div>
            <div className="rounded-lg bg-warning/20 backdrop-blur-sm border border-warning/30 p-3">
              <div className="text-2xl font-bold tabular-nums">{crossDocSummary.highFindings}</div>
              <div className="text-[10px] uppercase tracking-widest text-primary-foreground/60 mt-0.5">High</div>
            </div>
            <div className="rounded-lg bg-white/10 backdrop-blur-sm border border-white/10 p-3">
              <div className="text-2xl font-bold tabular-nums">{crossDocSummary.inconsistenciesFound}</div>
              <div className="text-[10px] uppercase tracking-widest text-primary-foreground/60 mt-0.5">Total Findings</div>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-2 text-[11px] text-primary-foreground/60">
            <Sparkles className="h-3.5 w-3.5 text-accent" />
            Last analyzed: {crossDocSummary.lastAnalyzed} · Powered by Nova Legal LLM
          </div>
        </div>
      </div>

      {/* Filter chips */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold text-muted-foreground mr-1">Filter:</span>
        {(["all", "critical", "high", "medium", "low"] as const).map((f) => {
          const counts = { all: crossDocComparisons.length, critical: crossDocSummary.criticalFindings, high: crossDocSummary.highFindings, medium: crossDocSummary.mediumFindings, low: crossDocSummary.lowFindings };
          return (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "h-8 rounded-md border px-3 text-xs font-semibold transition-colors capitalize",
                filter === f
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-background border-border text-foreground hover:bg-secondary",
              )}
            >
              {f} ({counts[f]})
            </button>
          );
        })}
      </div>

      {/* Comparison Cards */}
      <div className="space-y-4">
        {filtered.map((comp) => {
          const config = severityConfig[comp.severity];
          const isExpanded = expandedId === comp.id;
          const isConsistent = comp.severity === "low" && comp.documents.every((d, _i, arr) => d.value === arr[0].value);

          return (
            <div
              key={comp.id}
              className={cn(
                "rounded-xl border-2 overflow-hidden transition-all",
                config.border,
                isExpanded && `${config.ring} ring-2 shadow-lg ${config.glow}`,
              )}
            >
              {/* Comparison Header */}
              <button
                onClick={() => setExpandedId(isExpanded ? null : comp.id)}
                className={cn(
                  "w-full text-left p-5 transition-colors",
                  config.bg,
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className={cn(
                      "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-background border border-border shadow-sm",
                      config.icon,
                    )}>
                      {isConsistent ? (
                        <CheckCircle2 className="h-5 w-5" />
                      ) : (
                        <AlertTriangle className="h-5 w-5" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={cn(
                          "inline-flex items-center rounded px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-widest",
                          config.badge,
                        )}>
                          {comp.severity}
                        </span>
                        <h3 className="text-base font-bold text-foreground">{comp.field}</h3>
                      </div>
                      <div className="mt-1 flex flex-wrap gap-1.5">
                        {comp.documents.map((d) => (
                          <span
                            key={d.name}
                            className="inline-flex items-center gap-1 rounded border border-border bg-background px-2 py-0.5 text-[11px] font-medium text-muted-foreground"
                          >
                            <span>{d.icon}</span>
                            {d.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <ChevronRight className={cn(
                    "h-5 w-5 text-muted-foreground shrink-0 transition-transform",
                    isExpanded && "rotate-90",
                  )} />
                </div>
              </button>

              {/* Expanded Detail */}
              {isExpanded && (
                <div className="border-t border-border">
                  {/* Side-by-side comparison table */}
                  <div className="p-5">
                    <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                      Document Comparison
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="text-[11px] uppercase tracking-wider text-muted-foreground">
                            <th className="text-left font-semibold pb-2 pr-4">Source Document</th>
                            <th className="text-left font-semibold pb-2">Extracted Value</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                          {comp.documents.map((d, idx) => {
                            const hasMismatch = !isConsistent && idx > 0 && d.value !== comp.documents[0].value;
                            return (
                              <tr key={d.name} className={hasMismatch ? "bg-destructive/5" : ""}>
                                <td className="py-3 pr-4">
                                  <div className="flex items-center gap-2">
                                    <span className="text-base">{d.icon}</span>
                                    <span className="font-semibold text-foreground">{d.name}</span>
                                  </div>
                                </td>
                                <td className="py-3">
                                  <div className="flex items-center gap-2">
                                    <span className={cn(
                                      "font-semibold",
                                      hasMismatch ? "text-destructive" : "text-foreground",
                                    )}>
                                      {d.value}
                                    </span>
                                    {hasMismatch && (
                                      <span className="inline-flex items-center gap-1 rounded bg-destructive/10 px-1.5 py-0.5 text-[9px] font-bold text-destructive uppercase tracking-wider">
                                        <AlertTriangle className="h-2.5 w-2.5" />
                                        Mismatch
                                      </span>
                                    )}
                                    {isConsistent && idx === 0 && (
                                      <span className="inline-flex items-center gap-1 rounded bg-success/10 px-1.5 py-0.5 text-[9px] font-bold text-success uppercase tracking-wider">
                                        <Check className="h-2.5 w-2.5" />
                                        Consistent
                                      </span>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* AI Analysis Section */}
                  <div className="border-t border-border bg-secondary/20 p-5 space-y-4">
                    <div>
                      <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-widest text-primary mb-2">
                        <Sparkles className="h-3.5 w-3.5" />
                        AI Analysis
                      </div>
                      <p className="text-sm text-foreground leading-relaxed">
                        {comp.analysis}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-3">
                        <div className="text-[11px] font-semibold uppercase tracking-wider text-destructive mb-1.5">
                          Legal Impact
                        </div>
                        <p className="text-xs text-foreground leading-relaxed">
                          {comp.impact}
                        </p>
                      </div>
                      <div className="rounded-lg border border-success/20 bg-success/5 p-3">
                        <div className="text-[11px] font-semibold uppercase tracking-wider text-success mb-1.5">
                          Recommended Action
                        </div>
                        <p className="text-xs text-foreground leading-relaxed">
                          {comp.recommendation}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <button
                        onClick={() => demoOk(`Action created: ${comp.field}`, comp.recommendation)}
                        className="inline-flex h-8 items-center gap-1.5 rounded-md bg-primary px-3 text-xs font-semibold text-primary-foreground hover:opacity-90"
                      >
                        <Zap className="h-3 w-3" />
                        Create Action Item
                      </button>
                      <button
                        onClick={() => demo("Viewing source documents", `Opening documents related to: ${comp.field}`)}
                        className="inline-flex h-8 items-center gap-1.5 rounded-md border border-border bg-background px-3 text-xs font-semibold hover:bg-secondary"
                      >
                        <Eye className="h-3 w-3" />
                        View Sources
                      </button>
                      <button
                        onClick={() => demoOk("Added to hearing brief", `${comp.field} finding will be included in the court submission.`)}
                        className="inline-flex h-8 items-center gap-1.5 rounded-md border border-border bg-background px-3 text-xs font-semibold hover:bg-secondary"
                      >
                        <Scale className="h-3 w-3" />
                        Add to Brief
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Bottom CTA */}
      <div className="rounded-xl border border-primary/20 bg-primary/5 p-5">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <GitCompare className="h-5 w-5" />
            </div>
            <div>
              <div className="font-bold text-foreground">Full Comparison Report</div>
              <div className="text-xs text-muted-foreground">
                Download a comprehensive PDF with all {crossDocSummary.comparisonsPerformed} comparisons, findings, and recommendations.
              </div>
            </div>
          </div>
          <button
            onClick={() => demoOk("Report generating", "Cross-Document Intelligence Report will download shortly.")}
            className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground hover:opacity-90"
          >
            <Download className="h-4 w-4" />
            Download Report
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────────── AI Insights (Original alerts + recommendations) ─────────── */
function InsightsTab({ analysis }: { analysis: any }) {
  const alerts = analysis?.cross_doc?.map((c: any) => ({
    severity: c.severity === "critical" ? "high" : c.severity,
    title: c.field,
    detail: c.analysis,
    docs: c.documents.map((d: any) => d.name)
  })) || documentIntelligenceAlerts;

  const severity = {
    high: {
      badge: "bg-destructive text-destructive-foreground",
      card: "border-destructive/30 bg-destructive/5",
      icon: "text-destructive",
    },
    medium: {
      badge: "bg-warning text-warning-foreground",
      card: "border-warning/30 bg-warning/5",
      icon: "text-warning",
    },
    low: {
      badge: "bg-info text-info-foreground",
      card: "border-info/30 bg-info/5",
      icon: "text-info",
    },
  } as const;

  return (
    <div className="space-y-6">
      <div className="card-elevated p-6">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div>
            <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-widest text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              AI-Powered Analysis
            </div>
            <h3 className="mt-0.5 text-lg font-bold">Document Intelligence Alerts</h3>
            <p className="text-sm text-muted-foreground mt-1">
              {alerts.length} inconsistencies detected side-by-side. LegalOS surfaces mismatches, missing
              references, and clause conflicts.
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {["Policy", "Claim Form", "Legal Notice", "Survey Report"].map((d) => (
              <div
                key={d}
                className="inline-flex items-center gap-1.5 rounded-md border border-border bg-secondary px-2 py-1 text-xs font-medium"
              >
                <FileText className="h-3 w-3 text-muted-foreground" />
                {d}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {alerts.map((a: any, i: number) => {
          const s = severity[a.severity as keyof typeof severity] || severity.low;
          return (
            <div key={i} className={cn("rounded-xl border p-5", s.card)}>
              <div className="flex items-start gap-3">
                <div
                  className={cn(
                    "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-background border border-border",
                    s.icon,
                  )}
                >
                  <AlertTriangle className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={cn(
                        "inline-flex items-center rounded px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-widest",
                        s.badge,
                      )}
                    >
                      {a.severity}
                    </span>
                    <h4 className="font-bold text-foreground">{a.title}</h4>
                  </div>
                  <p className="mt-1.5 text-sm text-foreground leading-relaxed">
                    {a.detail}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {a.docs.map((d: string) => (
                      <span
                        key={d}
                        className="inline-flex items-center gap-1 rounded border border-border bg-background px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground"
                      >
                        <FileText className="h-2.5 w-2.5" />
                        {d}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <RecommendationsCard />
    </div>
  );
}

/* ─────────── Notes ─────────── */
function NotesTab({ caseId, notes, onNoteAdded }: { caseId: string; notes: any[]; onNoteAdded: () => void }) {
  const [draft, setDraft] = useState("");

  const post = async () => {
    const text = draft.trim();
    if (!text) {
      demoWarn("Note is empty", "Type something before posting.");
      return;
    }
    await addCaseNote(caseId, "Anita Nair", text);
    setDraft("");
    onNoteAdded();
    demoOk("Note posted", "Visible to all team members on this case.");
  };

  const currentNotes = notes.length > 0 ? notes : [
    {
      author: "Anita Nair",
      role: "Legal Ops Manager",
      time: "2 hours ago",
      message: "Called surveyor K. Rao — will send report by EOD tomorrow.",
      created_at: null
    },
    {
      author: "Vikram Sethi",
      role: "Senior Counsel",
      time: "Yesterday",
      message: "Exclusion clause 4.2 has strong ambiguity points.",
      created_at: null
    }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] gap-6">
      <div className="card-elevated p-6">
        <div className="mb-4">
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Add a case note or tag a teammate…"
            className="w-full min-h-24 rounded-lg border border-border bg-surface p-3 text-sm focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20 resize-none"
          />
          <div className="mt-2 flex justify-end">
            <button
              onClick={post}
              className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground hover:opacity-90"
            >
              <MessageSquare className="h-4 w-4" />
              Post Note
            </button>
          </div>
        </div>
        <div className="space-y-4">
          {currentNotes.map((n: any, i: number) => (
            <div key={i} className="rounded-lg border border-border bg-surface p-4">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
                    {(n.author || "AN")
                      .split(" ")
                      .map((p: string) => p[0])
                      .join("")}
                  </div>
                  <div>
                    <div className="text-sm font-semibold">{n.author}</div>
                    <div className="text-[11px] text-muted-foreground">{n.role || "Legal Team"}</div>
                  </div>
                </div>
                <span className="text-[11px] text-muted-foreground">
                  {n.created_at ? new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : n.time}
                </span>
              </div>
              <p className="mt-2.5 text-sm text-foreground leading-relaxed">{n.message || n.text}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="space-y-6">
        <TeamCard />
      </div>
    </div>
  );
}

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
} from "lucide-react";
import { RiskBadge, PriorityBadge, StatusPill } from "@/components/legal/RiskBadge";
import {
  caseTimeline,
  evidenceItems,
  documentIntelligenceAlerts,
  recommendations,
} from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/cases/$caseId")({
  component: CaseWorkspace,
});

const TABS = [
  "Overview",
  "Documents",
  "Timeline",
  "Evidence",
  "AI Insights",
  "Notes",
] as const;
type Tab = (typeof TABS)[number];

function CaseWorkspace() {
  const { caseId } = Route.useParams();
  const [tab, setTab] = useState<Tab>("Overview");

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
                <StatusPill status="Under Review" tone="warning" />
                <RiskBadge risk="High" />
                <span className="text-xs text-muted-foreground">
                  Risk score: <span className="font-bold text-foreground">87</span>/100
                </span>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground text-balance">
                Motor Insurance Claim Dispute
              </h1>
              <p className="mt-1.5 text-sm text-muted-foreground">
                Consumer complaint filed against rejection of comprehensive motor claim.
                Insurer disputes exclusion clause applicability.
              </p>
            </div>
            <div className="flex items-start gap-2 shrink-0">
              <button className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-border bg-background px-3 text-sm font-medium hover:bg-secondary">
                <Share2 className="h-4 w-4" /> Share
              </button>
              <button className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-border bg-background px-3 text-sm font-medium hover:bg-secondary">
                <Download className="h-4 w-4" /> Export
              </button>
              <button className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-primary px-3.5 text-sm font-semibold text-primary-foreground hover:opacity-90">
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
            value="₹42,80,000"
          />
          <SummaryCell
            icon={<Gavel className="h-4 w-4" />}
            label="Current Stage"
            value="Consumer Court"
            hint="District Bench II"
          />
          <SummaryCell
            icon={<Calendar className="h-4 w-4" />}
            label="Next Hearing"
            value="12 Aug 2026"
            hint="in 5 days"
            tone="warning"
          />
          <SummaryCell
            icon={<User className="h-4 w-4" />}
            label="Opposing Party"
            value="Rajesh Sharma"
            hint="Counsel: A. Menon & Co."
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
            )}
          >
            {t}
            {tab === t && (
              <span className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-primary" />
            )}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {tab === "Overview" && <OverviewTab />}
        {tab === "Documents" && <DocumentsTab />}
        {tab === "Timeline" && <TimelineTab />}
        {tab === "Evidence" && <EvidenceTab />}
        {tab === "AI Insights" && <InsightsTab />}
        {tab === "Notes" && <NotesTab />}
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
function OverviewTab() {
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
              91% confidence
            </span>
          </div>

          <dl className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 text-sm">
            <div>
              <dt className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Case Type
              </dt>
              <dd className="mt-1 font-semibold text-foreground">
                Motor Insurance Claim
              </dd>
            </div>
            <div>
              <dt className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Core Issue
              </dt>
              <dd className="mt-1 font-semibold text-foreground">
                Claim rejection dispute after accident
              </dd>
            </div>
            <div className="md:col-span-2">
              <dt className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                AI Summary
              </dt>
              <dd className="mt-1 text-foreground leading-relaxed">
                Policyholder has filed a consumer complaint after claim rejection under
                exclusion clause 4.2. Survey report referenced in the legal notice is
                <span className="font-semibold text-destructive"> missing from the case file</span>,
                and a district consumer court hearing is scheduled in 5 days.
              </dd>
            </div>
            <div className="md:col-span-2">
              <dt className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Recommended Operational Action
              </dt>
              <dd className="mt-1 rounded-lg border border-accent/25 bg-accent/10 px-3 py-2.5 text-foreground">
                Collect the survey report from the panel surveyor and validate rejection
                reasoning against clause 4.2 wording before the next hearing.
              </dd>
            </div>
          </dl>
        </div>

        {/* Recommendations */}
        <RecommendationsCard />
      </div>

      {/* Right column */}
      <div className="space-y-6">
        <ReadinessCard />
        <ApprovalCard />
      </div>
    </div>
  );
}

function ReadinessCard() {
  const score = 72;
  const breakdown = [
    { label: "Documents Available", value: 80 },
    { label: "Evidence Completeness", value: 60 },
    { label: "Deadline Readiness", value: 70 },
  ];

  return (
    <div className="card-elevated p-6">
      <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        Case Readiness Score
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

      <div className="mt-6 space-y-3">
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

      <div className="mt-6 grid grid-cols-1 gap-3 text-sm">
        <div className="rounded-lg border border-success/25 bg-success/5 p-3">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-success mb-1.5">
            Strengths
          </div>
          <ul className="space-y-1">
            <li className="flex items-center gap-2">
              <Check className="h-3.5 w-3.5 text-success" />
              Policy uploaded
            </li>
            <li className="flex items-center gap-2">
              <Check className="h-3.5 w-3.5 text-success" />
              Claim form available
            </li>
          </ul>
        </div>
        <div className="rounded-lg border border-destructive/25 bg-destructive/5 p-3">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-destructive mb-1.5">
            Gaps
          </div>
          <ul className="space-y-1">
            <li className="flex items-center gap-2">
              <X className="h-3.5 w-3.5 text-destructive" />
              FIR missing
            </li>
            <li className="flex items-center gap-2">
              <X className="h-3.5 w-3.5 text-destructive" />
              Survey report missing
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

function ScoreRing({ score }: { score: number }) {
  const radius = 42;
  const circ = 2 * Math.PI * radius;
  const offset = circ - (score / 100) * circ;
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
          stroke="var(--warning)"
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
                <button className="inline-flex h-8 items-center gap-1 rounded-md border border-border bg-background px-3 text-xs font-semibold hover:bg-secondary">
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
        <button className="inline-flex h-9 items-center justify-center gap-1.5 rounded-md bg-success text-success-foreground text-sm font-semibold hover:opacity-90">
          <Check className="h-4 w-4" /> Approve
        </button>
        <button className="inline-flex h-9 items-center justify-center gap-1.5 rounded-md border border-border bg-background text-sm font-semibold hover:bg-secondary">
          <Pencil className="h-4 w-4" /> Edit
        </button>
        <button className="inline-flex h-9 items-center justify-center gap-1.5 rounded-md border border-border bg-background text-sm font-semibold text-destructive hover:bg-destructive/10">
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
function DocumentsTab() {
  const docs = [
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
                  <button className="text-xs font-semibold text-primary hover:underline">
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
function TimelineTab() {
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
          {caseTimeline.map((e, i) => (
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
                  <button className="text-xs font-semibold text-primary hover:underline">
                    {e.status === "Missing" ? "Request" : "View"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="space-y-6">
        <ReadinessCard />
      </div>
    </div>
  );
}

/* ─────────── AI Insights ─────────── */
function InsightsTab() {
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
              Cross-Document Intelligence
            </div>
            <h3 className="mt-0.5 text-lg font-bold">Document Intelligence</h3>
            <p className="text-sm text-muted-foreground mt-1">
              4 documents analyzed side-by-side. LegalOS surfaces mismatches, missing
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
        {documentIntelligenceAlerts.map((a, i) => {
          const s = severity[a.severity];
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
                    {a.docs.map((d) => (
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
function NotesTab() {
  const notes = [
    {
      author: "Anita Nair",
      role: "Legal Ops Manager",
      time: "2 hours ago",
      text: "Called panel surveyor — will send report by EOD tomorrow. Update evidence checklist once received.",
    },
    {
      author: "Vikram Sethi",
      role: "Senior Counsel",
      time: "Yesterday",
      text: "Clause 4.2 interpretation may not hold given precedent in NCDRC/2022/RP/1187. Prepare secondary defense on quantum.",
    },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] gap-6">
      <div className="card-elevated p-6">
        <div className="mb-4">
          <textarea
            placeholder="Add a case note or tag a teammate…"
            className="w-full min-h-24 rounded-lg border border-border bg-surface p-3 text-sm focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20 resize-none"
          />
          <div className="mt-2 flex justify-end">
            <button className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground">
              <MessageSquare className="h-4 w-4" />
              Post Note
            </button>
          </div>
        </div>
        <div className="space-y-4">
          {notes.map((n, i) => (
            <div key={i} className="rounded-lg border border-border bg-surface p-4">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
                    {n.author
                      .split(" ")
                      .map((p) => p[0])
                      .join("")}
                  </div>
                  <div>
                    <div className="text-sm font-semibold">{n.author}</div>
                    <div className="text-[11px] text-muted-foreground">{n.role}</div>
                  </div>
                </div>
                <span className="text-[11px] text-muted-foreground">{n.time}</span>
              </div>
              <p className="mt-2.5 text-sm text-foreground leading-relaxed">{n.text}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="card-elevated p-6 h-fit">
        <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          Team on this case
        </div>
        <div className="mt-3 space-y-3">
          {[
            { name: "Anita Nair", role: "Legal Ops Manager (Lead)" },
            { name: "Vikram Sethi", role: "Senior Counsel" },
            { name: "Priya Rao", role: "Paralegal" },
          ].map((m) => (
            <div key={m.name} className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-xs font-bold">
                {m.name
                  .split(" ")
                  .map((p) => p[0])
                  .join("")}
              </div>
              <div>
                <div className="text-sm font-semibold">{m.name}</div>
                <div className="text-[11px] text-muted-foreground">{m.role}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

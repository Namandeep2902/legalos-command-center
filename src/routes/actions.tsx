import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Zap, ArrowRight, Clock } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { PageHeader } from "@/components/legal/PageHeader";
import { PriorityBadge } from "@/components/legal/RiskBadge";
import { priorityActions } from "@/lib/mock-data";
import { getCases } from "@/lib/api";
import { getUser } from "@/lib/auth";


export const Route = createFileRoute("/actions")({
  component: ActionsPage,
});

function ActionsPage() {
  const user = getUser();
  const isDemo = user?.id === "demo";

  const { data: casesData } = useQuery({
    queryKey: ["actions-cases"],
    queryFn: getCases,
  });
  const cases = casesData || [];

  const mockExtended = [
    ...priorityActions,
    {
      id: "a5",
      title: "Court Fee Payment Pending",
      caseNo: "Case #6650",
      caseTitle: "Third Party Liability Claim",
      action: "Process ₹18,500 court fee",
      priority: "MEDIUM" as const,
      due: "4 days remaining",
    },
    {
      id: "a6",
      title: "Witness Statement Follow-up",
      caseNo: "Case #7712",
      caseTitle: "Fire Damage Coverage Dispute",
      action: "Confirm availability for deposition",
      priority: "LOW" as const,
      due: "Next week",
    },
  ];

  const realActions = cases.flatMap((c: any) => [
    {
      id: `action-${c.id || c._id}-1`,
      title: `Verify details for ${c.title}`,
      caseNo: `Case #${(c.id || c._id || "").toString().slice(-5)}`,
      caseTitle: c.title,
      action: "Please review uploaded documents and confirm key info.",
      priority: "HIGH" as const,
      due: "Due today",
      rawCaseId: c.id || c._id
    }
  ]);

  const extended = isDemo ? mockExtended : realActions;

  const overdueCount = extended.filter(a => a.priority === "HIGH").length;
  const todayCount = extended.filter(a => a.due.toLowerCase().includes("today") || a.due.toLowerCase().includes("hour")).length;
  const weekCount = extended.filter(a => a.due.toLowerCase().includes("day") || a.due.toLowerCase().includes("week")).length;
  const laterCount = extended.filter(a => a.due.toLowerCase().includes("next") || a.due.toLowerCase().includes("later")).length;

  const groups = [
    { label: "Overdue", count: overdueCount, tone: "destructive" as const },
    { label: "Due Today", count: todayCount, tone: "warning" as const },
    { label: "This Week", count: weekCount, tone: "info" as const },
    { label: "Later", count: laterCount, tone: "neutral" as const },
  ];

  const [group, setGroup] = useState<string>("Overdue");
  const visible = extended.filter((a) => {
    if (group === "Overdue") return a.priority === "HIGH";
    if (group === "Due Today") return a.due.toLowerCase().includes("day") || a.due.toLowerCase().includes("today") || a.due.toLowerCase().includes("hour");
    if (group === "This Week") return a.due.toLowerCase().includes("day") || a.due.toLowerCase().includes("week");
    return true;
  });

  return (
    <div className="mx-auto max-w-[1400px] p-4 md:p-8">
      <PageHeader
        eyebrow="Action Center"
        title="What needs your attention"
        description="AI-prioritized action queue across all active cases. Every task shows what to do, why it matters, and when it's due."
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {groups.map((g) => (
          <button
            key={g.label}
            onClick={() => setGroup(g.label)}
            className={`card-elevated p-4 cursor-pointer text-left transition-all ${
              group === g.label ? "ring-2 ring-primary/40 border-primary/30" : "hover:border-primary/30"
            }`}
          >
            <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              {g.label}
            </div>
            <div className="mt-1 text-2xl font-bold tabular-nums">{g.count}</div>
          </button>
        ))}
      </div>


      <div className="card-elevated overflow-hidden">
        <div className="p-5 border-b border-border">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Zap className="h-4 w-4 text-accent" />
            All Actions
          </h2>
        </div>
        <div className="divide-y divide-border">
          {visible.length > 0 ? (
            visible.map((a) => (
              <div
                key={a.id}
                className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_auto] items-center gap-4 p-5 hover:bg-secondary/30 transition-colors"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                    <PriorityBadge priority={a.priority} />
                    <span className="text-[11px] text-muted-foreground">
                      {a.caseNo} · {a.caseTitle}
                    </span>
                  </div>
                  <div className="font-semibold text-foreground">{a.title}</div>
                  <div className="mt-0.5 text-sm text-muted-foreground">{a.action}</div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right hidden sm:block">
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground flex items-center gap-1 justify-end">
                      <Clock className="h-3 w-3" /> Due
                    </div>
                    <div className="text-xs font-semibold text-foreground">{a.due}</div>
                  </div>
                  <Link
                    to="/cases/$caseId"
                    params={{ caseId: (a as any).rawCaseId || "10245" }}
                    className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-primary px-3 text-xs font-semibold text-primary-foreground hover:opacity-90"
                  >
                    Open Case
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-muted-foreground text-sm">
              All caught up! No pending actions in this category.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

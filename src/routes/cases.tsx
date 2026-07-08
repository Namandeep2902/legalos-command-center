import { createFileRoute, Link } from "@tanstack/react-router";
import { Filter, Plus, Search, ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/legal/PageHeader";
import { RiskBadge, StatusPill } from "@/components/legal/RiskBadge";
import { casesList } from "@/lib/mock-data";

export const Route = createFileRoute("/cases")({
  component: CasesPage,
});

function CasesPage() {
  return (
    <div className="mx-auto max-w-[1600px] p-4 md:p-8">
      <PageHeader
        eyebrow="Cases"
        title="Case Portfolio"
        description="248 active matters across motor, health, and property insurance disputes. Ranked by AI risk score."
        actions={
          <>
            <button className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-border bg-background px-3 text-sm font-medium hover:bg-secondary transition-colors">
              <Filter className="h-4 w-4" />
              Filters
            </button>
            <button className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-primary px-3.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity">
              <Plus className="h-4 w-4" />
              New Case
            </button>
          </>
        }
      />

      {/* Filters bar */}
      <div className="card-elevated p-3 mb-4">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative flex-1 min-w-[220px]">
            <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              placeholder="Search by case ID, party, or type…"
              className="h-9 w-full rounded-md border border-border bg-background pl-9 pr-3 text-sm placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20"
            />
          </div>
          {["All", "Motor", "Health", "Property", "High Risk"].map((chip, i) => (
            <button
              key={chip}
              className={`h-9 rounded-md border px-3 text-xs font-semibold transition-colors ${
                i === 0
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-background border-border text-foreground hover:bg-secondary"
              }`}
            >
              {chip}
            </button>
          ))}
        </div>
      </div>

      <div className="card-elevated overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-secondary/60 text-[11px] uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="text-left font-semibold px-5 py-3">Case</th>
                <th className="text-left font-semibold px-5 py-3">Type</th>
                <th className="text-left font-semibold px-5 py-3">Stage</th>
                <th className="text-left font-semibold px-5 py-3">Risk</th>
                <th className="text-right font-semibold px-5 py-3">Amount</th>
                <th className="text-left font-semibold px-5 py-3">Next Hearing</th>
                <th className="text-left font-semibold px-5 py-3">Status</th>
                <th className="w-10" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {casesList.map((c) => (
                <tr key={c.id} className="hover:bg-secondary/30 transition-colors">
                  <td className="px-5 py-3.5">
                    <Link
                      to="/cases/$caseId"
                      params={{ caseId: c.id }}
                      className="group block min-w-0"
                    >
                      <div className="font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                        {c.title}
                      </div>
                      <div className="text-xs text-muted-foreground mt-0.5">
                        #{c.id} · {c.party}
                      </div>
                    </Link>
                  </td>
                  <td className="px-5 py-3.5 text-muted-foreground whitespace-nowrap">
                    {c.type}
                  </td>
                  <td className="px-5 py-3.5 text-foreground whitespace-nowrap">
                    {c.stage}
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <RiskBadge risk={c.risk} />
                      <span className="text-xs text-muted-foreground tabular-nums">
                        {c.riskScore}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-right font-semibold tabular-nums">
                    {c.amount}
                  </td>
                  <td className="px-5 py-3.5 text-foreground whitespace-nowrap">
                    {c.hearing}
                  </td>
                  <td className="px-5 py-3.5">
                    <StatusPill
                      status={c.status}
                      tone={
                        c.status === "Ready"
                          ? "success"
                          : c.status === "Evidence Pending" || c.status === "Response Due"
                            ? "warning"
                            : "neutral"
                      }
                    />
                  </td>
                  <td className="px-3">
                    <Link
                      to="/cases/$caseId"
                      params={{ caseId: c.id }}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground"
                    >
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

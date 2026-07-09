import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2, XCircle, AlertTriangle, Search } from "lucide-react";
import { useState } from "react";
import { PageHeader } from "@/components/legal/PageHeader";
import { cn } from "@/lib/utils";
import { demoOk } from "@/lib/demo-actions";

export const Route = createFileRoute("/evidence")({
  component: EvidencePage,
});

const rows = [
  { case: "Case #10245", party: "Rajesh Sharma", missing: ["FIR", "Survey Report"], present: 6, total: 8 },
  { case: "Case #8932", party: "Priya Malhotra", missing: ["Survey Report"], present: 7, total: 8 },
  { case: "Case #9821", party: "Amit Verma", missing: ["Discharge Summary"], present: 5, total: 6 },
  { case: "Case #7712", party: "Sunrise Textiles", missing: [], present: 9, total: 9 },
  { case: "Case #6650", party: "Mohammed Iqbal", missing: ["Panchnama", "Vehicle Inspection"], present: 6, total: 8 },
];

function EvidencePage() {
  const [q, setQ] = useState("");
  const filtered = rows.filter(
    (r) =>
      !q.trim() ||
      r.case.toLowerCase().includes(q.toLowerCase()) ||
      r.party.toLowerCase().includes(q.toLowerCase()),
  );
  const totalMissing = filtered.reduce((a, r) => a + r.missing.length, 0);
  return (
    <div className="mx-auto max-w-[1500px] p-4 md:p-8">
      <PageHeader
        eyebrow="Evidence Tracker"
        title="Portfolio-wide evidence health"
        description="Track evidence completeness across every case. Flag critical gaps before they surface in court."
      />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="card-elevated p-5">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Coverage</div>
          <div className="mt-2 text-3xl font-bold tabular-nums">86%</div>
          <div className="text-xs text-success mt-1">↑ 4% this week</div>
        </div>
        <div className="card-elevated p-5">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Missing Items</div>
          <div className="mt-2 text-3xl font-bold text-destructive tabular-nums">{totalMissing}</div>
          <div className="text-xs text-muted-foreground mt-1">across 4 cases</div>
        </div>
        <div className="card-elevated p-5">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Critical Gaps</div>
          <div className="mt-2 text-3xl font-bold text-destructive tabular-nums">3</div>
          <div className="text-xs text-muted-foreground mt-1">hearing within 7 days</div>
        </div>
        <div className="card-elevated p-5">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Fully Ready</div>
          <div className="mt-2 text-3xl font-bold text-success tabular-nums">142</div>
          <div className="text-xs text-muted-foreground mt-1">cases hearing-ready</div>
        </div>
      </div>

      <div className="card-elevated overflow-hidden">
        <div className="p-4 border-b border-border relative">
          <Search className="absolute left-7 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search cases…"
            className="h-9 w-full max-w-md rounded-md border border-border bg-background pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring/20"
          />
        </div>
        <table className="w-full text-sm">
          <thead className="bg-secondary/60 text-[11px] uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="text-left font-semibold px-5 py-3">Case</th>
              <th className="text-left font-semibold px-5 py-3">Completeness</th>
              <th className="text-left font-semibold px-5 py-3">Missing Items</th>
              <th className="w-32" />
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.map((r) => {
              const pct = Math.round((r.present / r.total) * 100);
              return (
                <tr key={r.case} className="hover:bg-secondary/30">
                  <td className="px-5 py-4">
                    <div className="font-semibold">{r.case}</div>
                    <div className="text-xs text-muted-foreground">{r.party}</div>
                  </td>
                  <td className="px-5 py-4 w-72">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-2 rounded-full bg-secondary overflow-hidden">
                        <div
                          className={cn(
                            "h-full rounded-full",
                            pct === 100 ? "bg-success" : pct >= 75 ? "bg-warning" : "bg-destructive",
                          )}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="text-xs font-semibold tabular-nums w-10 text-right">
                        {pct}%
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    {r.missing.length === 0 ? (
                      <span className="inline-flex items-center gap-1.5 text-success text-xs font-semibold">
                        <CheckCircle2 className="h-3.5 w-3.5" /> Complete
                      </span>
                    ) : (
                      <div className="flex flex-wrap gap-1.5">
                        {r.missing.map((m) => (
                          <span
                            key={m}
                            className="inline-flex items-center gap-1 rounded border border-destructive/25 bg-destructive/10 px-1.5 py-0.5 text-[11px] font-semibold text-destructive"
                          >
                            <XCircle className="h-3 w-3" />
                            {m}
                          </span>
                        ))}
                      </div>
                    )}
                  </td>
                  <td className="px-5 py-4 text-right">
                    <button
                      onClick={() =>
                        demoOk(
                          `Evidence request sent · ${r.case}`,
                          r.missing.length
                            ? `Requesting: ${r.missing.join(", ")}`
                            : "All evidence already collected.",
                        )
                      }
                      className="text-xs font-semibold text-primary hover:underline"
                    >
                      Request
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

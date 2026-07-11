import { createFileRoute, Link } from "@tanstack/react-router";
import { Filter, Plus, Search, ArrowRight } from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import { PageHeader } from "@/components/legal/PageHeader";
import { RiskBadge, StatusPill } from "@/components/legal/RiskBadge";
import { getCases } from "@/lib/api";
import { demo, demoOk } from "@/lib/demo-actions";

export const Route = createFileRoute("/cases")({
  component: CasesPage,
});

const CHIPS = ["All", "Motor", "Health", "Property", "High Risk"] as const;
type Chip = (typeof CHIPS)[number];

function CasesPage() {
  const [cases, setCases] = useState<any[]>([]);
  const [query, setQuery] = useState("");
  const [chip, setChip] = useState<Chip>("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const data = await getCases();
      setCases(data);
      setLoading(false);
    }
    load();
  }, []);

  const filtered = useMemo(() => {
    return cases.filter((c) => {
      const matchesChip =
        chip === "All" ||
        (chip === "High Risk" ? c.risk === "High" : (c.case_type || c.type || "").toLowerCase().includes(chip.toLowerCase()));
      const q = query.trim().toLowerCase();
      const matchesQuery =
        !q ||
        c.id.toLowerCase().includes(q) ||
        (c.title || "").toLowerCase().includes(q) ||
        (c.party || "").toLowerCase().includes(q) ||
        (c.case_type || c.type || "").toLowerCase().includes(q);
      return matchesChip && matchesQuery;
    });
  }, [cases, query, chip]);


  return (
    <div className="mx-auto max-w-[1600px] p-4 md:p-8">
      <PageHeader
        eyebrow="Cases"
        title="Case Portfolio"
        description="248 active matters across motor, health, and property insurance disputes. Ranked by AI risk score."
        actions={
          <>
            <button
              onClick={() => demo("Filters", "Court · Stage · Risk · Assigned counsel · Date range")}
              className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-border bg-background px-3 text-sm font-medium hover:bg-secondary transition-colors"
            >
              <Filter className="h-4 w-4" />
              Filters
            </button>
            <button
              onClick={() => demoOk("New case draft started", "Fill claim details or drop a legal notice to auto-populate.")}
              className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-primary px-3.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity"
            >
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
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by case ID, party, or type…"
              className="h-9 w-full rounded-md border border-border bg-background pl-9 pr-3 text-sm placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20"
            />
          </div>
          {CHIPS.map((c) => (
            <button
              key={c}
              onClick={() => setChip(c)}
              className={`h-9 rounded-md border px-3 text-xs font-semibold transition-colors ${
                chip === c
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-background border-border text-foreground hover:bg-secondary"
              }`}
            >
              {c}
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
              {filtered.map((c) => (
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
                        #{c.id} · {c.party || "Rajesh Sharma"}
                      </div>
                    </Link>
                  </td>
                  <td className="px-5 py-3.5 text-muted-foreground whitespace-nowrap">
                    {c.case_type || c.type || "Motor"}
                  </td>
                  <td className="px-5 py-3.5 text-foreground whitespace-nowrap">
                    {c.stage}
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <RiskBadge risk={c.risk} />
                      <span className="text-xs text-muted-foreground tabular-nums">
                        {c.riskScore || (c.risk === "High" ? 87 : c.risk === "Medium" ? 54 : 32)}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-right font-semibold tabular-nums">
                    {c.money || c.amount || "₹0"}
                  </td>
                  <td className="px-5 py-3.5 text-foreground whitespace-nowrap">
                    {c.next_hearing || c.hearing || "Not Scheduled"}
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

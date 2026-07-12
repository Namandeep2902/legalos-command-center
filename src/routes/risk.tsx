import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/legal/PageHeader";
import { RiskBadge } from "@/components/legal/RiskBadge";
import { casesList, riskDistribution } from "@/lib/mock-data";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";
import { ShieldAlert, TrendingUp, Flame, AlertTriangle, CheckCircle2, X } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/risk")({
  component: RiskPage,
});

function RiskPage() {
  const highRisk = casesList.filter((c) => c.risk === "High");
  const [patternOpen, setPatternOpen] = useState(false);
  const motorCases = casesList.filter(c => (c.type || "").toLowerCase().includes("motor") || c.title?.toLowerCase().includes("motor"));

  return (
    <div className="mx-auto max-w-[1500px] p-4 md:p-8">
      <PageHeader
        eyebrow="Risk Intelligence"
        title="Portfolio Risk Overview"
        description="Real-time risk scoring across 248 active matters. Drill into what's driving exposure and where to intervene first."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <div className="card-elevated p-6">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Risk Distribution
          </div>
          <div className="h-52 mt-2">
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={riskDistribution}
                  dataKey="count"
                  nameKey="level"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={3}
                  stroke="none"
                >
                  {riskDistribution.map((d) => (
                    <Cell key={d.level} fill={d.color} />
                  ))}
                </Pie>
                <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card-elevated p-6">
          <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-destructive">
            <Flame className="h-3.5 w-3.5" /> Top Exposure
          </div>
          <div className="mt-2 text-3xl font-bold text-foreground tabular-nums">
            ₹2.4 Cr
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            Aggregate claim value of high-risk cases
          </div>
          <div className="mt-5 space-y-3">
            {["Motor", "Health", "Property"].map((k, i) => (
              <div key={k}>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">{k}</span>
                  <span className="font-semibold tabular-nums">
                    ₹{[128, 68, 44][i]} L
                  </span>
                </div>
                <div className="mt-1 h-1.5 rounded-full bg-secondary overflow-hidden">
                  <div
                    className="h-full bg-primary"
                    style={{ width: `${[70, 40, 25][i]}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card-elevated p-6 hero-gradient text-primary-foreground">
          <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-accent">
            <TrendingUp className="h-3.5 w-3.5" /> AI Risk Signal
          </div>
          <div className="mt-2 text-lg font-bold">
            Rising exposure in motor claims
          </div>
          <p className="mt-2 text-sm text-primary-foreground/75">
            5 new motor cases in the last 7 days scored above 75. Common driver:
            missing survey reports at claim intake.
          </p>
          <button
            onClick={() => setPatternOpen(o => !o)}
            className="mt-4 inline-flex h-9 items-center rounded-lg bg-accent px-3.5 text-xs font-semibold text-accent-foreground hover:opacity-90 transition-opacity"
          >
            {patternOpen ? "Hide Analysis" : "Investigate pattern"}
          </button>
          {patternOpen && (
            <div className="mt-4 rounded-xl border border-white/20 bg-white/10 p-4 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-white uppercase tracking-wider">
                <AlertTriangle className="h-3.5 w-3.5 text-accent" />
                Pattern Analysis — Motor Claims
              </div>
              <div className="space-y-2">
                {[
                  { finding: "Missing survey report at intake", cases: 5, impact: "High" },
                  { finding: "Claim filed > 30 days after incident", cases: 3, impact: "Medium" },
                  { finding: "Vehicle valuation dispute", cases: 4, impact: "High" },
                  { finding: "FIR not filed within 24 hrs", cases: 2, impact: "Critical" },
                ].map((f, i) => (
                  <div key={i} className="flex items-center justify-between gap-3 text-xs">
                    <span className="text-white/80">{f.finding}</span>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${
                        f.impact === "Critical" ? "bg-red-500/30 text-red-200" :
                        f.impact === "High" ? "bg-orange-500/30 text-orange-200" :
                        "bg-yellow-500/30 text-yellow-200"
                      }`}>{f.impact}</span>
                      <span className="font-semibold text-white">{f.cases} cases</span>
                    </div>
                  </div>
                ))}
              </div>
              <Link
                to="/cases"
                className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-accent hover:underline"
              >
                View all motor cases →
              </Link>
            </div>
          )}
        </div>
      </div>

      <div className="card-elevated overflow-hidden">
        <div className="p-5 border-b border-border">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <ShieldAlert className="h-4 w-4 text-destructive" />
            High-Risk Cases requiring attention
          </h2>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-secondary/60 text-[11px] uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="text-left font-semibold px-5 py-3">Case</th>
              <th className="text-left font-semibold px-5 py-3">Risk Score</th>
              <th className="text-left font-semibold px-5 py-3">Drivers</th>
              <th className="text-right font-semibold px-5 py-3">Amount</th>
              <th className="w-24" />
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {highRisk.map((c) => (
              <tr key={c.id} className="hover:bg-secondary/30">
                <td className="px-5 py-3.5">
                  <div className="font-semibold">{c.title}</div>
                  <div className="text-xs text-muted-foreground">#{c.id} · {c.party}</div>
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-2 rounded-full bg-secondary overflow-hidden">
                      <div className="h-full bg-destructive" style={{ width: `${c.riskScore}%` }} />
                    </div>
                    <span className="text-xs font-bold tabular-nums">{c.riskScore}</span>
                  </div>
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex flex-wrap gap-1">
                    <span className="rounded bg-secondary px-1.5 py-0.5 text-[10px] font-semibold text-muted-foreground">
                      Missing evidence
                    </span>
                    <span className="rounded bg-secondary px-1.5 py-0.5 text-[10px] font-semibold text-muted-foreground">
                      Near hearing
                    </span>
                  </div>
                </td>
                <td className="px-5 py-3.5 text-right font-semibold tabular-nums">{c.amount}</td>
                <td className="px-5 py-3.5 text-right">
                  <Link
                    to="/cases/$caseId"
                    params={{ caseId: c.id }}
                    className="text-xs font-semibold text-primary hover:underline"
                  >
                    Review →
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/legal/PageHeader";
import { RiskBadge } from "@/components/legal/RiskBadge";
import { casesList, riskDistribution } from "@/lib/mock-data";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";
import { ShieldAlert, TrendingUp, Flame, AlertTriangle, CheckCircle2, X } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getCases } from "@/lib/api";
import { getUser } from "@/lib/auth";

export const Route = createFileRoute("/risk")({
  component: RiskPage,
});

function RiskPage() {
  const user = getUser();
  const isDemo = user?.id === "demo";

  const { data: casesData } = useQuery({
    queryKey: ["risk-cases"],
    queryFn: getCases,
  });
  const cases = casesData || [];

  const activeCases = isDemo ? casesList : cases;
  const highRisk = activeCases.filter((c: any) => c.risk === "High");
  const mediumRisk = activeCases.filter((c: any) => c.risk === "Medium");
  const lowRisk = activeCases.filter((c: any) => c.risk === "Low" || !c.risk);
  const totalCases = activeCases.length;

  const dynamicRiskDist = isDemo ? riskDistribution : [
    { level: "High", count: highRisk.length, color: "var(--destructive)" },
    { level: "Medium", count: mediumRisk.length, color: "var(--warning)" },
    { level: "Low", count: lowRisk.length, color: "var(--success)" },
  ];

  const [patternOpen, setPatternOpen] = useState(false);

  return (
    <div className="mx-auto max-w-[1500px] p-4 md:p-8">
      <PageHeader
        eyebrow="Risk Intelligence"
        title="Portfolio Risk Overview"
        description={`Real-time risk scoring across ${totalCases} active matters. Drill into what's driving exposure and where to intervene first.`}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <div className="card-elevated p-6">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Risk Distribution
          </div>
          <div className="h-52 mt-2">
            {totalCases > 0 ? (
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={dynamicRiskDist}
                    dataKey="count"
                    nameKey="level"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={3}
                    stroke="none"
                  >
                    {dynamicRiskDist.map((d) => (
                      <Cell key={d.level} fill={d.color} />
                    ))}
                  </Pie>
                  <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
                No cases to analyze
              </div>
            )}
          </div>
        </div>

        <div className="card-elevated p-6">
          <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-destructive">
            <Flame className="h-3.5 w-3.5" /> Top Exposure
          </div>
          <div className="mt-2 text-3xl font-bold text-foreground tabular-nums">
            {highRisk.length > 0 ? `${highRisk.length} cases` : "None"}
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            High-risk cases requiring attention
          </div>
          <div className="mt-5 space-y-3">
            {highRisk.length > 0 ? highRisk.slice(0, 3).map((c: any, i: number) => (
              <div key={i}>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground truncate">{c.title}</span>
                  <span className="font-semibold tabular-nums shrink-0">
                    {c.amount || c.money || "—"}
                  </span>
                </div>
                <div className="mt-1 h-1.5 rounded-full bg-secondary overflow-hidden">
                  <div
                    className="h-full bg-destructive"
                    style={{ width: `${c.riskScore || 85}%` }}
                  />
                </div>
              </div>
            )) : (
              <div className="text-xs text-muted-foreground">No high-risk cases detected.</div>
            )}
          </div>
        </div>

        {totalCases > 0 && (
          <div className="card-elevated p-6 hero-gradient text-primary-foreground">
            <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-accent">
              <TrendingUp className="h-3.5 w-3.5" /> AI Risk Signal
            </div>
            <div className="mt-2 text-lg font-bold">
              {highRisk.length > 0 ? "High-risk cases detected" : "Portfolio looks healthy"}
            </div>
            <p className="mt-2 text-sm text-primary-foreground/75">
              {highRisk.length > 0
                ? `${highRisk.length} case(s) scored above risk threshold. Review missing evidence and upcoming deadlines.`
                : "No elevated risk signals. Continue monitoring."}
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
                  Pattern Analysis
                </div>
                <div className="space-y-2 text-xs text-white/80">
                  <p>High: {highRisk.length} cases · Medium: {mediumRisk.length} cases · Low: {lowRisk.length} cases</p>
                  <p>AI continuously monitors your portfolio for emerging risk patterns.</p>
                </div>
                <Link
                  to="/cases"
                  className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-accent hover:underline"
                >
                  View all cases →
                </Link>
              </div>
            )}
          </div>
        )}
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
            {highRisk.length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-10 text-center text-muted-foreground">
                  No high-risk cases detected. Your portfolio is in good health!
                </td>
              </tr>
            )}
            {highRisk.map((c: any) => (
              <tr key={c.id || c._id} className="hover:bg-secondary/30">
                <td className="px-5 py-3.5">
                  <div className="font-semibold">{c.title}</div>
                  <div className="text-xs text-muted-foreground">#{(c.id || c._id || "").toString().slice(-5)} · {c.party || c.case_type || "—"}</div>
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-2 rounded-full bg-secondary overflow-hidden">
                      <div className="h-full bg-destructive" style={{ width: `${c.riskScore || 85}%` }} />
                    </div>
                    <span className="text-xs font-bold tabular-nums">{c.riskScore || 85}</span>
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
                <td className="px-5 py-3.5 text-right font-semibold tabular-nums">{c.amount || c.money || "—"}</td>
                <td className="px-5 py-3.5 text-right">
                  <Link
                    to="/cases/$caseId"
                    params={{ caseId: (c.id || c._id || "").toString() }}
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

import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Briefcase,
  AlertOctagon,
  Gavel,
  ClipboardList,
  ArrowRight,
  Clock,
  Sparkles,
  TrendingUp,
  Heart,
  GitCompare,
  FileSearch,
  Calendar,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

import { PageHeader } from "@/components/legal/PageHeader";
import { StatCard } from "@/components/legal/StatCard";
import { PriorityBadge } from "@/components/legal/RiskBadge";
import {
  overviewStats,
  priorityActions,
  riskDistribution,
  caseloadTrend,
  aiInsights,
  priorityCases,
} from "@/lib/mock-data";
import { demo, demoOk } from "@/lib/demo-actions";

export const Route = createFileRoute("/")({
  component: Dashboard,
});

const icons = [Briefcase, AlertOctagon, Gavel, ClipboardList, Heart, Sparkles];

function Dashboard() {
  return (
    <div className="mx-auto max-w-[1600px] p-4 md:p-8">
      <PageHeader
        eyebrow="Good morning, Anita"
        title="Legal Operations Command Center"
        description="Your team's workload, risk exposure and next-best actions — synthesized from every document ingested today."
        actions={
          <>
            <button
              onClick={() => demo("Time range: Last 7 days", "Switch range: 24h · 7d · 30d · Quarter")}
              className="hidden sm:inline-flex h-9 items-center gap-2 rounded-lg border border-border bg-background px-3.5 text-sm font-medium hover:bg-secondary transition-colors"
            >
              <Clock className="h-4 w-4" />
              Last 7 days
            </button>
            <button
              onClick={() => demoOk("Ask LegalOS", "Nova Legal LLM is ready. Type a question or paste a document.")}
              className="inline-flex h-9 items-center gap-2 rounded-lg bg-primary px-3.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity"
            >
              <Sparkles className="h-4 w-4" />
              Ask LegalOS
            </button>
          </>
        }
      />

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {overviewStats.map((s, i) => (
          <StatCard
            key={s.label}
            label={s.label}
            value={s.value}
            delta={s.delta}
            icon={icons[i]}
            tone={s.tone}
          />
        ))}
      </div>

      {/* AI Insights Summary Banner */}
      <section className="mt-6 overflow-hidden rounded-xl border border-border hero-gradient text-primary-foreground shadow-lg">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/20">
              <Sparkles className="h-5 w-5 text-accent" />
            </div>
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold tracking-tight">AI Intelligence Summary</h2>
              <span className="inline-flex items-center rounded-full bg-accent/20 px-2.5 py-0.5 text-[11px] font-semibold text-accent">
                Live
              </span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {aiInsights.map((insight, i) => {
              const InsightIcon =
                insight.icon === "alert"
                  ? AlertOctagon
                  : insight.icon === "evidence"
                    ? FileSearch
                    : insight.icon === "hearing"
                      ? Calendar
                      : GitCompare;
              return (
                <div
                  key={i}
                  className="flex items-start gap-3 rounded-lg border-l-2 border-white/20 bg-white/5 p-4 transition-colors hover:bg-white/10"
                >
                  <InsightIcon className="mt-0.5 h-4.5 w-4.5 shrink-0 text-accent" />
                  <p className="text-sm leading-relaxed text-primary-foreground/90">
                    {insight.text}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Hero: Priority Actions */}
      <section className="mt-6 overflow-hidden rounded-xl border border-border hero-gradient text-primary-foreground shadow-lg">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 p-6 border-b border-white/10">
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-widest text-primary-foreground/70">
              <Sparkles className="h-3.5 w-3.5 text-accent" />
              Action Center
            </div>
            <h2 className="mt-1 text-xl md:text-2xl font-bold tracking-tight">
              Today's Priority Actions
            </h2>
            <p className="mt-1 text-sm text-primary-foreground/70">
              8 items surfaced from 34 pending actions, ranked by hearing dates and risk score.
            </p>
          </div>
          <Link
            to="/actions"
            className="hidden md:inline-flex shrink-0 h-9 items-center gap-1.5 rounded-lg bg-accent px-3.5 text-sm font-semibold text-accent-foreground hover:opacity-90 transition-opacity"
          >
            View all
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="divide-y divide-white/10">
          {priorityActions.map((a) => (
            <div
              key={a.id}
              className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_auto] items-center gap-4 p-5 hover:bg-white/5 transition-colors"
            >
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1.5">
                  <PriorityBadge priority={a.priority} />
                  <span className="text-[11px] text-primary-foreground/60">
                    {a.caseNo} · {a.caseTitle}
                  </span>
                </div>
                <div className="font-semibold text-primary-foreground truncate">
                  {a.title}
                </div>
                <div className="mt-0.5 text-sm text-primary-foreground/70">
                  {a.action}
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <div className="text-right hidden sm:block">
                  <div className="text-[10px] uppercase tracking-wider text-primary-foreground/50">
                    Due
                  </div>
                  <div className="text-xs font-semibold text-primary-foreground">
                    {a.due}
                  </div>
                </div>
                <Link
                  to="/cases/$caseId"
                  params={{ caseId: "10245" }}
                  className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-primary-foreground/10 border border-white/15 px-3 text-xs font-semibold text-primary-foreground hover:bg-primary-foreground/20 transition-colors"
                >
                  Open Case
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Priority Cases — Ranked by AI Risk Score */}
      <section className="mt-6 card-elevated overflow-hidden">
        <div className="flex items-center justify-between gap-3 border-b border-border p-6 pb-4">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              AI-Ranked
            </div>
            <h3 className="mt-0.5 text-lg font-bold text-foreground">
              Priority Cases — Ranked by AI Risk Score
            </h3>
          </div>
          <Link
            to="/cases"
            className="hidden sm:inline-flex h-9 items-center gap-1.5 rounded-lg border border-border bg-background px-3.5 text-sm font-medium hover:bg-secondary transition-colors"
          >
            View all
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="divide-y divide-border">
          {priorityCases.map((c, i) => {
            const barColor =
              c.riskScore >= 90
                ? "bg-destructive"
                : c.riskScore >= 80
                  ? "bg-orange-500"
                  : "bg-warning";
            const textColor =
              c.riskScore >= 90
                ? "text-destructive"
                : c.riskScore >= 80
                  ? "text-orange-500"
                  : "text-warning";
            return (
              <Link
                key={c.id}
                to="/cases/$caseId"
                params={{ caseId: c.id }}
                className="grid grid-cols-1 md:grid-cols-[auto_minmax(0,1fr)_200px_minmax(0,1fr)] items-center gap-4 p-5 hover:bg-secondary/50 transition-colors"
              >
                {/* Rank */}
                <div className="flex items-center gap-4">
                  <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full font-bold text-sm ${
                      i === 0
                        ? "bg-destructive/10 text-destructive"
                        : i === 1
                          ? "bg-orange-500/10 text-orange-500"
                          : "bg-warning/10 text-warning"
                    }`}
                  >
                    {i + 1}
                  </div>
                </div>

                {/* Case Info */}
                <div className="min-w-0">
                  <div className="font-semibold text-foreground truncate">{c.title}</div>
                  <div className="text-xs text-muted-foreground">Case #{c.id}</div>
                </div>

                {/* Risk Score Bar */}
                <div className="flex items-center gap-3">
                  <div className="relative h-2 w-full rounded-full bg-muted overflow-hidden">
                    <div
                      className={`absolute inset-y-0 left-0 rounded-full ${barColor}`}
                      style={{ width: `${c.riskScore}%` }}
                    />
                  </div>
                  <span className={`text-sm font-bold tabular-nums ${textColor}`}>
                    {c.riskScore}%
                  </span>
                </div>

                {/* Reason + Amount */}
                <div className="text-right">
                  <div className="text-sm text-muted-foreground truncate">{c.reason}</div>
                  <div className="text-sm font-semibold text-foreground">{c.amount}</div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Risk + Trend */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="card-elevated p-6 lg:col-span-1">
          <div className="flex items-start justify-between gap-3 mb-4">
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Risk Overview
              </div>
              <h3 className="mt-0.5 text-lg font-bold text-foreground">
                Risk Distribution
              </h3>
            </div>
            <span className="rounded-md bg-secondary px-2 py-0.5 text-[11px] font-medium text-secondary-foreground">
              248 cases
            </span>
          </div>
          <div className="h-44">
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={riskDistribution}
                  dataKey="count"
                  nameKey="level"
                  innerRadius={48}
                  outerRadius={70}
                  paddingAngle={3}
                  stroke="none"
                >
                  {riskDistribution.map((d) => (
                    <Cell key={d.level} fill={d.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 space-y-2">
            {riskDistribution.map((r) => (
              <div key={r.level} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span
                    className="h-2.5 w-2.5 rounded-sm"
                    style={{ backgroundColor: r.color }}
                  />
                  <span className="text-foreground font-medium">{r.level}</span>
                </div>
                <div className="tabular-nums">
                  <span className="font-semibold text-foreground">{r.count}</span>
                  <span className="ml-1 text-muted-foreground">
                    ({Math.round((r.count / 248) * 100)}%)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card-elevated p-6 lg:col-span-2">
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3 mb-4">
            <div className="min-w-0">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Caseload Trend
              </div>
              <h3 className="mt-0.5 text-lg font-bold text-foreground">
                Opened vs. Closed — last 6 months
              </h3>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-success shrink-0">
              <TrendingUp className="h-3.5 w-3.5" />
              +14% throughput
            </div>
          </div>
          <div className="h-56">
            <ResponsiveContainer>
              <BarChart data={caseloadTrend} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
                  tickLine={false}
                  axisLine={false}
                  width={30}
                />
                <Tooltip
                  cursor={{ fill: "var(--muted)", opacity: 0.4 }}
                  contentStyle={{
                    background: "var(--popover)",
                    border: "1px solid var(--border)",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="opened" fill="var(--primary)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="closed" fill="var(--accent)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-3 flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-sm bg-primary" />
              <span className="text-muted-foreground">Opened</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-sm bg-accent" />
              <span className="text-muted-foreground">Closed</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

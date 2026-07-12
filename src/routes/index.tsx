import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
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
  X,
  Send,
  Bot,
  User,
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

import { useState, useEffect, useRef } from "react";
import { PageHeader } from "@/components/legal/PageHeader";
import { StatCard } from "@/components/legal/StatCard";
import { PriorityBadge } from "@/components/legal/RiskBadge";
import { getCases, queryChat } from "@/lib/api";
import {
  overviewStats as mockStats,
  priorityActions,
  riskDistribution,
  caseloadTrend,
  aiInsights,
  priorityCases as mockCases,
} from "@/lib/mock-data";
import { demo } from "@/lib/demo-actions";
import { getUser } from "@/lib/auth";

export const Route = createFileRoute("/")({
  component: Dashboard,
});

const icons = [Briefcase, AlertOctagon, Gavel, ClipboardList, Heart, Sparkles];

function Dashboard() {
  const navigate = useNavigate();
  const user = getUser();
  const firstName = user?.name ? user.name.split(" ")[0] : "Anita";

  const { data: casesData, isLoading: loading } = useQuery({
    queryKey: ["dashboard-cases"],
    queryFn: getCases,
    refetchInterval: 5000, // Auto-refresh every 5 seconds
    staleTime: 0,
  });
  const cases = casesData || [];

  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<{role: "user"|"ai", text: string}[]>([
    { role: "ai", text: "Hello! I'm your LegalOS AI assistant powered by Gemma-2. Ask me anything about your cases, legal strategy, or document analysis." }
  ]);
  const [chatLoading, setChatLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  const sendChat = async () => {
    const msg = chatInput.trim();
    if (!msg) return;
    setChatInput("");
    const newMessages = [...chatMessages, { role: "user", text: msg } as {role: "user"|"ai", text: string}];
    setChatMessages(newMessages);
    setChatLoading(true);
    try {
      const res = await queryChat(newMessages);
      setChatMessages([...newMessages, { role: "ai", text: res.response || "Unable to get response." }]);
    } catch {
      setChatMessages([...newMessages, { role: "ai", text: "AI engine temporarily unavailable. Please try again." }]);
    }
    setChatLoading(false);
  };

  const isDemo = user?.id === "demo";
  const displayedCases = cases.length > 0 ? cases : (isDemo ? mockCases : []);
  const displayedActions = isDemo ? priorityActions : [];

  const totalCases = cases.length;
  const highRisk = cases.filter(c => c.risk === "High").length;
  const avgHealth = cases.length > 0 
    ? Math.round(cases.reduce((sum, c) => sum + (c.health_score || 75), 0) / cases.length) 
    : 0;

  const dynamicStats = [
    { label: "Total Active Cases", value: totalCases, delta: "+12 this week", tone: "info" as const },
    { label: "High Risk Matters", value: highRisk, delta: "+4 newly flagged", tone: "destructive" as const },
    { label: "Average Health Score", value: `${avgHealth}%`, delta: "+2.4% vs last month", tone: "success" as const },
  ];

  // Dynamic Risk Distribution
  const highCount = cases.filter(c => c.risk === "High").length;
  const mediumCount = cases.filter(c => c.risk === "Medium").length;
  const lowCount = cases.filter(c => c.risk === "Low" || !c.risk).length;
  const totalRiskCount = isDemo ? 248 : cases.length;

  const dynamicRiskDistribution = isDemo ? riskDistribution : [
    { level: "High", count: highCount, color: "var(--destructive)" },
    { level: "Medium", count: mediumCount, color: "var(--warning)" },
    { level: "Low", count: lowCount, color: "var(--success)" },
  ];

  return (
    <div className="mx-auto max-w-[1600px] p-4 md:p-8">
      {/* ─── Ask LegalOS Chat Modal ─── */}
      {chatOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-end p-4 sm:p-6 pointer-events-none">
          <div className="pointer-events-auto w-full max-w-md flex flex-col rounded-2xl border border-border bg-background shadow-2xl" style={{height: "480px"}}>
            {/* Header */}
            <div className="flex items-center gap-3 border-b border-border px-4 py-3 shrink-0">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <Sparkles className="h-4 w-4 text-primary-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-bold text-foreground">Ask LegalOS</div>
                <div className="text-[11px] text-muted-foreground">Powered by Gemma-2 on AMD Instinct™ MI300X</div>
              </div>
              <button onClick={() => setChatOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X className="h-4 w-4" />
              </button>
            </div>
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {chatMessages.map((m, i) => (
                <div key={i} className={`flex gap-2 ${m.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                  <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${m.role === "user" ? "bg-primary" : "bg-secondary"}` }>
                    {m.role === "user" ? <User className="h-3.5 w-3.5 text-primary-foreground" /> : <Bot className="h-3.5 w-3.5 text-foreground" />}
                  </div>
                  <div className={`max-w-[80%] rounded-xl px-3 py-2 text-sm leading-relaxed ${ m.role === "user" ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground" }`}>
                    {m.text}
                  </div>
                </div>
              ))}
              {chatLoading && (
                <div className="flex gap-2">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-secondary">
                    <Bot className="h-3.5 w-3.5 text-foreground" />
                  </div>
                  <div className="bg-secondary rounded-xl px-3 py-2 text-sm text-muted-foreground">
                    Thinking...
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>
            {/* Input */}
            <div className="border-t border-border p-3 shrink-0">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={e => setChatInput(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && sendChat()}
                  placeholder="Ask about a case, risk, or document..."
                  className="flex-1 rounded-lg border border-border bg-secondary px-3 py-2 text-sm focus:outline-none focus:border-ring focus:ring-2 focus:ring-ring/20"
                />
                <button
                  onClick={sendChat}
                  disabled={chatLoading || !chatInput.trim()}
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground disabled:opacity-50"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <PageHeader
        eyebrow={`Good morning, ${firstName}`}
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
              onClick={() => setChatOpen(o => !o)}
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
        {dynamicStats.map((s, i) => (
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
      {displayedCases.length > 0 && (
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
      )}

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
          {displayedActions.length > 0 ? (
            displayedActions.map((a) => (
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
            ))
          ) : (
            <div className="p-8 text-center text-primary-foreground/50 text-sm">
              All caught up! No pending priority actions.
            </div>
          )}
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
          {displayedCases.length > 0 ? (
            displayedCases.map((c, i) => {
              const score = c.riskScore || (c.risk === "High" ? 87 : c.risk === "Medium" ? 54 : 32);
              const barColor =
                score >= 90
                  ? "bg-destructive"
                  : score >= 80
                    ? "bg-orange-500"
                    : "bg-warning";
              const textColor =
                score >= 90
                  ? "text-destructive"
                  : score >= 80
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
                        style={{ width: `${score}%` }}
                      />
                    </div>
                    <span className={`text-sm font-bold tabular-nums ${textColor}`}>
                      {score}%
                    </span>
                  </div>

                  {/* Reason + Amount */}
                  <div className="text-right">
                    <div className="text-sm text-muted-foreground truncate">{c.reason || "AI identified critical claim conflicts"}</div>
                    <div className="text-sm font-semibold text-foreground">{c.money || c.amount || "₹0"}</div>
                  </div>
                </Link>
              );
            })
          ) : (
            <div className="p-8 text-center text-muted-foreground text-sm">
              No active cases. Go to the Smart Inbox to upload documents and create a case!
            </div>
          )}
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
              {totalRiskCount} cases
            </span>
          </div>
          <div className="h-44">
            {totalRiskCount > 0 ? (
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={dynamicRiskDistribution}
                    dataKey="count"
                    nameKey="level"
                    innerRadius={48}
                    outerRadius={70}
                    paddingAngle={3}
                    stroke="none"
                  >
                    {dynamicRiskDistribution.map((d) => (
                      <Cell key={d.level} fill={d.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
                No data available
              </div>
            )}
          </div>
          <div className="mt-2 space-y-2">
            {dynamicRiskDistribution.map((r) => (
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
                    ({totalRiskCount > 0 ? Math.round((r.count / totalRiskCount) * 100) : 0}%)
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

import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/legal/PageHeader";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line,
  AreaChart,
  Area,
} from "recharts";
import {
  caseDistribution,
  evidenceCompletionData,
  resolutionTimeData,
  departmentPerformance,
  winLossData,
  caseloadTrend,
} from "@/lib/mock-data";
import { TrendingUp, Award, Clock, Scale, ArrowUpRight } from "lucide-react";

export const Route = createFileRoute("/reports")({
  component: ReportsPage,
});

function CustomTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border border-border bg-popover p-3 shadow-md text-xs">
        <p className="font-semibold text-foreground mb-1">{label}</p>
        {payload.map((p: any) => (
          <p key={p.name} className="flex items-center gap-2 text-muted-foreground font-medium">
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: p.fill || p.color }} />
            <span className="text-foreground capitalize">{p.name}:</span>
            <span className="font-bold text-foreground tabular-nums">{p.value}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
}

function ReportsPage() {
  return (
    <div className="mx-auto max-w-[1600px] p-4 md:p-8 space-y-6">
      <PageHeader
        eyebrow="Reports"
        title="Executive Intelligence Dashboard"
        description="Board-ready metrics on legal department performance, win ratios, caseload velocity, and portfolio exposure."
      />

      {/* Top metrics grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Active Matters", value: "248", delta: "18 High Risk", desc: "Across all product lines", icon: Scale, color: "text-primary bg-primary/10" },
          { label: "Case Win Ratio", value: "82.4%", delta: "↑ 2.1% MoM", desc: "Judicial outcomes & settlements", icon: Award, color: "text-success bg-success/10" },
          { label: "Avg Resolution Time", value: "105 Days", delta: "↓ 12 Days", desc: "From filing to final order", icon: Clock, color: "text-info bg-info/10" },
          { label: "Total Exposure Managed", value: "₹8.4 Cr", delta: "+₹42.8L today", desc: "Aggregate active claims risk", icon: TrendingUp, color: "text-warning bg-warning/15" },
        ].map((m, idx) => (
          <div key={idx} className="card-elevated p-5 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  {m.label}
                </div>
                <div className="mt-2 text-3xl font-extrabold tracking-tight text-foreground tabular-nums">
                  {m.value}
                </div>
                <div className="mt-1.5 flex items-center gap-1 text-xs">
                  <span className={idx === 2 ? "text-success font-semibold" : idx === 1 ? "text-success font-semibold" : "text-muted-foreground font-semibold"}>{m.delta}</span>
                  <span className="text-muted-foreground/75">· {m.desc}</span>
                </div>
              </div>
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${m.color}`}>
                <m.icon className="h-5 w-5" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Case Distribution */}
        <div className="card-elevated p-6 flex flex-col justify-between">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Portfolio Share</div>
            <h3 className="mt-0.5 text-lg font-bold text-foreground mb-4">Case Distribution by Category</h3>
          </div>
          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={caseDistribution}
                  dataKey="count"
                  nameKey="category"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={4}
                  stroke="none"
                >
                  {caseDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend layout="horizontal" verticalAlign="bottom" align="center" iconType="circle" wrapperStyle={{ fontSize: 12, paddingTop: 10 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Win / Loss / Settlement Ratio */}
        <div className="card-elevated p-6 flex flex-col justify-between">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Matters Output</div>
            <h3 className="mt-0.5 text-lg font-bold text-foreground mb-4">Litigation Win / Loss Outcomes</h3>
          </div>
          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={winLossData}
                  dataKey="count"
                  nameKey="outcome"
                  cx="50%"
                  cy="50%"
                  innerRadius={0}
                  outerRadius={85}
                  paddingAngle={2}
                  stroke="none"
                >
                  {winLossData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend layout="horizontal" verticalAlign="bottom" align="center" iconType="circle" wrapperStyle={{ fontSize: 12, paddingTop: 10 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Evidence Completion Progress */}
        <div className="card-elevated p-6 flex flex-col justify-between">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Evidence Readiness</div>
            <h3 className="mt-0.5 text-lg font-bold text-foreground mb-4">Evidence Completeness Score Trend</h3>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={evidenceCompletionData}>
                <defs>
                  <linearGradient id="colorCompletion" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} tickLine={false} axisLine={false} />
                <YAxis domain={[50, 100]} tickFormatter={(val) => `${val}%`} tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} tickLine={false} axisLine={false} width={35} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="completion" name="Completeness" stroke="var(--primary)" strokeWidth={2} fillOpacity={1} fill="url(#colorCompletion)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Caseload velocity (Avg resolution days) */}
        <div className="card-elevated p-6 flex flex-col justify-between">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Caseload Velocity</div>
            <h3 className="mt-0.5 text-lg font-bold text-foreground mb-4">Average Days to Resolution Trend</h3>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={resolutionTimeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} tickLine={false} axisLine={false} />
                <YAxis tickFormatter={(val) => `${val}d`} tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} tickLine={false} axisLine={false} width={30} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="days" name="Avg Days" stroke="var(--info)" strokeWidth={2.5} dot={{ r: 4, strokeWidth: 2, fill: "var(--background)" }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Caseload Trend (Opened vs Closed) */}
        <div className="card-elevated p-6 flex flex-col justify-between">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Throughput</div>
            <h3 className="mt-0.5 text-lg font-bold text-foreground mb-4">Opened vs. Closed Cases Trend</h3>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={caseloadTrend} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} tickLine={false} axisLine={false} width={25} />
                <Tooltip content={<CustomTooltip />} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 12, paddingTop: 5 }} />
                <Bar dataKey="opened" name="Opened" fill="var(--primary)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="closed" name="Closed" fill="var(--accent)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Department Performance */}
        <div className="card-elevated p-6 flex flex-col justify-between">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Department Performance</div>
            <h3 className="mt-0.5 text-lg font-bold text-foreground mb-4">Claims Resolution and Efficiency Index</h3>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={departmentPerformance} layout="vertical" barSize={10}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} tickLine={false} axisLine={false} />
                <YAxis type="category" dataKey="department" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} tickLine={false} axisLine={false} width={80} />
                <Tooltip content={<CustomTooltip />} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 12, paddingTop: 5 }} />
                <Bar dataKey="resolved" name="Resolved Cases" fill="var(--success)" radius={[0, 4, 4, 0]} />
                <Bar dataKey="pending" name="Pending Cases" fill="var(--warning)" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* PDF Export Banner */}
      <div className="rounded-xl border border-border bg-card p-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="font-bold text-foreground">Schedule Automatic Reports</h4>
          <p className="text-xs text-muted-foreground mt-0.5">
            Deliver executive summary PDF reports directly to board members and claims heads weekly or monthly.
          </p>
        </div>
        <button
          onClick={() => demoOk("Reports Scheduled", "Weekly PDF briefing scheduled to board members.")}
          className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-primary px-4 text-xs font-semibold text-primary-foreground hover:opacity-90 active:scale-[0.98] transition-all shrink-0"
        >
          <ArrowUpRight className="h-4 w-4" />
          Schedule Export
        </button>
      </div>
    </div>
  );
}

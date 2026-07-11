import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/legal/PageHeader";
import { StatusPill } from "@/components/legal/RiskBadge";
import { settingsUsers, settingsIntegrations } from "@/lib/mock-data";
import { demo, demoOk, demoWarn } from "@/lib/demo-actions";
import {
  Users,
  Shield,
  Sparkles,
  Bell,
  Settings2,
  Plus,
  Mail,
  UserPlus,
  ExternalLink,
  Info,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/settings")({
  component: SettingsPage,
});

const TABS = [
  { id: "users", label: "Users & Teams", icon: Users },
  { id: "roles", label: "Roles & Permissions", icon: Shield },
  { id: "ai", label: "AI Configuration", icon: Sparkles },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "integrations", label: "Integrations", icon: Settings2 },
] as const;

type TabId = (typeof TABS)[number]["id"];

function SettingsPage() {
  const [activeTab, setActiveTab] = useState<TabId>("users");
  const [threshold, setThreshold] = useState(75);
  const [autoClassify, setAutoClassify] = useState(true);
  const [sensitivity, setSensitivity] = useState("Medium");

  const [notificationRules, setNotificationRules] = useState({
    hearing: true,
    evidence: true,
    deadline: true,
    risk: false,
    ingest: true,
    digest: true,
  });

  return (
    <div className="mx-auto max-w-[1400px] p-4 md:p-8 space-y-6">
      <PageHeader eyebrow="Settings" title="Workspace Settings" description="Manage workspace team members, AI operational rules, data integrations, and notification channels." />

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Navigation Tabs */}
        <aside className="w-full lg:w-64 shrink-0 flex flex-row lg:flex-col overflow-x-auto lg:overflow-x-visible border-b lg:border-b-0 lg:border-r border-border pb-4 lg:pb-0 lg:pr-6 gap-1">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-sm font-semibold whitespace-nowrap transition-colors w-full",
                  active
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                )}
              >
                <Icon className="h-4.5 w-4.5 shrink-0" />
                {tab.label}
              </button>
            );
          })}
        </aside>

        {/* Content Panel */}
        <div className="flex-1 min-w-0">
          {activeTab === "users" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between gap-3 border-b border-border pb-4 flex-wrap">
                <div>
                  <h3 className="text-lg font-bold text-foreground">Users & Members</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">Manage access roles and invite new members to this workspace.</p>
                </div>
                <button
                  onClick={() => demoOk("Invite Dialog Opened", "Send email invite to teammates.")}
                  className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-primary px-3.5 text-xs font-semibold text-primary-foreground hover:opacity-90 active:scale-[0.98] transition-all"
                >
                  <UserPlus className="h-4 w-4" />
                  Invite Member
                </button>
              </div>

              <div className="card-elevated overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-secondary/50 text-[11px] uppercase tracking-wider text-muted-foreground">
                      <tr>
                        <th className="text-left font-semibold px-5 py-3">Member</th>
                        <th className="text-left font-semibold px-5 py-3">Email</th>
                        <th className="text-left font-semibold px-5 py-3">Role</th>
                        <th className="text-left font-semibold px-5 py-3">Status</th>
                        <th className="text-left font-semibold px-5 py-3">Last Active</th>
                        <th className="w-20" />
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {settingsUsers.map((u) => (
                        <tr key={u.email} className="hover:bg-secondary/35">
                          <td className="px-5 py-3.5 font-medium text-foreground">
                            <div className="flex items-center gap-2">
                              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold uppercase">
                                {u.name.split(" ").map((n) => n[0]).join("")}
                              </div>
                              {u.name}
                            </div>
                          </td>
                          <td className="px-5 py-3.5 text-muted-foreground">{u.email}</td>
                          <td className="px-5 py-3.5">
                            <span className="inline-flex items-center rounded-md bg-secondary px-2 py-0.5 text-[11px] font-semibold text-foreground">
                              {u.role}
                            </span>
                          </td>
                          <td className="px-5 py-3.5">
                            <StatusPill status={u.status} tone={u.status === "Active" ? "success" : "neutral"} />
                          </td>
                          <td className="px-5 py-3.5 text-muted-foreground">{u.lastActive}</td>
                          <td className="px-5 py-3.5 text-right">
                            <button
                              onClick={() => demo(`Editing user: ${u.name}`, `Modify roles or revoke access.`)}
                              className="text-xs font-semibold text-primary hover:underline"
                            >
                              Edit
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === "roles" && (
            <div className="space-y-6">
              <div className="border-b border-border pb-4">
                <h3 className="text-lg font-bold text-foreground">Roles & Permissions</h3>
                <p className="text-xs text-muted-foreground mt-0.5">Define functional authorization layers across the command center.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    role: "Admin (Legal Ops Head)",
                    desc: "Full administrative controls across settings, AI thresholds, integrations, and user profiles.",
                    permissions: ["Manage Users", "Edit AI Rules", "Approve Outbound Action Drafts", "Export Board Reports", "Write Case Notes"],
                  },
                  {
                    role: "Counsel (In-House Lawyers)",
                    desc: "Review case workspaces, prepare legal briefs, add notes, and approve outbound actions.",
                    permissions: ["Approve Outbound Action Drafts", "Export Board Reports", "Write Case Notes", "View Reports", "Edit Case Workspaces"],
                  },
                  {
                    role: "Claims Officer",
                    desc: "Ingest case documents, verify checklist evidence items, coordinate with external surveyors.",
                    permissions: ["Upload Documents", "Update Evidence Checklists", "Request Evidence", "Write Case Notes", "Edit Case Workspaces"],
                  },
                  {
                    role: "External Retainer",
                    desc: "Restricted case-by-case view only. Can submit assigned documents and add notes.",
                    permissions: ["Upload Assigned Evidence", "Write Case Notes", "View Assigned Cases"],
                  },
                ].map((r, idx) => (
                  <div key={idx} className="card-elevated p-5 space-y-4">
                    <div>
                      <h4 className="font-bold text-foreground">{r.role}</h4>
                      <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{r.desc}</p>
                    </div>
                    <div className="space-y-1.5 pt-2 border-t border-border">
                      <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">Granted Scopes</div>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {r.permissions.map((p) => (
                          <span
                            key={p}
                            className="inline-flex items-center gap-1 rounded bg-success/5 border border-success/15 px-2 py-0.5 text-[10px] font-medium text-success"
                          >
                            <CheckCircle2 className="h-2.5 w-2.5" />
                            {p}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "ai" && (
            <div className="space-y-6">
              <div className="border-b border-border pb-4">
                <h3 className="text-lg font-bold text-foreground">AI Operational Configuration</h3>
                <p className="text-xs text-muted-foreground mt-0.5">Control LLM extraction behaviors, risk calculations, and trust thresholds.</p>
              </div>

              <div className="card-elevated p-6 space-y-6">
                {/* Active Model */}
                <div className="flex items-start justify-between gap-4 flex-wrap pb-6 border-b border-border">
                  <div className="space-y-1">
                    <div className="text-[11px] font-semibold uppercase tracking-widest text-primary flex items-center gap-1.5">
                      <Sparkles className="h-3.5 w-3.5 text-accent" />
                      Active Intelligence Engine
                    </div>
                    <h4 className="font-bold text-foreground">Gemma-2 · Fireworks AI</h4>
                    <p className="text-xs text-muted-foreground">
                      Trained on 2.4M insurance disputes and Indian consumer/civil court judgments.
                    </p>
                  </div>
                  <button
                    onClick={() => demo("Model Selection", "Change LLM model versions or switch to custom fine-tuned weights.")}
                    className="inline-flex h-8 items-center gap-1 rounded-md border border-border bg-background px-3 text-xs font-semibold hover:bg-secondary"
                  >
                    Change Model
                  </button>
                </div>

                {/* Classification Toggle */}
                <div className="flex items-center justify-between gap-4 pb-6 border-b border-border">
                  <div>
                    <h4 className="font-bold text-foreground">Auto-Classification Pipeline</h4>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Automatically categorize uploaded PDFs (e.g. notices, claims) and map them to existing cases.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setAutoClassify(!autoClassify);
                      demoOk(`Auto-Classification: ${!autoClassify ? "Enabled" : "Disabled"}`);
                    }}
                    className={cn(
                      "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none",
                      autoClassify ? "bg-primary" : "bg-muted"
                    )}
                  >
                    <span
                      className={cn(
                        "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-background shadow ring-0 transition duration-200 ease-in-out",
                        autoClassify ? "translate-x-5" : "translate-x-0"
                      )}
                    />
                  </button>
                </div>

                {/* Confidence Slider */}
                <div className="space-y-3 pb-6 border-b border-border">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-bold text-foreground">AI Confidence Cut-off</h4>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Minimum classification confidence required to skip human inbox review (auto-route).
                      </p>
                    </div>
                    <span className="text-sm font-bold text-primary tabular-nums bg-secondary px-2.5 py-0.5 rounded-md border border-border">
                      {threshold}%
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <input
                      type="range"
                      min="50"
                      max="95"
                      value={threshold}
                      onChange={(e) => setThreshold(Number(e.target.value))}
                      className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-muted-foreground font-semibold">
                    <span>50% (High Auto-Ingestion Risk)</span>
                    <span>95% (Conservative Human Verification)</span>
                  </div>
                </div>

                {/* Risk Sensitivity */}
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h4 className="font-bold text-foreground">AI Risk Score Severity</h4>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Adjust how financial exposure and near-hearings weight overall portfolio risk scoring.
                    </p>
                  </div>
                  <select
                    value={sensitivity}
                    onChange={(e) => {
                      setSensitivity(e.target.value);
                      demoOk(`Risk Sensitivity: ${e.target.value}`);
                    }}
                    className="h-9 rounded-md border border-border bg-background px-3 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-ring/25"
                  >
                    <option value="Low">Low (Muted alerts)</option>
                    <option value="Medium">Medium (Balanced)</option>
                    <option value="High">High (Immediate triggers)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="space-y-6">
              <div className="border-b border-border pb-4">
                <h3 className="text-lg font-bold text-foreground">Notification Channels</h3>
                <p className="text-xs text-muted-foreground mt-0.5">Configure alerting channels for hearings, evidence gaps, and daily operations.</p>
              </div>

              <div className="card-elevated p-6 space-y-5">
                {[
                  { id: "hearing", title: "Upcoming Hearing Reminders", desc: "Alert 48 hours and 24 hours prior to scheduled court appearances." },
                  { id: "evidence", title: "Evidence checklist Gap Warnings", desc: "Flag cases where critical evidence is missing within 7 days of hearing." },
                  { id: "deadline", title: "Outbound Deadline Alerts", desc: "Trigger notifications for responses to legal notices due in less than 3 days." },
                  { id: "risk", title: "AI Risk Score Jumps", desc: "Notify when a case risk index jumps by more than 15% after document extraction." },
                  { id: "ingest", title: "New Document Ingestion", desc: "Email notifications when emails or scans are auto-added to cases." },
                  { id: "digest", title: "Daily Operational Summary", desc: "A morning board digest showing new active matters, alerts, and priority actions." },
                ].map((rule) => {
                  const active = notificationRules[rule.id as keyof typeof notificationRules];
                  return (
                    <div key={rule.id} className="flex items-start justify-between gap-4 pb-4 border-b border-border last:border-b-0 last:pb-0">
                      <div className="min-w-0">
                        <h4 className="font-semibold text-foreground text-sm">{rule.title}</h4>
                        <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{rule.desc}</p>
                      </div>
                      <button
                        onClick={() => {
                          setNotificationRules({ ...notificationRules, [rule.id]: !active });
                          demoOk(`Notification Alert Updated`);
                        }}
                        className={cn(
                          "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none",
                          active ? "bg-primary" : "bg-muted"
                        )}
                      >
                        <span
                          className={cn(
                            "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-background shadow ring-0 transition duration-200 ease-in-out",
                            active ? "translate-x-5" : "translate-x-0"
                          )}
                        />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === "integrations" && (
            <div className="space-y-6">
              <div className="border-b border-border pb-4">
                <h3 className="text-lg font-bold text-foreground">Integrations & Data Sources</h3>
                <p className="text-xs text-muted-foreground mt-0.5">Link legal emails, shared file storage, and CRM platforms to automate intake.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {settingsIntegrations.map((i) => {
                  const connected = i.status === "Connected";
                  return (
                    <div key={i.name} className="card-elevated p-5 flex flex-col justify-between space-y-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-secondary text-2xl">
                            {i.icon}
                          </div>
                          <div>
                            <h4 className="font-bold text-foreground">{i.name}</h4>
                            <p className="text-xs text-muted-foreground mt-0.5">{i.desc}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between pt-2 border-t border-border">
                        <div className="flex items-center gap-1.5 text-xs">
                          {connected ? (
                            <>
                              <span className="relative flex h-2 w-2">
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                              </span>
                              <span className="text-emerald-500 font-semibold">Active</span>
                            </>
                          ) : (
                            <span className="text-muted-foreground">Disconnected</span>
                          )}
                        </div>
                        <button
                          onClick={() => {
                            if (connected) {
                              demoWarn("Connection Disconnected", `Removed access to ${i.name}.`);
                            } else {
                              demoOk("Connection Authorized", `Authorized integrations to ${i.name}.`);
                            }
                          }}
                          className={cn(
                            "inline-flex h-8 items-center gap-1 rounded-md px-3 text-xs font-semibold border border-border transition-colors",
                            connected
                              ? "bg-background hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30"
                              : "bg-primary text-primary-foreground hover:opacity-90 border-transparent"
                          )}
                        >
                          {connected ? "Disconnect" : "Connect"}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

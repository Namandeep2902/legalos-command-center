import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/legal/PageHeader";
import { demo } from "@/lib/demo-actions";

const sections = [
  { title: "Organization", desc: "Nova Insurance Legal Ops · India" },
  { title: "Team members", desc: "12 seats · 3 admins · 9 analysts" },
  { title: "AI Preferences", desc: "Model: Nova Legal LLM · Confidence threshold: 75%" },
  { title: "Integrations", desc: "Outlook · Google Drive · CoreClaim CRM" },
  { title: "Data & Compliance", desc: "DPDP Act compliant · SOC 2 Type II" },
];

export const Route = createFileRoute("/settings")({
  component: () => (
    <div className="mx-auto max-w-[1000px] p-4 md:p-8">
      <PageHeader eyebrow="Settings" title="Workspace Settings" />
      <div className="space-y-4">
        {sections.map((s) => (
          <div key={s.title} className="card-elevated p-5 flex items-center justify-between">
            <div>
              <div className="font-semibold">{s.title}</div>
              <div className="text-sm text-muted-foreground mt-0.5">{s.desc}</div>
            </div>
            <button
              onClick={() => demo(`Manage · ${s.title}`, s.desc)}
              className="text-xs font-semibold text-primary hover:underline"
            >
              Manage
            </button>
          </div>
        ))}
      </div>
    </div>
  ),
});

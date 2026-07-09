import { createFileRoute, Link } from "@tanstack/react-router";
import { UploadCloud, FileText, Sparkles, CheckCircle2, Loader2, XCircle, ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/legal/PageHeader";
import { StatusPill } from "@/components/legal/RiskBadge";
import { inboxDocuments } from "@/lib/mock-data";
import { demo, demoOk } from "@/lib/demo-actions";

export const Route = createFileRoute("/inbox")({
  component: SmartInbox,
});

function SmartInbox() {
  return (
    <div className="mx-auto max-w-[1400px] p-4 md:p-8">
      <PageHeader
        eyebrow="Smart Inbox"
        title="Ingest, classify, and turn documents into cases"
        description="Drop legal notices, policy documents, court summons, and emails. LegalOS extracts entities, links parties, and drafts a case skeleton."
      />

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] gap-6">
        {/* Upload area */}
        <div className="card-elevated overflow-hidden">
          <div className="p-6 border-b border-border">
            <h2 className="text-lg font-bold">Upload legal documents</h2>
            <p className="text-sm text-muted-foreground mt-0.5">
              Supported: PDF · Scanned PDF (OCR) · Email attachments (.eml, .msg) · Images
            </p>
          </div>
          <div className="p-6">
            <label className="group relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-secondary/40 py-14 px-6 text-center cursor-pointer hover:border-primary/50 hover:bg-secondary/70 transition-colors">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary group-hover:scale-105 transition-transform">
                <UploadCloud className="h-7 w-7" />
              </div>
              <div className="mt-4 text-base font-semibold text-foreground">
                Drop files here or click to browse
              </div>
              <div className="mt-1 text-xs text-muted-foreground">
                Up to 50 MB per file · Batch uploads supported
              </div>
              <input
                type="file"
                multiple
                className="sr-only"
                onChange={(e) => {
                  const files = e.target.files;
                  if (files && files.length) {
                    demoOk(
                      `${files.length} file${files.length > 1 ? "s" : ""} queued`,
                      `Nova Legal LLM is extracting entities from ${files[0].name}${files.length > 1 ? " …" : ""}`,
                    );
                  }
                }}
              />
              <div className="mt-5 inline-flex h-9 items-center gap-1.5 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground">
                <UploadCloud className="h-4 w-4" />
                Choose files
              </div>
            </label>

            {/* AI pipeline status */}
            <div className="mt-6 rounded-lg border border-info/25 bg-info/5 p-4">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="h-4 w-4 text-info" />
                <span className="text-sm font-semibold text-foreground">
                  AI Processing — survey_report_scan.pdf
                </span>
              </div>
              <div className="space-y-2">
                {[
                  { label: "Extracting text (OCR)", state: "done" },
                  { label: "Identifying entities & parties", state: "done" },
                  { label: "Cross-referencing existing cases", state: "active" },
                  { label: "Creating case intelligence", state: "pending" },
                ].map((step) => (
                  <div key={step.label} className="flex items-center gap-2.5 text-sm">
                    {step.state === "done" && (
                      <CheckCircle2 className="h-4 w-4 text-success shrink-0" />
                    )}
                    {step.state === "active" && (
                      <Loader2 className="h-4 w-4 text-info shrink-0 animate-spin" />
                    )}
                    {step.state === "pending" && (
                      <div className="h-4 w-4 rounded-full border-2 border-border shrink-0" />
                    )}
                    <span
                      className={
                        step.state === "pending"
                          ? "text-muted-foreground"
                          : "text-foreground font-medium"
                      }
                    >
                      {step.label}
                    </span>
                    {step.state === "active" && (
                      <span className="ml-auto text-[11px] text-info font-semibold">
                        Analyzing…
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="space-y-4">
          <div className="card-elevated p-5">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              This Week
            </div>
            <div className="mt-3 grid grid-cols-2 gap-4">
              <div>
                <div className="text-2xl font-bold tabular-nums">142</div>
                <div className="text-xs text-muted-foreground">Documents</div>
              </div>
              <div>
                <div className="text-2xl font-bold tabular-nums">38</div>
                <div className="text-xs text-muted-foreground">Cases created</div>
              </div>
              <div>
                <div className="text-2xl font-bold tabular-nums text-success">96%</div>
                <div className="text-xs text-muted-foreground">Auto-processed</div>
              </div>
              <div>
                <div className="text-2xl font-bold tabular-nums">4.2s</div>
                <div className="text-xs text-muted-foreground">Avg. process time</div>
              </div>
            </div>
          </div>
          <div className="card-elevated p-5 bg-primary text-primary-foreground border-primary">
            <Sparkles className="h-5 w-5 text-accent" />
            <div className="mt-2 font-semibold">Nova Legal LLM</div>
            <div className="mt-1 text-xs text-primary-foreground/70">
              Trained on 2.4M insurance disputes and Indian consumer/civil court judgments.
              Confidence-scored on every extraction.
            </div>
          </div>
        </div>
      </div>

      {/* Documents table */}
      <div className="mt-6 card-elevated overflow-hidden">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 p-5 border-b border-border">
          <div className="min-w-0">
            <h2 className="text-lg font-bold">Recent Documents</h2>
            <p className="text-sm text-muted-foreground mt-0.5">Last 24 hours</p>
          </div>
          <button
            onClick={() => demo("Recent documents", "Showing last 24 hours. Extend range in Filters.")}
            className="text-xs font-semibold text-primary hover:underline shrink-0"
          >
            View all
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-secondary/50 text-[11px] uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="text-left font-semibold px-5 py-3">Document</th>
                <th className="text-left font-semibold px-5 py-3">Type</th>
                <th className="text-left font-semibold px-5 py-3">Uploaded</th>
                <th className="text-left font-semibold px-5 py-3">AI Status</th>
                <th className="text-left font-semibold px-5 py-3">Case</th>
                <th className="w-10" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {inboxDocuments.map((d) => (
                <tr key={d.id} className="hover:bg-secondary/30 transition-colors">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-secondary text-muted-foreground">
                        <FileText className="h-4 w-4" />
                      </div>
                      <span className="font-medium text-foreground truncate">
                        {d.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-muted-foreground">{d.type}</td>
                  <td className="px-5 py-3 text-muted-foreground">{d.uploaded}</td>
                  <td className="px-5 py-3">
                    {d.status === "Processed" && (
                      <StatusPill status="Processed" tone="success" />
                    )}
                    {d.status === "Processing" && (
                      <span className="inline-flex items-center gap-1.5 rounded-md border border-info/25 bg-info/10 px-2 py-0.5 text-[11px] font-medium text-info">
                        <Loader2 className="h-3 w-3 animate-spin" />
                        Analyzing…
                      </span>
                    )}
                    {d.status === "Failed" && (
                      <span className="inline-flex items-center gap-1 rounded-md border border-destructive/25 bg-destructive/10 px-2 py-0.5 text-[11px] font-medium text-destructive">
                        <XCircle className="h-3 w-3" />
                        Retry needed
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-3 font-medium text-foreground">
                    {d.caseCreated}
                  </td>
                  <td className="px-3">
                    <Link
                      to="/cases/$caseId"
                      params={{ caseId: "10245" }}
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

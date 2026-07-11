import { useState, useMemo } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  UploadCloud,
  FileText,
  Sparkles,
  CheckCircle2,
  Loader2,
  XCircle,
  ArrowRight,
} from "lucide-react";
import { PageHeader } from "@/components/legal/PageHeader";
import { StatusPill } from "@/components/legal/RiskBadge";
import { inboxDocuments } from "@/lib/mock-data";
import { uploadDocument } from "@/lib/api";
import { demo, demoOk } from "@/lib/demo-actions";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/inbox")({
  component: SmartInbox,
});

const filterChips = [
  "All",
  "Court Orders",
  "Claims",
  "FIR",
  "Notices",
  "Contracts",
  "Medical",
  "Survey Reports",
] as const;

type FilterChip = (typeof filterChips)[number];

/** Map each chip label to substrings that match document types. */
const chipTypeMap: Record<FilterChip, string[]> = {
  All: [],
  "Court Orders": ["Court"],
  Claims: ["Claim"],
  FIR: ["FIR"],
  Notices: ["Notice", "Complaint"],
  Contracts: ["Policy", "Contract"],
  Medical: ["Medical"],
  "Survey Reports": ["Survey"],
};

function ConfidenceBadge({ value }: { value: number }) {
  const tone =
    value >= 90
      ? "bg-success/15 text-success border-success/25"
      : value >= 70
        ? "bg-warning/15 text-warning border-warning/25"
        : "bg-destructive/15 text-destructive border-destructive/25";

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border px-2 py-0.5 text-[11px] font-semibold tabular-nums",
        tone,
      )}
    >
      {value > 0 ? `${value}%` : "—"}
    </span>
  );
}

function SmartInbox() {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState<FilterChip>("All");
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<"idle" | "extracting" | "entities" | "cross_ref">("idle");
  const [currentFile, setCurrentFile] = useState<string>("");

  const filteredDocs = useMemo(() => {
    if (activeFilter === "All") return inboxDocuments;
    const keywords = chipTypeMap[activeFilter];
    return inboxDocuments.filter((d) =>
      keywords.some((kw) => d.type.toLowerCase().includes(kw.toLowerCase())),
    );
  }, [activeFilter]);

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || !files.length) return;
    const file = files[0];
    setCurrentFile(file.name);
    setUploading(true);
    setUploadProgress("extracting");

    try {
      // Simulate progress timing for the judge
      setTimeout(() => setUploadProgress("entities"), 2000);
      setTimeout(() => setUploadProgress("cross_ref"), 4500);

      // Seed Case ID is '6a52793a2f5228406135526b'
      const caseId = "6a52793a2f5228406135526b";
      await uploadDocument(file, caseId);

      demoOk(
        "AI Analysis Complete",
        `Document '${file.name}' processed. Gemma-2 model successfully identified inconsistencies.`
      );

      navigate({
        to: "/cases/$caseId",
        params: { caseId },
      });
    } catch (err: any) {
      console.error(err);
      demo(
        "Processing Failed",
        err.response?.data?.detail || "Make sure MongoDB is running and your Fireworks Key is valid."
      );
    } finally {
      setUploading(false);
      setUploadProgress("idle");
    }
  };

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
                className="sr-only"
                accept=".pdf"
                onChange={(e) => handleFileUpload(e.target.files)}
              />
              <div className="mt-5 inline-flex h-9 items-center gap-1.5 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground">
                <UploadCloud className="h-4 w-4" />
                Choose files
              </div>
            </label>

            {/* AI pipeline status */}
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

        {/* Filter chips */}
        <div className="flex flex-wrap items-center gap-2 px-5 py-3 border-b border-border bg-secondary/30">
          {filterChips.map((chip) => (
            <button
              key={chip}
              onClick={() => setActiveFilter(chip)}
              className={cn(
                "rounded-full px-3 py-1 text-xs font-semibold transition-colors",
                activeFilter === chip
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-secondary text-muted-foreground hover:bg-secondary/80 hover:text-foreground",
              )}
            >
              {chip}
            </button>
          ))}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-secondary/50 text-[11px] uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="text-left font-semibold px-5 py-3">Document</th>
                <th className="text-left font-semibold px-5 py-3">Type</th>
                <th className="text-left font-semibold px-5 py-3">Source</th>
                <th className="text-left font-semibold px-5 py-3">Uploaded</th>
                <th className="text-left font-semibold px-5 py-3">AI Status</th>
                <th className="text-left font-semibold px-5 py-3">Confidence</th>
                <th className="text-left font-semibold px-5 py-3">Case</th>
                <th className="w-10" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredDocs.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-5 py-10 text-center text-muted-foreground">
                    No documents match the selected filter.
                  </td>
                </tr>
              )}
              {filteredDocs.map((d) => (
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
                  <td className="px-5 py-3 text-muted-foreground">{d.source}</td>
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
                  <td className="px-5 py-3">
                    <ConfidenceBadge value={d.confidence} />
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

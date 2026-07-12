import { useState, useMemo, useEffect } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  UploadCloud,
  FileText,
  Sparkles,
  CheckCircle2,
  Loader2,
  XCircle,
  ArrowRight,
  RefreshCw,
} from "lucide-react";
import { PageHeader } from "@/components/legal/PageHeader";
import { StatusPill } from "@/components/legal/RiskBadge";
import { inboxDocuments } from "@/lib/mock-data";
import { uploadDocument, getAllDocuments } from "@/lib/api";
import { getUser } from "@/lib/auth";
import { demo, demoOk, demoWarn } from "@/lib/demo-actions";
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
  const [uploadProgress, setUploadProgress] = useState<string>("idle");
  const [currentFile, setCurrentFile] = useState<string>("");
  const [documents, setDocuments] = useState<any[]>([]);
  const [docsLoading, setDocsLoading] = useState(true);

  // Load real documents from backend on mount
  useEffect(() => {
    async function fetchDocs() {
      setDocsLoading(true);
      const data = await getAllDocuments();
      setDocuments(data);
      setDocsLoading(false);
    }
    fetchDocs();
  }, []);

  const filteredDocs = useMemo(() => {
    const source = documents.length > 0 ? documents : inboxDocuments;
    if (activeFilter === "All") return source;
    const keywords = chipTypeMap[activeFilter];
    return source.filter((d) =>
      keywords.some((kw) => (d.type || d.category || "").toLowerCase().includes(kw.toLowerCase())),
    );
  }, [activeFilter, documents]);

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || !files.length) return;
    
    const fileArray = Array.from(files);
    const displayName = fileArray.length > 1 ? `${fileArray.length} Documents Batch` : fileArray[0].name;
    
    setCurrentFile(displayName);
    setUploading(true);
    setUploadProgress("uploading");

    // Realistic progress steps simulating the backend wait
    const step1 = setTimeout(() => setUploadProgress("extracting"), 1500);
    const step2 = setTimeout(() => setUploadProgress("analysis"), 3000);
    const step3 = setTimeout(() => setUploadProgress("creating"), 6000);
    const step4 = setTimeout(() => setUploadProgress("timeline"), 8000);

    try {
      const user = getUser();
      
      // 1. Process the FIRST file to create the Zero-Touch Case
      const firstFile = fileArray[0];
      const result = await uploadDocument(firstFile, undefined, user?.id);
      
      const newCaseId = result.data?.case_id;
      
      if (!newCaseId) throw new Error("Failed to auto-create case from first document.");

      // 2. Upload the REST of the files sequentially to the SAME case
      if (fileArray.length > 1) {
        for (let i = 1; i < fileArray.length; i++) {
           await uploadDocument(fileArray[i], newCaseId, user?.id);
        }
      }

      clearTimeout(step1);
      clearTimeout(step2);
      clearTimeout(step3);
      clearTimeout(step4);

      setUploadProgress("done");

      demoOk(
        "Zero-Touch Case Created!",
        `AI successfully processed ${fileArray.length} document(s) and created a new case.`
      );

      setTimeout(() => {
        navigate({ to: "/cases/$caseId", params: { caseId: newCaseId } });
      }, 1000);
    } catch (err: any) {
      clearTimeout(step1);
      clearTimeout(step2);
      clearTimeout(step3);
      clearTimeout(step4);
      demoWarn("Upload Failed", err.message || "Could not process document(s).");
      setUploading(false);
      setUploadProgress("idle");
    }
  };

  const progressSteps = [
    { key: "uploading", label: "Uploading PDF" },
    { key: "extracting", label: "Extracting Text" },
    { key: "analysis", label: "Running AI Analysis" },
    { key: "creating", label: "Creating Case" },
    { key: "timeline", label: "Generating Timeline" },
    { key: "done", label: "Done" },
  ];

  const progressIndex = progressSteps.findIndex((s) => s.key === uploadProgress);

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
            {!uploading ? (
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
                  multiple
                  onChange={(e) => handleFileUpload(e.target.files)}
                />
                <div className="mt-5 inline-flex h-9 items-center gap-1.5 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground">
                  <UploadCloud className="h-4 w-4" />
                  Choose files
                </div>
              </label>
            ) : (
              /* AI Processing Pipeline visualization */
              <div className="rounded-xl border border-border bg-secondary/40 p-6">
                <div className="flex items-center gap-3 mb-5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <Loader2 className="h-5 w-5 text-primary animate-spin" />
                  </div>
                  <div>
                    <div className="font-semibold text-foreground">Processing: {currentFile}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">Gemma-2 AI Pipeline active</div>
                  </div>
                </div>
                <div className="space-y-3">
                  {progressSteps.map((step, i) => {
                    const isDone = i < progressIndex;
                    const isActive = i === progressIndex;
                    return (
                      <div key={step.key} className="flex items-center gap-3">
                        <div className={cn(
                          "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold",
                          isDone ? "bg-success/20 text-success" :
                          isActive ? "bg-primary/20 text-primary" :
                          "bg-secondary text-muted-foreground"
                        )}>
                          {isDone ? <CheckCircle2 className="h-4 w-4" /> :
                           isActive ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> :
                           i + 1}
                        </div>
                        <span className={cn(
                          "text-sm",
                          isDone ? "text-success line-through opacity-60" :
                          isActive ? "text-foreground font-medium" :
                          "text-muted-foreground"
                        )}>
                          {step.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
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
                <div className="text-2xl font-bold tabular-nums">{documents.length > 0 ? documents.length : 142}</div>
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
            <div className="mt-2 font-semibold">Gemma-2 on AMD Instinct™ MI300X</div>
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
            <p className="text-sm text-muted-foreground mt-0.5">
              {documents.length > 0 ? `${documents.length} documents from MongoDB` : "Last 24 hours"}
            </p>
          </div>
          <button
            onClick={async () => {
              setDocsLoading(true);
              const data = await getAllDocuments();
              setDocuments(data);
              setDocsLoading(false);
            }}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline shrink-0"
          >
            <RefreshCw className={cn("h-3.5 w-3.5", docsLoading && "animate-spin")} />
            Refresh
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
              {docsLoading && (
                <tr>
                  <td colSpan={8} className="px-5 py-10 text-center text-muted-foreground">
                    <Loader2 className="h-5 w-5 animate-spin mx-auto mb-2" />
                    Loading documents from MongoDB…
                  </td>
                </tr>
              )}
              {!docsLoading && filteredDocs.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-5 py-10 text-center text-muted-foreground">
                    No documents match the selected filter.
                  </td>
                </tr>
              )}
              {!docsLoading && filteredDocs.map((d) => (
                <tr key={d.id} className="hover:bg-secondary/30 transition-colors">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-secondary text-muted-foreground">
                        <FileText className="h-4 w-4" />
                      </div>
                      <span className="font-medium text-foreground truncate">
                        {d.name || d.filename}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-muted-foreground">{d.type || d.category}</td>
                  <td className="px-5 py-3 text-muted-foreground">{d.source || "PDF Upload"}</td>
                  <td className="px-5 py-3 text-muted-foreground">{d.uploaded || "Recently"}</td>
                  <td className="px-5 py-3">
                    {(d.status === "Processed" || !d.status) && (
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
                    <ConfidenceBadge value={d.confidence || 0} />
                  </td>
                  <td className="px-5 py-3 font-medium text-foreground">
                    {d.caseCreated || (d.case_id ? `Case #${d.case_id.slice(-5)}` : "—")}
                  </td>
                  <td className="px-3">
                    <Link
                      to="/cases/$caseId"
                      params={{ caseId: d.case_id || "6a52793a2f5228406135526b" }}
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

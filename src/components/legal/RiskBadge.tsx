import { cn } from "@/lib/utils";
import type { Priority, Risk } from "@/lib/mock-data";

const riskStyles: Record<Risk, string> = {
  High: "bg-destructive/10 text-destructive border-destructive/20",
  Medium: "bg-warning/10 text-warning border-warning/25",
  Low: "bg-success/10 text-success border-success/25",
};

const priorityStyles: Record<Priority, string> = {
  HIGH: "bg-destructive text-destructive-foreground",
  MEDIUM: "bg-warning text-warning-foreground",
  LOW: "bg-success text-success-foreground",
};

export function RiskBadge({ risk, className }: { risk: Risk; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold",
        riskStyles[risk],
        className,
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {risk} Risk
    </span>
  );
}

export function PriorityBadge({ priority, className }: { priority: Priority; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider",
        priorityStyles[priority],
        className,
      )}
    >
      {priority}
    </span>
  );
}

export function StatusPill({
  status,
  tone = "neutral",
}: {
  status: string;
  tone?: "neutral" | "success" | "warning" | "info" | "destructive";
}) {
  const tones = {
    neutral: "bg-secondary text-secondary-foreground border-border",
    success: "bg-success/10 text-success border-success/25",
    warning: "bg-warning/10 text-warning border-warning/25",
    info: "bg-info/10 text-info border-info/25",
    destructive: "bg-destructive/10 text-destructive border-destructive/25",
  } as const;
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border px-2 py-0.5 text-[11px] font-medium",
        tones[tone],
      )}
    >
      {status}
    </span>
  );
}

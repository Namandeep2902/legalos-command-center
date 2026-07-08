import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string | number;
  delta?: string;
  icon?: LucideIcon;
  tone?: "primary" | "destructive" | "warning" | "info" | "success";
}

const toneStyles = {
  primary: "text-primary bg-primary/10",
  destructive: "text-destructive bg-destructive/10",
  warning: "text-warning bg-warning/15",
  info: "text-info bg-info/10",
  success: "text-success bg-success/10",
};

export function StatCard({ label, value, delta, icon: Icon, tone = "primary" }: StatCardProps) {
  return (
    <div className="card-elevated p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            {label}
          </div>
          <div className="mt-2 text-3xl font-bold tracking-tight text-foreground tabular-nums">
            {value}
          </div>
          {delta && (
            <div className="mt-1.5 text-xs text-muted-foreground">{delta}</div>
          )}
        </div>
        {Icon && (
          <div
            className={cn(
              "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
              toneStyles[tone],
            )}
          >
            <Icon className="h-5 w-5" />
          </div>
        )}
      </div>
    </div>
  );
}

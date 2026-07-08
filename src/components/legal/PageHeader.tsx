import type { ReactNode } from "react";

interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
}

export function PageHeader({ eyebrow, title, description, actions }: PageHeaderProps) {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4 border-b border-border pb-6 mb-6">
      <div className="min-w-0">
        {eyebrow && (
          <div className="text-[11px] font-semibold uppercase tracking-[0.15em] text-muted-foreground mb-2">
            {eyebrow}
          </div>
        )}
        <h1 className="truncate text-2xl md:text-3xl font-bold tracking-tight text-foreground">
          {title}
        </h1>
        {description && (
          <p className="mt-1.5 text-sm text-muted-foreground text-balance max-w-2xl">
            {description}
          </p>
        )}
      </div>
      {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
    </div>
  );
}

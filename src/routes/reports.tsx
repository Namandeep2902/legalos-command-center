import { createFileRoute } from "@tanstack/react-router";
import { BarChart3 } from "lucide-react";
import { PageHeader } from "@/components/legal/PageHeader";

export const Route = createFileRoute("/reports")({
  component: () => (
    <div className="mx-auto max-w-[1200px] p-4 md:p-8">
      <PageHeader eyebrow="Reports" title="Executive Reports" description="Coming soon." />
      <div className="card-elevated p-16 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
          <BarChart3 className="h-6 w-6" />
        </div>
        <h3 className="mt-4 text-lg font-bold">Reports module in development</h3>
        <p className="mt-1 text-sm text-muted-foreground max-w-md mx-auto">
          Board-ready reports on caseload throughput, cost per case, and litigation
          outcomes will land in the next release.
        </p>
      </div>
    </div>
  ),
});

import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Clock } from "lucide-react";

export const Route = createFileRoute("/reports")({
  component: ReportsPage,
});

function ReportsPage() {
  return (
    <div className="mx-auto max-w-4xl p-4 md:p-8 min-h-[80vh] flex flex-col items-center justify-center text-center">
      <div className="h-24 w-24 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-6">
        <Clock className="h-12 w-12" />
      </div>
      <h1 className="text-4xl font-extrabold text-foreground mb-4">Coming Soon</h1>
      <p className="text-lg text-muted-foreground mb-8 max-w-lg">
        We're working hard to bring you advanced executive intelligence reports and analytics. This feature will be available in an upcoming update.
      </p>
      <Link
        to="/"
        className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity"
      >
        <ArrowLeft className="h-4 w-4" />
        Return to Dashboard
      </Link>
    </div>
  );
}

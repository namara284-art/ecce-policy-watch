import { listReports } from "@/lib/reports";
import { ReportCard } from "@/components/ReportCard";

export const dynamic = "force-dynamic";

export default async function MonthlyPage() {
  const reports = await listReports({ type: "monthly" });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Monthly reports</h1>
        <p className="mt-1 text-slate-600">
          Month-end syntheses that pull together each region&apos;s daily developments into a single
          strategic read.
        </p>
      </div>

      {reports.length === 0 ? (
        <p className="rounded-lg border border-dashed border-slate-300 p-8 text-center text-slate-500">
          No monthly reports yet. Generate one with <code>npm run agent:monthly</code>.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {reports.map((r) => (
            <ReportCard key={r.id} report={r} />
          ))}
        </div>
      )}
    </div>
  );
}

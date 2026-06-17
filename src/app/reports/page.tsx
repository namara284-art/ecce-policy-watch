import Link from "next/link";
import { listReports } from "@/lib/reports";
import { activeRegions, regionName } from "@/lib/regions";
import { ReportCard } from "@/components/ReportCard";
import type { ReportType } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function ReportsPage({
  searchParams,
}: {
  searchParams: { region?: string; type?: string };
}) {
  const regionSlug = searchParams.region;
  const type = (searchParams.type === "monthly" ? "monthly" : "daily") as ReportType;
  const reports = await listReports({ regionSlug, type });
  const regions = activeRegions();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">
          {type === "monthly" ? "Monthly" : "Daily"} reports
          {regionSlug ? ` · ${regionName(regionSlug)}` : ""}
        </h1>
        <p className="mt-1 text-slate-600">
          {reports.length} report{reports.length === 1 ? "" : "s"}.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-4">
        <FilterChip label="All daily" href="/reports" active={!regionSlug && type === "daily"} />
        <FilterChip label="All monthly" href="/reports?type=monthly" active={!regionSlug && type === "monthly"} />
        <span className="mx-1 text-slate-300">|</span>
        {regions.map((r) => (
          <FilterChip
            key={r.slug}
            label={r.name}
            href={`/reports?region=${r.slug}${type === "monthly" ? "&type=monthly" : ""}`}
            active={regionSlug === r.slug}
          />
        ))}
      </div>

      {reports.length === 0 ? (
        <p className="rounded-lg border border-dashed border-slate-300 p-8 text-center text-slate-500">
          No reports yet for this view. Run the agent (<code>npm run agent:generate</code>) to
          populate reports.
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

function FilterChip({ label, href, active }: { label: string; href: string; active: boolean }) {
  return (
    <Link
      href={href}
      className={`rounded-full border px-3 py-1 text-sm ${
        active
          ? "border-brand-600 bg-brand-600 text-white"
          : "border-slate-300 bg-white text-slate-600 hover:border-brand-500"
      }`}
    >
      {label}
    </Link>
  );
}

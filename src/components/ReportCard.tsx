import Link from "next/link";
import { regionName } from "@/lib/regions";
import type { Report } from "@/lib/types";

export function ReportCard({ report }: { report: Report }) {
  return (
    <article className="rounded-lg border border-slate-200 bg-white p-5 transition hover:border-brand-500 hover:shadow-sm">
      <div className="mb-2 flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-slate-400">
        <span className="rounded bg-brand-50 px-2 py-0.5 text-brand-700">
          {regionName(report.regionSlug)}
        </span>
        <span>{report.type === "monthly" ? "Monthly" : "Daily"}</span>
        <span>·</span>
        <time dateTime={report.reportDate}>{report.reportDate}</time>
      </div>
      <h3 className="text-lg font-semibold text-slate-900">
        <Link href={`/reports/${report.id}`} className="hover:text-brand-600">
          {report.headline}
        </Link>
      </h3>
      <p className="mt-2 line-clamp-3 text-sm text-slate-600">{report.summary}</p>
      <Link
        href={`/reports/${report.id}`}
        className="mt-3 inline-block text-sm font-medium text-brand-600 hover:text-brand-700"
      >
        Read report →
      </Link>
    </article>
  );
}

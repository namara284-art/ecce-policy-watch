import Link from "next/link";
import { notFound } from "next/navigation";
import { getReport } from "@/lib/reports";
import { regionName } from "@/lib/regions";
import { renderMarkdown } from "@/lib/markdown";

export const dynamic = "force-dynamic";

const IMPACT_STYLES: Record<string, string> = {
  high: "bg-red-50 text-red-700 border-red-200",
  medium: "bg-amber-50 text-amber-700 border-amber-200",
  low: "bg-slate-100 text-slate-600 border-slate-200",
};

export default async function ReportPage({ params }: { params: { id: string } }) {
  const report = await getReport(params.id);
  if (!report) notFound();

  return (
    <article className="mx-auto max-w-3xl">
      <Link href="/reports" className="text-sm text-brand-600 hover:text-brand-700">
        ← All reports
      </Link>

      <div className="mt-4 flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-slate-400">
        <span className="rounded bg-brand-50 px-2 py-0.5 text-brand-700">
          {regionName(report.regionSlug)}
        </span>
        <span>{report.type === "monthly" ? "Monthly synthesis" : "Daily report"}</span>
        <span>·</span>
        <time dateTime={report.reportDate}>{report.reportDate}</time>
      </div>

      <h1 className="mt-2 text-3xl font-bold text-slate-900">{report.headline}</h1>
      <p className="mt-3 text-lg text-slate-600">{report.summary}</p>

      {report.keyDevelopments.length > 0 && (
        <section className="mt-8">
          <h2 className="text-xl font-semibold text-slate-900">Key developments</h2>
          <ul className="mt-3 space-y-3">
            {report.keyDevelopments.map((d, i) => (
              <li key={i} className="rounded-lg border border-slate-200 bg-white p-4">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-semibold text-slate-900">{d.title}</h3>
                  {d.impact && (
                    <span
                      className={`rounded-full border px-2 py-0.5 text-xs font-medium ${
                        IMPACT_STYLES[d.impact] ?? IMPACT_STYLES.low
                      }`}
                    >
                      {d.impact} impact
                    </span>
                  )}
                </div>
                <p className="mt-1 text-sm text-slate-600">{d.detail}</p>
              </li>
            ))}
          </ul>
        </section>
      )}

      {report.bodyMarkdown && (
        <section
          className="prose-report mt-8"
          dangerouslySetInnerHTML={{ __html: renderMarkdown(report.bodyMarkdown) }}
        />
      )}

      {report.sources.length > 0 && (
        <section className="mt-10 border-t border-slate-200 pt-6">
          <h2 className="text-lg font-semibold text-slate-900">Sources</h2>
          <ul className="mt-2 space-y-1 text-sm">
            {report.sources.map((s, i) => (
              <li key={i}>
                <a
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-600 underline"
                >
                  {s.title}
                </a>
                {s.publisher ? <span className="text-slate-400"> — {s.publisher}</span> : null}
              </li>
            ))}
          </ul>
        </section>
      )}
    </article>
  );
}

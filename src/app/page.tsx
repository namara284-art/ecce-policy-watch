import Link from "next/link";
import { listReports } from "@/lib/reports";
import { activeRegions } from "@/lib/regions";
import { ReportCard } from "@/components/ReportCard";
import { SubscribeForm } from "@/components/SubscribeForm";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const latest = await listReports({ type: "daily", limit: 6 });
  const regions = activeRegions();

  return (
    <div className="space-y-16">
      <section className="text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-brand-600">
          Global coverage · {regions.length} regions
        </p>
        <h1 className="mx-auto mt-2 max-w-3xl text-4xl font-bold tracking-tight text-slate-900">
          Early Childhood policy intelligence, from around the world — every day.
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
          ECCE Policy Watch tracks Early Childhood Care &amp; Education policy across countries and
          regions, with daily reports and monthly syntheses for every country in the world.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Link
            href="/reports"
            className="rounded-md bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
          >
            Browse reports
          </Link>
          <Link
            href="#subscribe"
            className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:border-brand-500"
          >
            Get daily reports by email
          </Link>
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-end justify-between">
          <h2 className="text-2xl font-bold text-slate-900">Latest reports</h2>
          <Link href="/reports" className="text-sm font-medium text-brand-600 hover:text-brand-700">
            View all →
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {latest.map((r) => (
            <ReportCard key={r.id} report={r} />
          ))}
        </div>
      </section>

      <section id="subscribe" className="scroll-mt-20 rounded-xl border border-slate-200 bg-white p-6 sm:p-8">
        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Subscribe to Policy Watch</h2>
            <p className="mt-2 text-slate-600">
              Get daily or monthly ECCE policy reports for the regions you care about, delivered to
              your inbox. Built for practitioners, donors, philanthropies and researchers.
            </p>
            <ul className="mt-4 space-y-2 text-sm text-slate-600">
              <li>✓ Choose any combination of regions</li>
              <li>✓ Daily, weekly digest, or monthly cadence</li>
              <li>✓ Free during launch</li>
            </ul>
          </div>
          <SubscribeForm />
        </div>
      </section>
    </div>
  );
}

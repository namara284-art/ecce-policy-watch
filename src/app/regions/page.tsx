import Link from "next/link";
import { REGIONS } from "@/lib/regions";

export default function RegionsPage() {
  const byContinent = REGIONS.reduce<Record<string, typeof REGIONS>>((acc, r) => {
    (acc[r.continent] ??= []).push(r);
    return acc;
  }, {});

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Regions we track</h1>
        <p className="mt-1 text-slate-600">
          Coverage is expanding. Active regions receive daily reports and monthly syntheses.
        </p>
      </div>

      {Object.entries(byContinent).map(([continent, regions]) => (
        <section key={continent}>
          <h2 className="mb-3 text-lg font-semibold text-slate-900">{continent}</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {regions.map((r) => (
              <div
                key={r.slug}
                className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-4"
              >
                <div>
                  <p className="font-medium text-slate-900">{r.name}</p>
                  <p className="text-xs text-slate-400">
                    {r.active ? "Active coverage" : "Coming soon"}
                  </p>
                </div>
                {r.active ? (
                  <Link
                    href={`/reports?region=${r.slug}`}
                    className="text-sm font-medium text-brand-600 hover:text-brand-700"
                  >
                    Reports →
                  </Link>
                ) : (
                  <span className="text-xs text-slate-300">—</span>
                )}
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

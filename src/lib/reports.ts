import { getSupabaseClient } from "./supabase";
import { SEED_REPORTS } from "./seed-reports";
import type { Report, ReportType } from "./types";

/**
 * Read-side data access for reports. If Supabase is configured it reads from the
 * `reports` table; otherwise it serves bundled seed data. This lets the site run
 * locally with no setup and switch to live data the moment env vars are present.
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowToReport(row: any): Report {
  return {
    id: row.id,
    regionSlug: row.region_slug,
    type: row.type,
    reportDate: row.report_date,
    headline: row.headline,
    summary: row.summary,
    keyDevelopments: row.key_developments ?? [],
    sources: row.sources ?? [],
    bodyMarkdown: row.body_markdown ?? "",
    createdAt: row.created_at,
  };
}

function sortByDateDesc(a: Report, b: Report): number {
  return b.reportDate.localeCompare(a.reportDate) || b.createdAt.localeCompare(a.createdAt);
}

export interface ReportQuery {
  regionSlug?: string;
  type?: ReportType;
  limit?: number;
}

export async function listReports(query: ReportQuery = {}): Promise<Report[]> {
  const supabase = getSupabaseClient();

  if (supabase) {
    let q = supabase.from("reports").select("*").order("report_date", { ascending: false });
    if (query.regionSlug) q = q.eq("region_slug", query.regionSlug);
    if (query.type) q = q.eq("type", query.type);
    if (query.limit) q = q.limit(query.limit);
    const { data, error } = await q;
    if (error) throw new Error(`Failed to load reports: ${error.message}`);
    return (data ?? []).map(rowToReport);
  }

  // Seed fallback.
  let results = [...SEED_REPORTS];
  if (query.regionSlug) results = results.filter((r) => r.regionSlug === query.regionSlug);
  if (query.type) results = results.filter((r) => r.type === query.type);
  results.sort(sortByDateDesc);
  return query.limit ? results.slice(0, query.limit) : results;
}

export async function getReport(id: string): Promise<Report | null> {
  const supabase = getSupabaseClient();

  if (supabase) {
    const { data, error } = await supabase.from("reports").select("*").eq("id", id).maybeSingle();
    if (error) throw new Error(`Failed to load report: ${error.message}`);
    return data ? rowToReport(data) : null;
  }

  return SEED_REPORTS.find((r) => r.id === id) ?? null;
}

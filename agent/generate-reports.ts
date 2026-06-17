/**
 * Global ECCE Policy Watch — report generation agent.
 *
 * This is the seam that turns a Uganda-only agent into a global one: it loops
 * over every active region and asks Claude to produce a structured policy
 * report, then writes each report to Supabase (idempotent per region/type/date).
 *
 * Usage:
 *   npm run agent:generate                 # daily reports for all active regions
 *   npm run agent:generate -- --type monthly   # monthly syntheses
 *   npm run agent:generate -- --region kenya   # a single region
 *
 * Env: ANTHROPIC_API_KEY (required to call Claude),
 *      NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY (to persist).
 * Without Supabase env, reports are printed to stdout (dry run).
 *
 * If you already have a working Claude Agent SDK pipeline, you can keep it and
 * just reuse `buildReportTool` / the persistence helper below — the contract is
 * the structured `Report` shape.
 */
import Anthropic from "@anthropic-ai/sdk";
import { activeRegions, getRegion } from "../src/lib/regions";
import { isSupabaseConfigured, getServiceClient } from "../src/lib/supabase";
import type { Region, Report, ReportType } from "../src/lib/types";

const DAILY_MODEL = process.env.ECCE_DAILY_MODEL || "claude-sonnet-4-6";
const MONTHLY_MODEL = process.env.ECCE_MONTHLY_MODEL || "claude-opus-4-8";

interface CliArgs {
  type: ReportType;
  region?: string;
}

function parseArgs(argv: string[]): CliArgs {
  const args: CliArgs = { type: "daily" };
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === "--type") args.type = argv[++i] === "monthly" ? "monthly" : "daily";
    else if (argv[i] === "--region") args.region = argv[++i];
  }
  return args;
}

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

function firstOfMonthISO(): string {
  const d = new Date();
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}-01`;
}

/** Tool schema that forces Claude to return a well-formed structured report. */
const reportTool: Anthropic.Tool = {
  name: "submit_report",
  description:
    "Submit the structured ECCE policy report for the requested region and period.",
  input_schema: {
    type: "object",
    properties: {
      headline: { type: "string", description: "One-line headline (max ~120 chars)." },
      summary: {
        type: "string",
        description: "2-4 sentence executive summary for busy policymakers.",
      },
      key_developments: {
        type: "array",
        description: "The most important developments in this period.",
        items: {
          type: "object",
          properties: {
            title: { type: "string" },
            detail: { type: "string" },
            impact: { type: "string", enum: ["high", "medium", "low"] },
          },
          required: ["title", "detail"],
        },
      },
      sources: {
        type: "array",
        description: "Primary sources cited. Use real, verifiable URLs only.",
        items: {
          type: "object",
          properties: {
            title: { type: "string" },
            url: { type: "string" },
            publisher: { type: "string" },
          },
          required: ["title", "url"],
        },
      },
      body_markdown: {
        type: "string",
        description:
          "Full report in Markdown with ## sections (Overview, Why it matters, What to watch).",
      },
    },
    required: ["headline", "summary", "key_developments", "sources", "body_markdown"],
  },
};

function promptFor(region: Region, type: ReportType): string {
  const period = type === "monthly" ? "the past month" : "the past 24-48 hours";
  return [
    `You are the Global ECCE Policy Intelligence Agent. Produce a ${type} Early Childhood Care & Education (ECCE) policy report for ${region.name}.`,
    "",
    `Focus on developments in ${period}: government policy, legislation, budgets/financing, workforce, curriculum and quality standards, donor/philanthropic activity, and major reports.`,
    type === "monthly"
      ? "This is a monthly synthesis: identify the dominant themes and the trajectory, not just a list of events."
      : "This is a daily brief: prioritise what is new and decision-relevant.",
    "",
    "Be precise and neutral. Only cite sources you are confident are real and verifiable. If little of substance happened, say so honestly rather than inflating.",
    "",
    "Call the submit_report tool with the structured result. Do not reply with prose outside the tool call.",
  ].join("\n");
}

async function generateForRegion(
  client: Anthropic,
  region: Region,
  type: ReportType
): Promise<Report> {
  const model = type === "monthly" ? MONTHLY_MODEL : DAILY_MODEL;
  const reportDate = type === "monthly" ? firstOfMonthISO() : todayISO();

  const response = await client.messages.create({
    model,
    max_tokens: 2000,
    tools: [reportTool],
    tool_choice: { type: "tool", name: "submit_report" },
    messages: [{ role: "user", content: promptFor(region, type) }],
  });

  const toolUse = response.content.find(
    (block): block is Anthropic.ToolUseBlock => block.type === "tool_use"
  );
  if (!toolUse) {
    throw new Error(`Model did not return a structured report for ${region.slug}.`);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const out = toolUse.input as any;
  return {
    id: `${region.slug}-${reportDate}-${type}`,
    regionSlug: region.slug,
    type,
    reportDate,
    headline: out.headline,
    summary: out.summary,
    keyDevelopments: out.key_developments ?? [],
    sources: out.sources ?? [],
    bodyMarkdown: out.body_markdown ?? "",
    createdAt: new Date().toISOString(),
  };
}

async function persist(reports: Report[]): Promise<void> {
  if (!isSupabaseConfigured() || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.log("\n[dry run] Supabase not configured — printing reports instead of saving:\n");
    for (const r of reports) {
      console.log(`• [${r.regionSlug}/${r.type}/${r.reportDate}] ${r.headline}`);
    }
    return;
  }

  const supabase = getServiceClient();
  const rows = reports.map((r) => ({
    id: r.id,
    region_slug: r.regionSlug,
    type: r.type,
    report_date: r.reportDate,
    headline: r.headline,
    summary: r.summary,
    key_developments: r.keyDevelopments,
    sources: r.sources,
    body_markdown: r.bodyMarkdown,
  }));

  const { error } = await supabase
    .from("reports")
    .upsert(rows, { onConflict: "region_slug,type,report_date" });
  if (error) throw new Error(`Failed to persist reports: ${error.message}`);
  console.log(`\nSaved ${rows.length} report(s) to Supabase.`);
}

async function main() {
  const args = parseArgs(process.argv.slice(2));

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.error("ANTHROPIC_API_KEY is required to generate reports.");
    process.exit(1);
  }

  const targets = args.region
    ? [getRegion(args.region)].filter((r): r is Region => Boolean(r))
    : activeRegions();

  if (targets.length === 0) {
    console.error(`No matching active region for "${args.region ?? ""}".`);
    process.exit(1);
  }

  const client = new Anthropic({ apiKey });
  console.log(
    `Generating ${args.type} reports for ${targets.length} region(s): ${targets
      .map((r) => r.slug)
      .join(", ")}`
  );

  const reports: Report[] = [];
  for (const region of targets) {
    try {
      process.stdout.write(`  · ${region.name} … `);
      const report = await generateForRegion(client, region, args.type);
      reports.push(report);
      console.log("done");
    } catch (err) {
      console.log(`failed: ${err instanceof Error ? err.message : String(err)}`);
    }
  }

  await persist(reports);
  console.log("\nComplete.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

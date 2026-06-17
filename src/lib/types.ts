export type ReportType = "daily" | "monthly";

export interface Region {
  /** URL-safe identifier, e.g. "uganda" or "east-africa". */
  slug: string;
  name: string;
  /** ISO 3166-1 alpha-2 where applicable; null for multi-country regions. */
  countryCode: string | null;
  continent: string;
  /** Whether the agent currently generates reports for this region. */
  active: boolean;
}

export interface KeyDevelopment {
  title: string;
  detail: string;
  /** Optional impact tag to help readers triage. */
  impact?: "high" | "medium" | "low";
}

export interface Source {
  title: string;
  url: string;
  publisher?: string;
}

export interface Report {
  id: string;
  regionSlug: string;
  type: ReportType;
  /** ISO date (YYYY-MM-DD). For monthly reports this is the first of the month. */
  reportDate: string;
  headline: string;
  summary: string;
  keyDevelopments: KeyDevelopment[];
  sources: Source[];
  bodyMarkdown: string;
  createdAt: string;
}

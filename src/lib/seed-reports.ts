import type { Report } from "./types";

/**
 * Bundled sample reports so the platform renders without any database or API
 * keys configured. Once Supabase is wired up and the agent has run, live data
 * from the `reports` table takes over automatically (see lib/reports.ts).
 *
 * These illustrate the structured shape the agent is expected to produce.
 */
export const SEED_REPORTS: Report[] = [
  {
    id: "seed-uganda-2026-06-17",
    regionSlug: "uganda",
    type: "daily",
    reportDate: "2026-06-17",
    headline: "Uganda advances draft framework for ECD workforce certification",
    summary:
      "Uganda's Ministry of Education and Sports circulated a draft framework introducing national certification tiers for early childhood development caregivers, signalling a shift toward professionalising the workforce.",
    keyDevelopments: [
      {
        title: "Caregiver certification tiers proposed",
        detail:
          "The draft introduces three competency tiers with associated training requirements, aiming to standardise quality across private and community-run centres.",
        impact: "high",
      },
      {
        title: "Public consultation window opened",
        detail:
          "Stakeholders, including practitioner networks and faith-based providers, have 30 days to submit feedback before the framework is finalised.",
        impact: "medium",
      },
    ],
    sources: [
      {
        title: "Ministry of Education and Sports — Draft ECD Workforce Framework",
        url: "https://www.education.go.ug/",
        publisher: "Government of Uganda",
      },
    ],
    bodyMarkdown:
      "## Overview\n\nUganda has taken a notable step toward professionalising its early childhood development (ECD) workforce with a draft certification framework...\n\n## Why it matters\n\nWorkforce quality is consistently cited as the single largest determinant of ECCE outcomes...\n",
    createdAt: "2026-06-17T06:00:00Z",
  },
  {
    id: "seed-kenya-2026-06-17",
    regionSlug: "kenya",
    type: "daily",
    reportDate: "2026-06-17",
    headline: "Kenya counties report uneven rollout of pre-primary capitation grants",
    summary:
      "A new monitoring brief finds wide disparities in how county governments are disbursing pre-primary capitation, raising equity concerns for under-resourced regions.",
    keyDevelopments: [
      {
        title: "Disbursement gaps across counties",
        detail:
          "Several counties have released less than half of allocated pre-primary funds for the cycle, delaying materials and caregiver stipends.",
        impact: "high",
      },
    ],
    sources: [
      {
        title: "County Education Monitoring Brief",
        url: "https://www.education.go.ke/",
        publisher: "Ministry of Education, Kenya",
      },
    ],
    bodyMarkdown:
      "## Overview\n\nDevolved financing of pre-primary education in Kenya continues to show uneven implementation...\n",
    createdAt: "2026-06-17T06:00:00Z",
  },
  {
    id: "seed-global-2026-06-17",
    regionSlug: "global",
    type: "daily",
    reportDate: "2026-06-17",
    headline: "Multilateral donors signal increased ECCE financing commitments",
    summary:
      "Cross-border developments point to renewed donor appetite for early childhood financing, with new pooled-fund discussions referencing ECCE as a priority window.",
    keyDevelopments: [
      {
        title: "Pooled-fund discussions reference ECCE",
        detail:
          "Draft language in an emerging multilateral facility names early childhood as an eligible investment area, potentially unlocking new financing channels.",
        impact: "medium",
      },
    ],
    sources: [
      {
        title: "Global Partnership for Education — Financing Update",
        url: "https://www.globalpartnership.org/",
        publisher: "GPE",
      },
    ],
    bodyMarkdown:
      "## Overview\n\nCross-border financing signals this week suggest growing momentum for early childhood investment...\n",
    createdAt: "2026-06-17T06:00:00Z",
  },
  {
    id: "seed-uganda-2026-06-01-monthly",
    regionSlug: "uganda",
    type: "monthly",
    reportDate: "2026-06-01",
    headline: "Uganda ECCE Monthly: workforce reform and financing in focus",
    summary:
      "May saw sustained policy attention on the ECD workforce and renewed debate over sustainable financing of community-based centres.",
    keyDevelopments: [
      {
        title: "Workforce professionalisation gains momentum",
        detail:
          "Multiple developments over the month converged on caregiver standards and certification.",
        impact: "high",
      },
      {
        title: "Financing sustainability debated",
        detail:
          "Discussions intensified around how to sustain community-run centres without over-relying on donor cycles.",
        impact: "medium",
      },
    ],
    sources: [
      {
        title: "Synthesis of May 2026 daily reports",
        url: "https://www.education.go.ug/",
        publisher: "ECCE Policy Watch",
      },
    ],
    bodyMarkdown:
      "## Monthly synthesis\n\nThis month's developments in Uganda clustered around two themes: workforce professionalisation and financing sustainability...\n",
    createdAt: "2026-06-01T06:00:00Z",
  },
];

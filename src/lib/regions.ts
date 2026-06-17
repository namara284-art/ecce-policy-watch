import type { Region } from "./types";

/**
 * The jurisdictions the platform tracks. This is the seam that turns the
 * Uganda-only agent into a global one: the agent loops over `activeRegions()`
 * and produces one report per region per run.
 *
 * Add regions here (and flip `active` to true) to expand coverage. Multi-country
 * blocs (EU, East Africa) are first-class so the platform can publish regional
 * syntheses alongside single-country reports.
 */
export const REGIONS: Region[] = [
  { slug: "uganda", name: "Uganda", countryCode: "UG", continent: "Africa", active: true },
  { slug: "kenya", name: "Kenya", countryCode: "KE", continent: "Africa", active: true },
  { slug: "nigeria", name: "Nigeria", countryCode: "NG", continent: "Africa", active: true },
  { slug: "south-africa", name: "South Africa", countryCode: "ZA", continent: "Africa", active: true },
  { slug: "india", name: "India", countryCode: "IN", continent: "Asia", active: true },
  { slug: "brazil", name: "Brazil", countryCode: "BR", continent: "Americas", active: true },
  { slug: "united-states", name: "United States", countryCode: "US", continent: "Americas", active: true },
  { slug: "european-union", name: "European Union", countryCode: null, continent: "Europe", active: true },
  { slug: "indonesia", name: "Indonesia", countryCode: "ID", continent: "Asia", active: false },
  { slug: "global", name: "Global / Cross-border", countryCode: null, continent: "Global", active: true },
];

export function activeRegions(): Region[] {
  return REGIONS.filter((r) => r.active);
}

export function getRegion(slug: string): Region | undefined {
  return REGIONS.find((r) => r.slug === slug);
}

export function regionName(slug: string): string {
  return getRegion(slug)?.name ?? slug;
}

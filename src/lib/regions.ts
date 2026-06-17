import type { Region } from "./types";

/**
 * Every country in the world, grouped by continent, plus a cross-border "Global"
 * entry. This is the seam that makes coverage worldwide: the report engine loops
 * over `activeRegions()` and produces one report per region per run, and the
 * website / subscribe form / filters all derive their options from this list.
 *
 * To narrow coverage (e.g. to control cost), set `active: false` on a country —
 * it then shows as "coming soon" and is skipped by generation.
 */
function c(name: string, slug: string, countryCode: string | null, continent: string): Region {
  return { slug, name, countryCode, continent, active: true };
}

const AFRICA: Region[] = [
  c("Algeria", "algeria", "DZ", "Africa"),
  c("Angola", "angola", "AO", "Africa"),
  c("Benin", "benin", "BJ", "Africa"),
  c("Botswana", "botswana", "BW", "Africa"),
  c("Burkina Faso", "burkina-faso", "BF", "Africa"),
  c("Burundi", "burundi", "BI", "Africa"),
  c("Cabo Verde", "cabo-verde", "CV", "Africa"),
  c("Cameroon", "cameroon", "CM", "Africa"),
  c("Central African Republic", "central-african-republic", "CF", "Africa"),
  c("Chad", "chad", "TD", "Africa"),
  c("Comoros", "comoros", "KM", "Africa"),
  c("Republic of the Congo", "republic-of-the-congo", "CG", "Africa"),
  c("DR Congo", "dr-congo", "CD", "Africa"),
  c("Côte d'Ivoire", "cote-divoire", "CI", "Africa"),
  c("Djibouti", "djibouti", "DJ", "Africa"),
  c("Egypt", "egypt", "EG", "Africa"),
  c("Equatorial Guinea", "equatorial-guinea", "GQ", "Africa"),
  c("Eritrea", "eritrea", "ER", "Africa"),
  c("Eswatini", "eswatini", "SZ", "Africa"),
  c("Ethiopia", "ethiopia", "ET", "Africa"),
  c("Gabon", "gabon", "GA", "Africa"),
  c("Gambia", "gambia", "GM", "Africa"),
  c("Ghana", "ghana", "GH", "Africa"),
  c("Guinea", "guinea", "GN", "Africa"),
  c("Guinea-Bissau", "guinea-bissau", "GW", "Africa"),
  c("Kenya", "kenya", "KE", "Africa"),
  c("Lesotho", "lesotho", "LS", "Africa"),
  c("Liberia", "liberia", "LR", "Africa"),
  c("Libya", "libya", "LY", "Africa"),
  c("Madagascar", "madagascar", "MG", "Africa"),
  c("Malawi", "malawi", "MW", "Africa"),
  c("Mali", "mali", "ML", "Africa"),
  c("Mauritania", "mauritania", "MR", "Africa"),
  c("Mauritius", "mauritius", "MU", "Africa"),
  c("Morocco", "morocco", "MA", "Africa"),
  c("Mozambique", "mozambique", "MZ", "Africa"),
  c("Namibia", "namibia", "NA", "Africa"),
  c("Niger", "niger", "NE", "Africa"),
  c("Nigeria", "nigeria", "NG", "Africa"),
  c("Rwanda", "rwanda", "RW", "Africa"),
  c("São Tomé and Príncipe", "sao-tome-and-principe", "ST", "Africa"),
  c("Senegal", "senegal", "SN", "Africa"),
  c("Seychelles", "seychelles", "SC", "Africa"),
  c("Sierra Leone", "sierra-leone", "SL", "Africa"),
  c("Somalia", "somalia", "SO", "Africa"),
  c("South Africa", "south-africa", "ZA", "Africa"),
  c("South Sudan", "south-sudan", "SS", "Africa"),
  c("Sudan", "sudan", "SD", "Africa"),
  c("Tanzania", "tanzania", "TZ", "Africa"),
  c("Togo", "togo", "TG", "Africa"),
  c("Tunisia", "tunisia", "TN", "Africa"),
  c("Uganda", "uganda", "UG", "Africa"),
  c("Zambia", "zambia", "ZM", "Africa"),
  c("Zimbabwe", "zimbabwe", "ZW", "Africa"),
];

const ASIA: Region[] = [
  c("Afghanistan", "afghanistan", "AF", "Asia"),
  c("Armenia", "armenia", "AM", "Asia"),
  c("Azerbaijan", "azerbaijan", "AZ", "Asia"),
  c("Bahrain", "bahrain", "BH", "Asia"),
  c("Bangladesh", "bangladesh", "BD", "Asia"),
  c("Bhutan", "bhutan", "BT", "Asia"),
  c("Brunei", "brunei", "BN", "Asia"),
  c("Cambodia", "cambodia", "KH", "Asia"),
  c("China", "china", "CN", "Asia"),
  c("Cyprus", "cyprus", "CY", "Asia"),
  c("Georgia", "georgia", "GE", "Asia"),
  c("India", "india", "IN", "Asia"),
  c("Indonesia", "indonesia", "ID", "Asia"),
  c("Iran", "iran", "IR", "Asia"),
  c("Iraq", "iraq", "IQ", "Asia"),
  c("Israel", "israel", "IL", "Asia"),
  c("Japan", "japan", "JP", "Asia"),
  c("Jordan", "jordan", "JO", "Asia"),
  c("Kazakhstan", "kazakhstan", "KZ", "Asia"),
  c("Kuwait", "kuwait", "KW", "Asia"),
  c("Kyrgyzstan", "kyrgyzstan", "KG", "Asia"),
  c("Laos", "laos", "LA", "Asia"),
  c("Lebanon", "lebanon", "LB", "Asia"),
  c("Malaysia", "malaysia", "MY", "Asia"),
  c("Maldives", "maldives", "MV", "Asia"),
  c("Mongolia", "mongolia", "MN", "Asia"),
  c("Myanmar", "myanmar", "MM", "Asia"),
  c("Nepal", "nepal", "NP", "Asia"),
  c("North Korea", "north-korea", "KP", "Asia"),
  c("Oman", "oman", "OM", "Asia"),
  c("Pakistan", "pakistan", "PK", "Asia"),
  c("Palestine", "palestine", "PS", "Asia"),
  c("Philippines", "philippines", "PH", "Asia"),
  c("Qatar", "qatar", "QA", "Asia"),
  c("Saudi Arabia", "saudi-arabia", "SA", "Asia"),
  c("Singapore", "singapore", "SG", "Asia"),
  c("South Korea", "south-korea", "KR", "Asia"),
  c("Sri Lanka", "sri-lanka", "LK", "Asia"),
  c("Syria", "syria", "SY", "Asia"),
  c("Taiwan", "taiwan", "TW", "Asia"),
  c("Tajikistan", "tajikistan", "TJ", "Asia"),
  c("Thailand", "thailand", "TH", "Asia"),
  c("Timor-Leste", "timor-leste", "TL", "Asia"),
  c("Turkey", "turkey", "TR", "Asia"),
  c("Turkmenistan", "turkmenistan", "TM", "Asia"),
  c("United Arab Emirates", "united-arab-emirates", "AE", "Asia"),
  c("Uzbekistan", "uzbekistan", "UZ", "Asia"),
  c("Vietnam", "vietnam", "VN", "Asia"),
  c("Yemen", "yemen", "YE", "Asia"),
];

const EUROPE: Region[] = [
  c("Albania", "albania", "AL", "Europe"),
  c("Andorra", "andorra", "AD", "Europe"),
  c("Austria", "austria", "AT", "Europe"),
  c("Belarus", "belarus", "BY", "Europe"),
  c("Belgium", "belgium", "BE", "Europe"),
  c("Bosnia and Herzegovina", "bosnia-and-herzegovina", "BA", "Europe"),
  c("Bulgaria", "bulgaria", "BG", "Europe"),
  c("Croatia", "croatia", "HR", "Europe"),
  c("Czechia", "czechia", "CZ", "Europe"),
  c("Denmark", "denmark", "DK", "Europe"),
  c("Estonia", "estonia", "EE", "Europe"),
  c("Finland", "finland", "FI", "Europe"),
  c("France", "france", "FR", "Europe"),
  c("Germany", "germany", "DE", "Europe"),
  c("Greece", "greece", "GR", "Europe"),
  c("Hungary", "hungary", "HU", "Europe"),
  c("Iceland", "iceland", "IS", "Europe"),
  c("Ireland", "ireland", "IE", "Europe"),
  c("Italy", "italy", "IT", "Europe"),
  c("Kosovo", "kosovo", "XK", "Europe"),
  c("Latvia", "latvia", "LV", "Europe"),
  c("Liechtenstein", "liechtenstein", "LI", "Europe"),
  c("Lithuania", "lithuania", "LT", "Europe"),
  c("Luxembourg", "luxembourg", "LU", "Europe"),
  c("Malta", "malta", "MT", "Europe"),
  c("Moldova", "moldova", "MD", "Europe"),
  c("Monaco", "monaco", "MC", "Europe"),
  c("Montenegro", "montenegro", "ME", "Europe"),
  c("Netherlands", "netherlands", "NL", "Europe"),
  c("North Macedonia", "north-macedonia", "MK", "Europe"),
  c("Norway", "norway", "NO", "Europe"),
  c("Poland", "poland", "PL", "Europe"),
  c("Portugal", "portugal", "PT", "Europe"),
  c("Romania", "romania", "RO", "Europe"),
  c("Russia", "russia", "RU", "Europe"),
  c("San Marino", "san-marino", "SM", "Europe"),
  c("Serbia", "serbia", "RS", "Europe"),
  c("Slovakia", "slovakia", "SK", "Europe"),
  c("Slovenia", "slovenia", "SI", "Europe"),
  c("Spain", "spain", "ES", "Europe"),
  c("Sweden", "sweden", "SE", "Europe"),
  c("Switzerland", "switzerland", "CH", "Europe"),
  c("Ukraine", "ukraine", "UA", "Europe"),
  c("United Kingdom", "united-kingdom", "GB", "Europe"),
  c("Vatican City", "vatican-city", "VA", "Europe"),
];

const AMERICAS: Region[] = [
  c("Antigua and Barbuda", "antigua-and-barbuda", "AG", "Americas"),
  c("Argentina", "argentina", "AR", "Americas"),
  c("Bahamas", "bahamas", "BS", "Americas"),
  c("Barbados", "barbados", "BB", "Americas"),
  c("Belize", "belize", "BZ", "Americas"),
  c("Bolivia", "bolivia", "BO", "Americas"),
  c("Brazil", "brazil", "BR", "Americas"),
  c("Canada", "canada", "CA", "Americas"),
  c("Chile", "chile", "CL", "Americas"),
  c("Colombia", "colombia", "CO", "Americas"),
  c("Costa Rica", "costa-rica", "CR", "Americas"),
  c("Cuba", "cuba", "CU", "Americas"),
  c("Dominica", "dominica", "DM", "Americas"),
  c("Dominican Republic", "dominican-republic", "DO", "Americas"),
  c("Ecuador", "ecuador", "EC", "Americas"),
  c("El Salvador", "el-salvador", "SV", "Americas"),
  c("Grenada", "grenada", "GD", "Americas"),
  c("Guatemala", "guatemala", "GT", "Americas"),
  c("Guyana", "guyana", "GY", "Americas"),
  c("Haiti", "haiti", "HT", "Americas"),
  c("Honduras", "honduras", "HN", "Americas"),
  c("Jamaica", "jamaica", "JM", "Americas"),
  c("Mexico", "mexico", "MX", "Americas"),
  c("Nicaragua", "nicaragua", "NI", "Americas"),
  c("Panama", "panama", "PA", "Americas"),
  c("Paraguay", "paraguay", "PY", "Americas"),
  c("Peru", "peru", "PE", "Americas"),
  c("Saint Kitts and Nevis", "saint-kitts-and-nevis", "KN", "Americas"),
  c("Saint Lucia", "saint-lucia", "LC", "Americas"),
  c("Saint Vincent and the Grenadines", "saint-vincent-and-the-grenadines", "VC", "Americas"),
  c("Suriname", "suriname", "SR", "Americas"),
  c("Trinidad and Tobago", "trinidad-and-tobago", "TT", "Americas"),
  c("United States", "united-states", "US", "Americas"),
  c("Uruguay", "uruguay", "UY", "Americas"),
  c("Venezuela", "venezuela", "VE", "Americas"),
];

const OCEANIA: Region[] = [
  c("Australia", "australia", "AU", "Oceania"),
  c("Fiji", "fiji", "FJ", "Oceania"),
  c("Kiribati", "kiribati", "KI", "Oceania"),
  c("Marshall Islands", "marshall-islands", "MH", "Oceania"),
  c("Micronesia", "micronesia", "FM", "Oceania"),
  c("Nauru", "nauru", "NR", "Oceania"),
  c("New Zealand", "new-zealand", "NZ", "Oceania"),
  c("Palau", "palau", "PW", "Oceania"),
  c("Papua New Guinea", "papua-new-guinea", "PG", "Oceania"),
  c("Samoa", "samoa", "WS", "Oceania"),
  c("Solomon Islands", "solomon-islands", "SB", "Oceania"),
  c("Tonga", "tonga", "TO", "Oceania"),
  c("Tuvalu", "tuvalu", "TV", "Oceania"),
  c("Vanuatu", "vanuatu", "VU", "Oceania"),
];

export const REGIONS: Region[] = [
  { slug: "global", name: "Global / Cross-border", countryCode: null, continent: "Global", active: true },
  ...AFRICA,
  ...ASIA,
  ...EUROPE,
  ...AMERICAS,
  ...OCEANIA,
];

/** Continent display order for grouped UIs. */
export const CONTINENT_ORDER = ["Global", "Africa", "Asia", "Europe", "Americas", "Oceania"];

export function activeRegions(): Region[] {
  return REGIONS.filter((r) => r.active);
}

export function getRegion(slug: string): Region | undefined {
  return REGIONS.find((r) => r.slug === slug);
}

export function regionName(slug: string): string {
  return getRegion(slug)?.name ?? slug;
}

/** Active regions grouped by continent, in display order. */
export function regionsByContinent(): { continent: string; regions: Region[] }[] {
  return CONTINENT_ORDER.map((continent) => ({
    continent,
    regions: activeRegions().filter((r) => r.continent === continent),
  })).filter((g) => g.regions.length > 0);
}

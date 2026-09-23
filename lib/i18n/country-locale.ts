import worldCountries from "world-countries";
import type { Country } from "@/lib/countries";
import {
  buildStubDescription,
  buildStubHighlights,
  isStubCountry,
} from "@/lib/country-brief";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import type { OverviewFacts, WikiContent } from "@/lib/wiki";
import { georgiaWiki } from "@/lib/wiki/georgia";
import { georgiaWikiEn } from "@/lib/wiki/georgia-en";

const REGION_EN: Record<string, string> = {
  Азия: "Asia",
  Антарктика: "Antarctica",
  Африка: "Africa",
  "Ближний Восток": "Middle East",
  Европа: "Europe",
  "Карибский бассейн": "Caribbean",
  Океания: "Oceania",
  "Северная Америка": "North America",
  "Центральная Америка": "Central America",
  "Южная Америка": "South America",
};

const ENGLISH_NAME_BY_CODE = new Map(
  worldCountries.map((entry) => [entry.cca2.toUpperCase(), entry.name.common]),
);

const RICH_EN: Record<
  string,
  {
    name: string;
    region: string;
    description: string;
    highlights: string[];
    facts?: OverviewFacts;
  }
> = {
  georgia: {
    name: "Georgia",
    region: "Europe",
    description:
      "People come here not for perfect service, but for the people, the food, and the feeling that life runs a little warmer.",
    highlights: [
      "Mountains and sea",
      "Georgian cuisine",
      "Wine regions",
    ],
    facts: {
      area: "About 69,700 km² — a compact country with very different landscapes.",
      population:
        "About 3.7 million people; most live in Tbilisi and other large cities.",
      languages:
        "Official language is Georgian. In cities you often hear Russian and English.",
      religion:
        "Most people belong to the Georgian Orthodox Church; Muslim and other communities live here too.",
      government:
        "A parliamentary republic: the president is head of state, and the government is led by the prime minister. Check current names before travel.",
    },
  },
  portugal: {
    name: "Portugal",
    region: "Europe",
    description:
      "People come for the ocean, soft light, and the sense that a day can stretch a little longer.",
    highlights: [
      "Atlantic Ocean",
      "Portuguese cuisine",
      "Historic cities",
    ],
  },
  "south-korea": {
    name: "South Korea",
    region: "Asia",
    description:
      "A dense mix of technology, food culture, and cities that move at high speed.",
    highlights: ["K-pop and dramas", "Korean cuisine", "Modern culture"],
  },
  thailand: {
    name: "Thailand",
    region: "Asia",
    description:
      "Beaches, street food, and cities where travel and long stays often blend together.",
    highlights: ["Beaches", "Street food", "Temples"],
  },
  argentina: {
    name: "Argentina",
    region: "South America",
    description:
      "Wide geography — from Buenos Aires to Patagonia — with a strong food and football culture.",
    highlights: ["Patagonia", "Tango and local food", "Wine regions"],
  },
};

export function getCountryName(country: Country, locale: Locale): string {
  if (locale === "ru") {
    return country.name;
  }

  return (
    RICH_EN[country.slug]?.name ??
    ENGLISH_NAME_BY_CODE.get(country.countryCode.toUpperCase()) ??
    country.mapKeys[0] ??
    country.name
  );
}

export function getCountryRegion(country: Country, locale: Locale): string {
  if (locale === "ru") {
    return country.region;
  }

  return (
    RICH_EN[country.slug]?.region ??
    REGION_EN[country.region] ??
    country.region
  );
}

export function getCountryDescription(
  country: Country,
  locale: Locale,
): string {
  if (!isStubCountry(country)) {
    if (locale === "ru") {
      return country.description;
    }

    const rich = RICH_EN[country.slug];
    if (rich) {
      return rich.description;
    }

    return country.description;
  }

  return buildStubDescription(
    country,
    locale,
    getCountryName(country, locale),
    getCountryRegion(country, locale),
  );
}

export function getCountryHighlights(
  country: Country,
  locale: Locale,
): string[] {
  if (!isStubCountry(country)) {
    if (locale === "en") {
      return RICH_EN[country.slug]?.highlights ?? country.highlights;
    }

    return country.highlights;
  }

  return buildStubHighlights(
    country,
    locale,
    getCountryRegion(country, locale),
  );
}

export function getCountryFacts(
  country: Country,
  locale: Locale,
): OverviewFacts | undefined {
  if (locale === "ru") {
    return country.facts;
  }

  return RICH_EN[country.slug]?.facts ?? country.facts;
}

export function getCountryWikiContent(
  country: Country,
  locale: Locale,
): WikiContent {
  if (country.slug === "georgia") {
    return locale === "en" ? georgiaWikiEn : georgiaWiki;
  }

  if (locale === "ru") {
    return country.wiki;
  }

  // Stub / partial countries: keep structured keys but English-facing short notes
  const wiki: WikiContent = {};

  for (const [key, value] of Object.entries(country.wiki)) {
    if (!value?.trim()) {
      continue;
    }

    wiki[key as keyof WikiContent] = value;
  }

  return wiki;
}

export function formatVerifiedDate(isoDate: string, locale: Locale): string {
  const [year, month, day] = isoDate.split("-").map(Number);
  const months = getDictionary(locale).months;

  if (locale === "en") {
    return `${months[month - 1]} ${day}, ${year}`;
  }

  return `${day} ${months[month - 1]} ${year}`;
}

export function getLocalizedRegions(
  regions: string[],
  locale: Locale,
): { value: string; label: string }[] {
  const collator = new Intl.Collator(locale === "en" ? "en" : "ru");

  return regions
    .map((region) => ({
      value: region,
      label: locale === "en" ? (REGION_EN[region] ?? region) : region,
    }))
    .sort((a, b) => collator.compare(a.label, b.label));
}

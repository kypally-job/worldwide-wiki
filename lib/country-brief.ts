import worldCountries from "world-countries";
import type { Country } from "@/lib/countries";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary, translate } from "@/lib/i18n/dictionaries";

type WorldEntry = (typeof worldCountries)[number];

const BY_CODE = new Map(
  worldCountries.map((entry) => [entry.cca2.toUpperCase(), entry]),
);

const STUB_DESCRIPTION_MARKERS = [
  "Страница уже в каталоге",
  "already in the catalog",
  "will be filled in next",
];

export function isStubCountry(country: Country): boolean {
  if (country.isPlaceholder) {
    return true;
  }

  if (!country.highlights?.length) {
    return true;
  }

  return STUB_DESCRIPTION_MARKERS.some((marker) =>
    country.description.includes(marker),
  );
}

function getWorldEntry(country: Country): WorldEntry | undefined {
  return BY_CODE.get(country.countryCode.toUpperCase());
}

export type CountryBriefMeta = {
  capital?: string;
  languages: string[];
  subregion?: string;
};

export function getCountryBriefMeta(country: Country): CountryBriefMeta {
  const entry = getWorldEntry(country);
  const languages = entry?.languages
    ? Object.values(entry.languages).filter(Boolean).slice(0, 2)
    : [];

  return {
    capital: entry?.capital?.[0]?.trim() || undefined,
    languages,
    subregion: entry?.subregion || undefined,
  };
}

export function buildStubDescription(
  country: Country,
  locale: Locale,
  name: string,
  region: string,
): string {
  const dictionary = getDictionary(locale);
  const meta = getCountryBriefMeta(country);
  const languages =
    meta.languages.join(", ") ||
    (locale === "en" ? "local languages" : "местные языки");
  const capital =
    meta.capital || (locale === "en" ? "not listed" : "не указана");

  return translate(dictionary, "catalog.briefLead", {
    name,
    region,
    capital,
    languages,
  });
}

export function buildStubHighlights(
  country: Country,
  locale: Locale,
  _region: string,
): string[] {
  const dictionary = getDictionary(locale);
  const meta = getCountryBriefMeta(country);
  const chips: string[] = [];

  for (const language of meta.languages.slice(0, 2)) {
    chips.push(
      translate(dictionary, "catalog.briefLanguage", {
        name: language,
      }),
    );
  }

  return chips;
}

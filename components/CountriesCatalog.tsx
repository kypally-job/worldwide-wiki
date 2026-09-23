"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import CountryCoverMedia from "@/components/CountryCoverMedia";
import CountryMotif from "@/components/CountryMotif";
import RegionFilter from "@/components/RegionFilter";
import { countries, hasValidFlagCode, regions } from "@/lib/countries";
import { getCountryCover } from "@/lib/country-cover";
import {
  getCountryDescription,
  getCountryHighlights,
  getCountryName,
  getCountryRegion,
  getLocalizedRegions,
} from "@/lib/i18n/country-locale";
import { useLocale } from "@/lib/i18n/LocaleProvider";

const ALL_REGIONS = "__all__";

export default function CountriesCatalog() {
  const { locale, t } = useLocale();
  const [search, setSearch] = useState("");
  const [selectedRegion, setSelectedRegion] = useState(ALL_REGIONS);

  const regionOptions = useMemo(
    () => [
      { value: ALL_REGIONS, label: t("catalog.allRegions") },
      ...getLocalizedRegions(regions, locale),
    ],
    [locale, t],
  );

  const filteredCountries = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    const collator = new Intl.Collator(locale === "en" ? "en" : "ru");

    return countries
      .filter((country) => {
        const displayName = getCountryName(country, locale);
        const displayRegion = getCountryRegion(country, locale);
        const displayDescription = getCountryDescription(country, locale);
        const displayHighlights = getCountryHighlights(country, locale);

        const searchableText = [
          displayName,
          displayRegion,
          displayDescription,
          country.name,
          country.region,
          ...displayHighlights,
          ...country.mapKeys,
        ]
          .join(" ")
          .toLowerCase();

        const matchesSearch =
          normalizedSearch.length === 0 ||
          searchableText.includes(normalizedSearch);

        const matchesRegion =
          selectedRegion === ALL_REGIONS || country.region === selectedRegion;

        return matchesSearch && matchesRegion;
      })
      .sort((a, b) =>
        collator.compare(
          getCountryName(a, locale),
          getCountryName(b, locale),
        ),
      );
  }, [search, selectedRegion, locale]);

  return (
    <div className="mx-auto max-w-[var(--content-max)] px-5 py-12 sm:px-6 md:py-16 lg:px-8">
      <header className="max-w-2xl">
        <p className="font-heading text-terracotta">{t("catalog.eyebrow")}</p>

        <h1 className="mt-3 font-heading text-5xl font-normal leading-[1.08] tracking-tight text-sand md:text-6xl">
          {t("catalog.title")}
        </h1>

        <p className="mt-5 text-[1.05rem] leading-8 text-sand/65">
          {t("catalog.lead")}
        </p>
      </header>

      <section className="mt-10 border-y border-line py-6">
        <div className="grid gap-5 md:grid-cols-[1fr_240px] md:items-end">
          <label className="block">
            <span className="mb-2 block text-[13px] font-medium tracking-wide text-sand/50">
              {t("catalog.searchLabel")}
            </span>

            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={t("catalog.searchPlaceholder")}
              className="w-full border-b border-line-strong bg-transparent py-2.5 text-sand outline-none transition placeholder:text-sand/35 focus:border-terracotta"
            />
          </label>

          <RegionFilter
            options={regionOptions}
            value={selectedRegion}
            onChange={setSelectedRegion}
          />
        </div>
      </section>

      <div className="mt-8 flex items-center justify-between gap-4">
        <p className="text-sm text-sand/55">
          {t("catalog.found", { count: filteredCountries.length })}
        </p>

        {(search || selectedRegion !== ALL_REGIONS) && (
          <button
            type="button"
            onClick={() => {
              setSearch("");
              setSelectedRegion(ALL_REGIONS);
            }}
            className="text-sm font-medium text-terracotta transition hover:text-terracotta-light"
          >
            {t("map.reset")}
          </button>
        )}
      </div>

      {filteredCountries.length > 0 ? (
        <div className="mt-5 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredCountries.map((country) => {
            const name = getCountryName(country, locale);
            const region = getCountryRegion(country, locale);
            const description = getCountryDescription(country, locale);
            const highlights = getCountryHighlights(country, locale).slice(
              0,
              3,
            );
            const cover = getCountryCover(country);

            return (
              <article key={country.slug}>
                <Link
                  href={`/countries/${country.slug}`}
                  className="group flex h-full flex-col overflow-hidden bg-panel ring-1 ring-[var(--line)] transition hover:ring-terracotta/45 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta"
                >
                  <div className="relative h-52 overflow-hidden bg-[#0e0b14]/30">
                    <CountryCoverMedia cover={cover} alt={name} />
                    <CountryMotif
                      slug={country.slug}
                      layer="card"
                      region={country.region}
                    />

                    <span className="absolute bottom-4 left-4 inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.18em] text-[#f6eef8]">
                      {hasValidFlagCode(country.countryCode) && (
                        <span
                          className={`fi fi-${country.countryCode.toLowerCase()} inline-block h-3.5 w-[1.2rem] rounded-[2px] bg-white/10`}
                          aria-hidden="true"
                        />
                      )}
                      {region}
                    </span>
                  </div>

                  <div className="flex flex-1 flex-col px-5 py-4">
                    <h2 className="font-heading text-[1.55rem] font-normal tracking-tight text-sand">
                      {name}
                    </h2>

                    <p className="mt-2 line-clamp-3 flex-1 text-[15px] leading-6 text-sand/62">
                      {description}
                    </p>

                    {highlights.length > 0 && (
                      <ul className="mt-3.5 flex flex-wrap gap-1.5">
                        {highlights.map((item) => (
                          <li
                            key={item}
                            className="rounded-md border border-line bg-surface-chip px-2.5 py-1 text-[12px] leading-snug text-sand/70"
                          >
                            {item}
                          </li>
                        ))}
                      </ul>
                    )}

                    <span className="mt-4 inline-flex font-medium text-terracotta transition group-hover:text-terracotta-light">
                      {t("catalog.openCountry")} →
                    </span>
                  </div>
                </Link>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="mt-8 border border-dashed border-line-strong bg-panel p-10 text-center">
          <h2 className="font-heading text-2xl font-normal text-sand">
            {t("catalog.nothingFound")}
          </h2>
          <p className="mt-2 text-sand/60">{t("catalog.tryChangeSearch")}</p>
        </div>
      )}
    </div>
  );
}

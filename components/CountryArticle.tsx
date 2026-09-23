"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import CountryMotif from "@/components/CountryMotif";
import CountryUsefulAside from "@/components/CountryUsefulAside";
import WikiGuide from "@/components/WikiGuide";
import WikiText from "@/components/WikiText";
import { shouldHideWikiSectionInArticle } from "@/lib/country-resources";
import type { Country } from "@/lib/countries";
import { hasValidFlagCode } from "@/lib/countries";
import {
  formatVerifiedDate,
  getCountryDescription,
  getCountryFacts,
  getCountryHighlights,
  getCountryName,
  getCountryRegion,
  getCountryWikiContent,
} from "@/lib/i18n/country-locale";
import { useLocale } from "@/lib/i18n/LocaleProvider";
import { getWikiSections } from "@/lib/wiki";

export default function CountryArticle({ country }: { country: Country }) {
  const { locale, t, dictionary } = useLocale();

  const name = getCountryName(country, locale);
  const region = getCountryRegion(country, locale);
  const description = getCountryDescription(country, locale);
  const highlights = getCountryHighlights(country, locale).slice(0, 5);
  const facts = getCountryFacts(country, locale);
  const wiki = getCountryWikiContent(country, locale);

  const sections = useMemo(() => {
    const all = getWikiSections(name, wiki, { locale });
    return all.filter(
      (section) => !shouldHideWikiSectionInArticle(section.id, true),
    );
  }, [name, wiki, locale]);

  const snapshotFacts = (
    [
      { id: "area" as const, title: dictionary.wiki.facts.area },
      { id: "population" as const, title: dictionary.wiki.facts.population },
      { id: "languages" as const, title: dictionary.wiki.facts.languages },
    ] as const
  )
    .map((fact) => ({ ...fact, value: facts?.[fact.id] }))
    .filter((fact) => Boolean(fact.value));

  const extraOverviewFacts = (
    [
      { id: "religion" as const, title: dictionary.wiki.facts.religion },
      { id: "government" as const, title: dictionary.wiki.facts.government },
    ] as const
  )
    .map((fact) => ({ ...fact, value: facts?.[fact.id] }))
    .filter((fact) => Boolean(fact.value));

  return (
    <div className="relative pb-24">
      <section className="relative overflow-hidden bg-ink">
        <div className="absolute inset-0">
          <Image
            src={country.imageUrl}
            alt=""
            fill
            priority
            sizes="100vw"
            unoptimized={
              country.imageUrl.includes("wikimedia.org") ||
              country.imageUrl.includes("wikipedia.org")
            }
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--hero-shade)] via-[var(--hero-mid)] to-[#d56089]/18" />
        </div>
        <CountryMotif slug={country.slug} layer="hero" />

        <div className="relative mx-auto max-w-[var(--content-max)] px-5 py-5 sm:px-6 md:py-6 lg:px-8 on-media">
          <p className="text-[12px] font-medium tracking-wide text-sand/60">
            <Link
              href="/countries"
              className="transition hover:text-sand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta-light"
            >
              {t("country.countries")}
            </Link>
            <span className="mx-2 text-sand/35" aria-hidden="true">
              /
            </span>
            {name}
          </p>

          <div className="mt-3.5 text-sand">
            <p className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.18em] text-sand/55">
              {hasValidFlagCode(country.countryCode) && (
                <span
                  className={`fi fi-${country.countryCode.toLowerCase()} inline-block h-3 w-[1.05rem] rounded-[1px]`}
                  aria-hidden="true"
                />
              )}
              {region}
            </p>

            <h1 className="mt-1.5 font-heading text-[2.6rem] font-normal leading-[1.05] tracking-tight sm:text-5xl md:text-[3.25rem]">
              {name}
            </h1>

            <p className="mt-2.5 max-w-[38rem] text-[0.98rem] leading-6 text-sand/78">
              {description}
            </p>

            {highlights.length > 0 && (
              <ul className="mt-3.5 flex flex-wrap gap-1.5">
                {highlights.map((item) => (
                  <li
                    key={item}
                    className="rounded-md border border-white/12 bg-black/25 px-2.5 py-1 text-[12px] leading-snug text-sand/80 backdrop-blur-sm"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            )}

            {snapshotFacts.length > 0 && (
              <dl className="mt-4 grid max-w-[36rem] grid-cols-2 gap-x-6 gap-y-2.5 sm:grid-cols-3">
                {snapshotFacts.map((fact) => (
                  <div key={fact.id}>
                    <dt className="text-[10px] font-medium uppercase tracking-[0.14em] text-sand/45">
                      {fact.title}
                    </dt>
                    <dd className="mt-0.5 text-[13px] leading-snug text-sand/85">
                      {fact.value}
                    </dd>
                  </div>
                ))}
              </dl>
            )}

            <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-sm">
              <Link
                href={`/?country=${country.slug}`}
                className="font-medium text-terracotta transition hover:text-terracotta-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta-light"
              >
                {t("country.onMap")}
              </Link>
              <Link
                href={`/people?country=${country.slug}`}
                className="text-sand/65 transition hover:text-sand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta-light"
              >
                {t("country.masters")}
              </Link>
              {country.updatedAt && (
                <span className="text-[12px] text-sand/40">
                  {t("country.verified", {
                    date: formatVerifiedDate(country.updatedAt, locale),
                  })}
                </span>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="relative">
        {sections.length > 0 && (
          <WikiGuide
            items={sections.map((section) => ({
              id: section.id,
              title: section.title,
              subsections: section.subsections,
            }))}
          />
        )}

        <div className="relative mx-auto max-w-[var(--content-max)] px-5 pt-6 sm:px-6 lg:grid lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start lg:gap-8 lg:px-8 lg:pt-8 xl:grid-cols-[minmax(0,1fr)_24rem] xl:gap-10">
          <div className="min-w-0">
            {sections.length === 0 ? (
              <p className="rounded-xl border border-line bg-panel/70 px-4 py-5 text-sm leading-6 text-sand/65">
                {t("country.emptyWiki", { name })}
              </p>
            ) : (
              sections.map((section) => (
                <article
                  key={section.id}
                  id={section.id}
                  className="scroll-mt-[calc(var(--header-height)+0.85rem)] border-b border-line-soft py-5 last:border-b-0"
                >
                  <h2 className="font-heading text-[1.45rem] font-normal leading-tight tracking-tight text-sand md:text-[1.65rem]">
                    {section.title}
                  </h2>

                  {section.id === "overview" &&
                    extraOverviewFacts.length > 0 && (
                      <dl className="mt-3 grid gap-x-8 gap-y-2.5 sm:grid-cols-2 lg:grid-cols-3">
                        {extraOverviewFacts.map((fact) => (
                          <div
                            key={fact.id}
                            className={
                              fact.id === "government"
                                ? "sm:col-span-2 lg:col-span-3"
                                : ""
                            }
                          >
                            <dt className="text-[11px] font-medium uppercase tracking-[0.12em] text-terracotta/85">
                              {fact.title}
                            </dt>
                            <dd className="mt-1 text-[14px] leading-6 text-sand/72">
                              {fact.value}
                            </dd>
                          </div>
                        ))}
                      </dl>
                    )}

                  <WikiText text={section.text} sectionId={section.id} />
                </article>
              ))
            )}
          </div>

          <div className="mt-10 border-t border-line-soft pt-8 lg:mt-0 lg:border-t-0 lg:pt-1">
            <CountryUsefulAside country={country} />
          </div>
        </div>
      </div>
    </div>
  );
}

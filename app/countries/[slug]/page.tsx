import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import CountryMotif from "@/components/CountryMotif";
import WikiGuide from "@/components/WikiGuide";
import WikiText from "@/components/WikiText";
import { countries, getCountryBySlug, hasValidFlagCode } from "@/lib/countries";
import { getWikiGroup, getWikiSections, OVERVIEW_FACTS } from "@/lib/wiki";

const MONTHS_RU = [
  "января",
  "февраля",
  "марта",
  "апреля",
  "мая",
  "июня",
  "июля",
  "августа",
  "сентября",
  "октября",
  "ноября",
  "декабря",
];

function formatUpdatedAt(isoDate: string): string {
  const [year, month, day] = isoDate.split("-").map(Number);

  return `${day} ${MONTHS_RU[month - 1]} ${year}`;
}

type CountryPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return countries.map((country) => ({ slug: country.slug }));
}

export async function generateMetadata({
  params,
}: CountryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const country = getCountryBySlug(slug);

  if (!country) {
    return {
      title: "Страна не найдена — Worldwide WIKI",
    };
  }

  return {
    title: `${country.name} — Worldwide WIKI`,
    description: country.description,
  };
}

export default async function CountryPage({ params }: CountryPageProps) {
  const { slug } = await params;
  const country = getCountryBySlug(slug);

  if (!country) {
    notFound();
  }

  const sections = getWikiSections(country.name, country.wiki);

  return (
    <div className="relative pb-28">
      <section className="relative overflow-hidden bg-ink">
        <div className="absolute inset-0">
          <Image
            src={country.imageUrl}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--hero-shade)] via-[var(--hero-mid)] to-[#d56089]/18" />
        </div>
        <CountryMotif slug={country.slug} layer="hero" />

        <div className="relative mx-auto max-w-[1180px] px-5 py-7 sm:px-6 md:py-9 lg:px-8 on-media">
          <p className="text-[13px] font-medium tracking-wide text-sand/65">
            <Link
              href="/countries"
              className="transition hover:text-sand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta-light"
            >
              Страны
            </Link>
            <span className="mx-2 text-sand/35" aria-hidden="true">
              /
            </span>
            {country.name}
          </p>

          <div className="mt-5 text-sand">
            <p className="flex items-center gap-2.5 text-[11px] font-medium uppercase tracking-[0.2em] text-sand/55">
              {hasValidFlagCode(country.countryCode) && (
                <span
                  className={`fi fi-${country.countryCode.toLowerCase()} inline-block h-3 w-[1.05rem] rounded-[1px]`}
                  aria-hidden="true"
                />
              )}
              {country.region}
            </p>

            <h1 className="mt-2.5 font-heading text-5xl font-normal leading-[1.06] tracking-tight md:text-6xl">
              {country.name}
            </h1>

            <p className="mt-3 max-w-[40rem] text-[1.02rem] leading-7 text-sand/80">
              {country.description}
            </p>

            {country.updatedAt && (
              <p className="mt-3 text-sm text-sand/45">
                Данные проверены {formatUpdatedAt(country.updatedAt)}
              </p>
            )}

            <div className="mt-5 flex flex-wrap items-center gap-x-7 gap-y-2 text-sm">
              <Link
                href={`/?country=${country.slug}`}
                className="font-medium text-terracotta transition hover:text-terracotta-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta-light"
              >
                Смотреть на карте
              </Link>
              <Link
                href={`/people?country=${country.slug}`}
                className="text-sand/70 transition hover:text-sand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta-light"
              >
                Мастера в этой стране
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="relative">
        <CountryMotif slug={country.slug} layer="page" />

        <WikiGuide
          items={sections.map((section) => ({
            id: section.id,
            title: section.title,
            summary: section.summary,
            isPlaceholder: section.isPlaceholder,
            subsections: section.subsections,
          }))}
        />

        <div className="relative mx-auto max-w-[1180px] px-5 pt-8 sm:px-6 lg:px-8 lg:pt-10">
          {sections.map((section) => {
            const group = getWikiGroup(section.id);

            return (
              <article
                key={section.id}
                id={section.id}
                className="scroll-mt-[calc(var(--header-height)+0.85rem)] border-b border-line-soft py-6 last:border-b-0 lg:py-8"
              >
                <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-terracotta/80">
                  {group.label}
                </p>
                <h2 className="mt-1.5 font-heading text-[1.75rem] font-normal leading-tight tracking-tight text-sand md:text-[1.95rem]">
                  {section.title}
                </h2>
                <p className="mt-1 text-[15px] leading-6 text-sand/50">
                  {section.summary}
                </p>

                {section.subsections.length > 0 && (
                  <nav
                    aria-label={`Подразделы: ${section.title}`}
                    className="mt-4 flex flex-wrap gap-1.5"
                  >
                    {section.subsections.map((subsection) => (
                      <a
                        key={subsection.id}
                        href={`#${subsection.id}`}
                        className="rounded-full border border-line bg-surface-chip px-3.5 py-1.5 text-[13px] text-sand/70 transition hover:border-terracotta/40 hover:text-terracotta-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta"
                      >
                        {subsection.title}
                      </a>
                    ))}
                  </nav>
                )}

                {section.id === "overview" && country.facts && (
                  <dl className="mt-5 grid gap-x-8 gap-y-4 sm:grid-cols-2">
                    {OVERVIEW_FACTS.map((fact) => {
                      const value = country.facts?.[fact.id];

                      if (!value) {
                        return null;
                      }

                      return (
                        <div
                          key={fact.id}
                          className={
                            fact.id === "government" ? "sm:col-span-2" : ""
                          }
                        >
                          <dt className="font-heading text-[13px] text-terracotta">
                            {fact.title}
                          </dt>
                          <dd className="mt-1.5 text-[15px] leading-7 text-sand/72">
                            {value}
                          </dd>
                        </div>
                      );
                    })}
                  </dl>
                )}

                <WikiText
                  text={section.text}
                  sectionId={section.id}
                  isPlaceholder={section.isPlaceholder}
                />
              </article>
            );
          })}

          <aside className="mt-4 flex flex-col gap-6 border-t border-line pt-6 sm:flex-row sm:gap-12">
            <div>
              <p className="font-heading text-lg text-sand">Мастера</p>
              <p className="mt-2 text-sm leading-6 text-sand/55">
                Исполнители живут отдельным разделом, не внутри вики.
              </p>
              <Link
                href={`/people?country=${country.slug}`}
                className="mt-3 inline-flex text-sm font-medium text-terracotta transition hover:text-terracotta-light"
              >
                Перейти к мастерам
              </Link>
            </div>
            <div>
              <p className="font-heading text-lg text-sand">Карта</p>
              <p className="mt-2 text-sm leading-6 text-sand/55">
                Вернуться к стране {country.name} среди других направлений.
              </p>
              <Link
                href={`/?country=${country.slug}`}
                className="mt-3 inline-flex text-sm font-medium text-terracotta transition hover:text-terracotta-light"
              >
                Открыть на карте
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

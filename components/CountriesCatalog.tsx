"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import RegionFilter from "@/components/RegionFilter";
import { countries, hasValidFlagCode, regions } from "@/lib/countries";

export default function CountriesCatalog() {
  const [search, setSearch] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("Все регионы");

  const filteredCountries = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return countries.filter((country) => {
      const searchableText = [
        country.name,
        country.region,
        country.description,
        ...country.highlights,
        ...Object.values(country.wiki),
      ]
        .join(" ")
        .toLowerCase();

      const matchesSearch =
        normalizedSearch.length === 0 ||
        searchableText.includes(normalizedSearch);

      const matchesRegion =
        selectedRegion === "Все регионы" ||
        country.region === selectedRegion;

      return matchesSearch && matchesRegion;
    });
  }, [search, selectedRegion]);

  return (
    <div className="mx-auto max-w-[1180px] px-5 py-12 sm:px-6 md:py-16 lg:px-8">
      <header className="max-w-2xl">
        <p className="font-heading text-terracotta">База знаний</p>

        <h1 className="mt-3 font-heading text-5xl font-normal leading-[1.08] tracking-tight text-sand md:text-6xl">
          Страны мира
        </h1>

        <p className="mt-5 text-[1.05rem] leading-8 text-sand/65">
          Изучай направления, сравнивай условия и находи информацию для
          путешествий, переезда, учёбы и жизни в другой стране.
        </p>
      </header>

      <section className="mt-10 border-y border-line py-6">
        <div className="grid gap-5 md:grid-cols-[1fr_240px] md:items-end">
          <label className="block">
            <span className="mb-2 block text-[13px] font-medium tracking-wide text-sand/50">
              Поиск по странам
            </span>

            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Например, Грузия"
              className="w-full border-b border-line-strong bg-transparent py-2.5 text-sand outline-none transition placeholder:text-sand/35 focus:border-terracotta"
            />
          </label>

          <RegionFilter
            regions={regions}
            value={selectedRegion}
            onChange={setSelectedRegion}
          />
        </div>
      </section>

      <div className="mt-8 flex items-center justify-between gap-4">
        <p className="text-sm text-sand/55">
          Найдено стран: {filteredCountries.length}
        </p>

        {(search || selectedRegion !== "Все регионы") && (
          <button
            type="button"
            onClick={() => {
              setSearch("");
              setSelectedRegion("Все регионы");
            }}
            className="text-sm font-medium text-terracotta transition hover:text-terracotta-light"
          >
            Сбросить фильтры
          </button>
        )}
      </div>

      {filteredCountries.length > 0 ? (
        <div className="mt-5 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredCountries.map((country) => (
            <article key={country.slug}>
              <Link
                href={`/countries/${country.slug}`}
                className="group flex h-full flex-col overflow-hidden bg-panel ring-1 ring-[var(--line)] transition hover:ring-terracotta/45 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta"
              >
                <div className="relative h-48 overflow-hidden bg-[#0e0b14]/20">
                  <Image
                    src={country.imageUrl}
                    alt={country.name}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition duration-700 group-hover:scale-[1.03]"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-[#0e0b14]/75 via-[#0e0b14]/20 to-transparent" />

                  <span className="absolute bottom-4 left-4 inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.18em] text-[#f6eef8]">
                    {hasValidFlagCode(country.countryCode) && (
                      <span
                        className={`fi fi-${country.countryCode.toLowerCase()} inline-block h-3.5 w-[1.2rem] rounded-[2px] bg-white`}
                        aria-hidden="true"
                      />
                    )}
                    {country.region}
                  </span>
                </div>

                <div className="flex flex-1 flex-col px-5 py-4">
                  <h2 className="font-heading text-[1.55rem] font-normal tracking-tight text-sand">
                    {country.name}
                  </h2>

                  <p className="mt-2 flex-1 text-[15px] leading-6 text-sand/62">
                    {country.description}
                  </p>

                  <p className="mt-3 text-[13px] tracking-wide text-sage">
                    {country.highlights.slice(0, 2).join(" · ")}
                  </p>

                  <span className="mt-4 inline-flex font-medium text-terracotta transition group-hover:text-terracotta-light">
                    Открыть страну →
                  </span>
                </div>
              </Link>
            </article>
          ))}
        </div>
      ) : (
        <div className="mt-8 border border-dashed border-line-strong bg-panel p-10 text-center">
          <h2 className="font-heading text-2xl font-normal text-sand">
            Ничего не найдено
          </h2>
          <p className="mt-2 text-sand/60">
            Попробуй изменить поисковый запрос или выбрать другой регион.
          </p>
        </div>
      )}
    </div>
  );
}

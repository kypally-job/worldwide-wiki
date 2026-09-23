"use client";

import Image from "next/image";
import {
  getCountryUsefulLinks,
  getCountryVideos,
  isYoutubeSearchVideo,
  youtubeSearchUrl,
  youtubeThumbUrl,
  youtubeWatchUrl,
  type CountryLink,
} from "@/lib/country-resources";
import type { Country } from "@/lib/countries";
import { useLocale, useT } from "@/lib/i18n/LocaleProvider";

function linkHost(href: string): string {
  try {
    return new URL(href).hostname.replace(/^www\./, "");
  } catch {
    return href;
  }
}

function UsefulLinks({ links }: { links: CountryLink[] }) {
  const t = useT();

  if (links.length === 0) {
    return null;
  }

  return (
    <section className="relative overflow-hidden rounded-2xl border border-line bg-panel/80 shadow-[inset_0_1px_0_rgba(246,238,248,0.04)]">
      <div
        className="pointer-events-none absolute inset-y-0 left-0 w-[3px] bg-gradient-to-b from-terracotta via-terracotta/70 to-transparent"
        aria-hidden="true"
      />
      <div
        className="absolute -right-8 -top-10 h-28 w-28 rounded-full bg-terracotta/10 blur-2xl"
        aria-hidden="true"
      />

      <div className="relative px-4 pb-3 pt-4">
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-terracotta/80">
          {t("country.atHand")}
        </p>
        <h2 className="mt-1 font-heading text-[1.2rem] font-normal tracking-tight text-sand">
          {t("country.usefulLinks")}
        </h2>
      </div>

      <ul className="relative divide-y divide-[var(--line-soft)] border-t border-line-soft">
        {links.map((link, index) => (
          <li key={link.href}>
            <a
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-3 px-4 py-3 transition hover:bg-terracotta/[0.07] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-terracotta"
            >
              <span className="w-5 shrink-0 font-heading text-[12px] tabular-nums text-terracotta/55 transition group-hover:text-terracotta">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[13.5px] leading-snug text-sand/90 transition group-hover:text-terracotta-light">
                  {link.label}
                </span>
                <span className="mt-0.5 block truncate text-[11px] text-sand/35">
                  {linkHost(link.href)}
                </span>
              </span>
              <span
                className="shrink-0 text-sand/25 transition group-hover:translate-x-0.5 group-hover:text-terracotta"
                aria-hidden="true"
              >
                ↗
              </span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}

function PlayGlyph() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
      <path d="M8.2 5.6v12.8L19 12 8.2 5.6z" />
    </svg>
  );
}

function CountryVideos({ country }: { country: Country }) {
  const t = useT();
  const { locale } = useLocale();
  const { lang, videos } = getCountryVideos(country, locale);

  return (
    <section className="relative overflow-hidden rounded-2xl border border-line bg-gradient-to-br from-panel via-panel to-terracotta/[0.07]">
      <div
        className="absolute -left-10 bottom-0 h-32 w-32 rounded-full bg-[rgba(72,52,96,0.18)] blur-3xl"
        aria-hidden="true"
      />

      <div className="relative flex items-end justify-between gap-3 px-4 pb-3 pt-4">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-sand/40">
            {t("country.watch")}
          </p>
          <h2 className="mt-1 font-heading text-[1.2rem] font-normal tracking-tight text-sand">
            {t("country.videos")}
          </h2>
        </div>
        <span className="rounded-full border border-line bg-surface-chip px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.12em] text-sand/55">
          {lang === "ru" ? "RU" : "EN"}
        </span>
      </div>

      <ul className="relative flex flex-col gap-2.5 px-3 pb-3">
        {videos.map((video) => {
          const isSearch = isYoutubeSearchVideo(video.id);
          const href = isSearch
            ? youtubeSearchUrl(video.searchQuery ?? video.title)
            : youtubeWatchUrl(video.id);

          return (
            <li key={video.id}>
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex gap-3 overflow-hidden rounded-xl border border-line-soft bg-ink/25 p-1.5 transition hover:border-terracotta/40 hover:bg-terracotta/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta"
              >
                <span className="relative h-[4.5rem] w-[7.75rem] shrink-0 overflow-hidden rounded-lg bg-surface-chip">
                  {isSearch ? (
                    <span className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#2a2038] to-[#1a1424] text-terracotta">
                      <PlayGlyph />
                    </span>
                  ) : (
                    <Image
                      src={youtubeThumbUrl(video.id)}
                      alt=""
                      fill
                      sizes="124px"
                      unoptimized
                      className="object-cover transition duration-300 group-hover:scale-[1.04]"
                    />
                  )}
                  <span className="absolute inset-0 flex items-center justify-center bg-ink/25 opacity-0 transition group-hover:opacity-100">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-terracotta text-white shadow-lg">
                      <PlayGlyph />
                    </span>
                  </span>
                </span>

                <span className="flex min-w-0 flex-1 flex-col justify-center py-1 pe-1">
                  <span className="line-clamp-3 text-[13px] font-medium leading-snug text-sand/90 transition group-hover:text-terracotta-light">
                    {video.title}
                  </span>
                  <span className="mt-1.5 flex flex-wrap items-center gap-1.5 text-[11px] text-sand/40">
                    <span>
                      {isSearch
                        ? t("country.youtubePlaylist")
                        : t("country.youtube")}
                    </span>
                    {video.topic && (
                      <span className="rounded-full border border-line-soft px-1.5 py-0.5 text-[10px] uppercase tracking-wide text-sand/45">
                        {video.topic === "travel"
                          ? t("country.tourism")
                          : t("country.relocation")}
                      </span>
                    )}
                  </span>
                </span>
              </a>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export default function CountryUsefulAside({
  country,
}: {
  country: Country;
}) {
  const { locale } = useLocale();
  const links = getCountryUsefulLinks(country, locale);

  return (
    <aside className="flex flex-col gap-5 lg:sticky lg:top-[calc(var(--header-height)+1.25rem)]">
      <UsefulLinks links={links} />
      <CountryVideos country={country} />
    </aside>
  );
}

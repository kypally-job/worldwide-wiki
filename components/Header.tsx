"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import BarsIcon from "@/components/BarsIcon";
import ThemeToggle from "@/components/ThemeToggle";
import { FEATURES } from "@/lib/features";
import { useLocale } from "@/lib/i18n/LocaleProvider";
import type { Locale } from "@/lib/i18n/config";

const languages: {
  value: Locale;
  label: string;
  shortLabel: string;
  code: string;
}[] = [
  { value: "ru", label: "Русский", shortLabel: "RU", code: "ru" },
  { value: "en", label: "English", shortLabel: "EN", code: "gb" },
];

export default function Header() {
  const pathname = usePathname();
  const headerRef = useRef<HTMLElement>(null);
  const { locale, setLocale, t } = useLocale();

  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = useMemo(
    () => [
      { label: t("nav.countries"), href: "/countries" },
      { label: t("nav.people"), href: "/people" },
      { label: t("nav.volunteering"), href: "/volunteering" },
      { label: t("nav.events"), href: "/events" },
      { label: t("nav.partners"), href: "/partners" },
    ],
    [t],
  );

  const assistantHref = "/assistant";
  const isAssistantActive =
    pathname === assistantHref || pathname.startsWith(`${assistantHref}/`);

  const selectedLanguage =
    languages.find((item) => item.value === locale) ?? languages[0];

  const closeMenus = () => {
    setIsLanguageOpen(false);
    setIsMobileMenuOpen(false);
  };

  useEffect(() => {
    setIsLanguageOpen(false);
    setIsMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!isLanguageOpen && !isMobileMenuOpen) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeMenus();
      }
    };

    const onPointerDown = (event: PointerEvent) => {
      if (!headerRef.current?.contains(event.target as Node)) {
        closeMenus();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("pointerdown", onPointerDown);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("pointerdown", onPointerDown);
    };
  }, [isLanguageOpen, isMobileMenuOpen]);

  return (
    <header
      ref={headerRef}
      className="sticky top-0 z-50 h-[var(--header-height)] text-sand"
    >
      <div
        className="pointer-events-none absolute inset-0 border-b border-line-soft bg-ink/88 backdrop-blur-xl"
        aria-hidden="true"
      />

      <div className="relative mx-auto flex h-full max-w-[var(--content-max)] items-center justify-between gap-3 px-5 sm:gap-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          onClick={closeMenus}
          className="relative z-10 flex shrink-0 items-center font-heading text-[1.2rem] font-normal tracking-tight text-terracotta transition hover:text-sand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta-light sm:text-[1.4rem]"
        >
          Worldwide WIKI
        </Link>

        <nav className="absolute inset-y-0 left-1/2 hidden -translate-x-1/2 items-center gap-1 lg:flex">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeMenus}
                className={`relative flex h-[var(--header-height)] items-center px-3 text-[14px] tracking-wide transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta-light ${
                  isActive
                    ? "text-sand after:absolute after:inset-x-3 after:bottom-0 after:h-px after:bg-terracotta"
                    : "text-sand/55 hover:text-sand"
                }`}
              >
                {item.label}
              </Link>
            );
          })}

          {FEATURES.assistant && (
            <>
              <span
                className="mx-1.5 h-4 w-px bg-[var(--line-strong)]"
                aria-hidden="true"
              />
              <Link
                href={assistantHref}
                onClick={closeMenus}
                className={`nav-assistant group relative flex h-9 items-center gap-2 rounded-lg border px-3 text-[13px] font-medium tracking-wide transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta-light ${
                  isAssistantActive
                    ? "nav-assistant--active border-terracotta/55 bg-terracotta/18 text-terracotta-light"
                    : "border-terracotta/35 bg-terracotta/[0.08] text-terracotta hover:border-terracotta/55 hover:bg-terracotta/14 hover:text-terracotta-light"
                }`}
              >
                <SakuraMark className="h-3.5 w-3.5 shrink-0 opacity-90 transition group-hover:opacity-100" />
                <span>{t("nav.assistant")}</span>
                <span
                  className="nav-assistant__spark pointer-events-none absolute -right-0.5 -top-0.5 h-1.5 w-1.5 rounded-full bg-terracotta"
                  aria-hidden="true"
                />
              </Link>
            </>
          )}
        </nav>

        <div className="relative z-10 flex shrink-0 items-center gap-1 sm:gap-1.5">
          <ThemeToggle />

          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setIsMobileMenuOpen(false);
                setIsLanguageOpen((isOpen) => !isOpen);
              }}
              className="flex h-9 w-9 items-center justify-center rounded-md text-sm text-sand/70 transition hover:bg-surface-hover hover:text-sand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta-light sm:w-auto sm:gap-2 sm:px-2.5"
              aria-label={t("nav.language")}
              aria-expanded={isLanguageOpen}
              aria-haspopup="listbox"
            >
              <span
                className={`fi fi-${selectedLanguage.code} shrink-0 rounded-[2px]`}
                aria-hidden="true"
              />
              <span className="hidden sm:inline">
                {selectedLanguage.shortLabel}
              </span>
            </button>

            {isLanguageOpen && (
              <div
                role="listbox"
                aria-label={t("nav.language")}
                className="absolute right-0 top-full z-[100] mt-2 min-w-48 overflow-hidden rounded-xl border border-line bg-panel p-1 shadow-elevated"
              >
                {languages.map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    role="option"
                    aria-selected={item.value === locale}
                    onClick={() => {
                      setLocale(item.value);
                      setIsLanguageOpen(false);
                    }}
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta ${
                      item.value === locale
                        ? "bg-surface-hover text-terracotta"
                        : "text-sand/80"
                    }`}
                  >
                    <span
                      className={`fi fi-${item.code} shrink-0 rounded-[2px]`}
                      aria-hidden="true"
                    />
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <Link
            href="/auth"
            onClick={closeMenus}
            className="ml-0.5 flex h-9 items-center rounded-md border border-line bg-transparent px-2.5 text-sm font-medium text-sand/85 transition hover:border-terracotta/45 hover:text-terracotta focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta-light sm:ml-1 sm:px-3"
          >
            {t("nav.login")}
          </Link>

          <button
            type="button"
            onClick={() => {
              setIsLanguageOpen(false);
              setIsMobileMenuOpen((isOpen) => !isOpen);
            }}
            aria-label={
              isMobileMenuOpen ? t("nav.closeMenu") : t("nav.openMenu")
            }
            aria-expanded={isMobileMenuOpen}
            className="flex h-9 w-9 items-center justify-center rounded-md text-sand transition hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta-light lg:hidden"
          >
            <BarsIcon open={isMobileMenuOpen} />
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <nav className="absolute inset-x-0 top-full z-[80] border-b border-line bg-ink/96 py-2 shadow-elevated backdrop-blur-xl lg:hidden">
          <div className="mx-auto max-w-[var(--content-max)] space-y-0.5 px-5 sm:px-6">
            {navItems.map((item) => {
              const isActive =
                pathname === item.href || pathname.startsWith(`${item.href}/`);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeMenus}
                  className={`block rounded-md px-3 py-2.5 text-[15px] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta-light ${
                    isActive
                      ? "text-terracotta"
                      : "text-sand/80 hover:bg-surface-hover hover:text-sand"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}

            {FEATURES.assistant && (
              <Link
                href={assistantHref}
                onClick={closeMenus}
                className={`nav-assistant group mt-1 flex items-center gap-2.5 rounded-lg border px-3 py-2.5 text-[15px] font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta-light ${
                  isAssistantActive
                    ? "nav-assistant--active border-terracotta/55 bg-terracotta/18 text-terracotta-light"
                    : "border-terracotta/35 bg-terracotta/[0.08] text-terracotta hover:border-terracotta/55 hover:bg-terracotta/14"
                }`}
              >
                <SakuraMark className="h-4 w-4 shrink-0" />
                <span>{t("nav.assistant")}</span>
                <span
                  className="nav-assistant__spark ml-auto h-1.5 w-1.5 rounded-full bg-terracotta"
                  aria-hidden="true"
                />
              </Link>
            )}
          </div>
        </nav>
      )}
    </header>
  );
}

function SakuraMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="currentColor"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="2.1" />
      <path d="M12 3.2c1.1 1.6 1.4 3.4.8 5.1-.9-.2-1.8-.2-2.7 0-.6-1.7-.3-3.5.8-5.1.4-.5 1.1-.5 1.1 0Z" />
      <path d="M20.1 8.6c-.4 1.9-1.6 3.3-3.2 4 .5.8.7 1.7.6 2.6 1.7-.3 3.3-1.4 4.1-3 .3-.6-.1-1.2-.6-1.4-.3-.1-.6-.1-.9-.2Z" />
      <path d="M17 19.6c-1.7-.7-2.8-2-3.1-3.7-.8.4-1.7.6-2.6.6 0 1.8.9 3.4 2.4 4.3.6.3 1.2 0 1.3-.5.1-.2.1-.5 0-.7Z" />
      <path d="M7 19.6c.4.7.1 1.3-.5 1.4-1.8-.8-2.9-2.5-3.1-4.4.9 0 1.8-.2 2.6-.6.3 1.7 1.4 3 3.1 3.6Z" />
      <path d="M3.9 8.6c.9 1.6 2.4 2.7 4.1 3-.1.9.1 1.8.6 2.6-1.6-.7-2.8-2.1-3.2-4-.3-.6-.6-.7-.9-.6-.5.2-.9.8-.6 1Z" />
    </svg>
  );
}

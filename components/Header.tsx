"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import BarsIcon from "@/components/BarsIcon";
import ThemeToggle from "@/components/ThemeToggle";

const navItems = [
  { label: "Люди", href: "/people" },
  { label: "Волонтёрство", href: "/volunteering" },
  { label: "Афиша", href: "/events" },
  { label: "Партнёры", href: "/partners" },
  { label: "Ассистент", href: "/assistant" },
];

const languages = [
  { value: "ru", label: "Русский", shortLabel: "RU", code: "ru" },
  { value: "en", label: "English", shortLabel: "EN", code: "gb" },
  { value: "ka", label: "ქართული", shortLabel: "KA", code: "ge" },
  { value: "pt", label: "Português", shortLabel: "PT", code: "pt" },
  { value: "ko", label: "한국어", shortLabel: "KO", code: "kr" },
];

export default function Header() {
  const pathname = usePathname();
  const headerRef = useRef<HTMLElement>(null);

  const [language, setLanguage] = useState("ru");
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const selectedLanguage =
    languages.find((item) => item.value === language) ?? languages[0];

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

      <div className="relative mx-auto flex h-full max-w-[1180px] items-center justify-between gap-4 px-5 sm:px-6 lg:px-8">
        <Link
          href="/"
          onClick={closeMenus}
          className="relative z-10 flex shrink-0 items-center font-heading text-[1.2rem] font-normal tracking-tight text-terracotta transition hover:text-sand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta-light sm:text-[1.4rem]"
        >
          Worldwide WIKI
        </Link>

        <nav className="absolute inset-y-0 left-1/2 hidden -translate-x-1/2 items-center lg:flex">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeMenus}
                className={`relative flex h-[var(--header-height)] items-center px-2.5 text-[14px] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta-light ${
                  isActive
                    ? "text-sand after:absolute after:inset-x-2.5 after:bottom-0 after:h-px after:bg-terracotta"
                    : "text-sand/50 hover:text-sand"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="relative z-10 flex shrink-0 items-center gap-1.5 sm:gap-2">
          <div className="flex items-center gap-1">
            <ThemeToggle />

            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setIsLanguageOpen((isOpen) => !isOpen);
                }}
                className="flex h-9 w-9 items-center justify-center rounded-md text-sm text-sand/70 transition hover:bg-surface-hover hover:text-sand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta-light sm:w-auto sm:gap-2 sm:px-2"
                aria-label="Язык сайта"
                aria-expanded={isLanguageOpen}
                aria-haspopup="listbox"
              >
                <span
                  className={`fi fi-${selectedLanguage.code} shrink-0 rounded-[2px]`}
                  aria-hidden="true"
                />
                <span className="hidden sm:inline">{selectedLanguage.shortLabel}</span>
              </button>

              {isLanguageOpen && (
                <div
                  role="listbox"
                  aria-label="Язык"
                  className="absolute right-0 top-full z-[100] mt-2 min-w-48 overflow-hidden rounded-xl border border-line bg-panel p-1 shadow-elevated"
                >
                  {languages.map((item) => (
                    <button
                      key={item.value}
                      type="button"
                      role="option"
                      aria-selected={item.value === language}
                      onClick={() => {
                        setLanguage(item.value);
                        setIsLanguageOpen(false);
                      }}
                      className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta ${
                        item.value === language
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
          </div>

          <Link
            href="/auth"
            onClick={closeMenus}
            className="ml-0.5 flex h-9 items-center rounded-md bg-terracotta px-2.5 text-sm font-medium text-white transition hover:bg-terracotta-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta-light focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-ink)] sm:ml-1 sm:px-3"
          >
            Войти
          </Link>

          <button
            type="button"
            onClick={() => {
              setIsLanguageOpen(false);
              setIsMobileMenuOpen((isOpen) => !isOpen);
            }}
            aria-label={isMobileMenuOpen ? "Закрыть меню" : "Открыть меню"}
            aria-expanded={isMobileMenuOpen}
            className="flex h-9 w-9 items-center justify-center rounded-md text-sand transition hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta-light lg:hidden"
          >
            <BarsIcon open={isMobileMenuOpen} />
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <nav className="absolute inset-x-0 top-full z-[80] border-b border-line bg-ink/96 py-2 shadow-elevated backdrop-blur-xl lg:hidden">
          <div className="mx-auto max-w-[1180px] px-5 sm:px-6">
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
          </div>
        </nav>
      )}
    </header>
  );
}

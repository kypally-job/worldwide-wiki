"use client";

import { useEffect, useState } from "react";
import {
  applyTheme,
  getStoredTheme,
  resolveTheme,
  setTheme,
  type Theme,
} from "@/lib/theme";

function SunIcon() {
  return (
    <svg
      viewBox="0 0 18 18"
      className="h-[15px] w-[15px]"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.35"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <circle cx="9" cy="9" r="3.1" />
      <path d="M9 1.6v1.7M9 14.7v1.7M1.6 9h1.7M14.7 9h1.7M3.5 3.5l1.2 1.2M13.3 13.3l1.2 1.2M14.5 3.5l-1.2 1.2M4.7 13.3l-1.2 1.2" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg
      viewBox="0 0 18 18"
      className="h-[15px] w-[15px]"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.35"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M14.8 10.4A6.2 6.2 0 0 1 7.6 3.2 6.4 6.4 0 1 0 14.8 10.4Z" />
    </svg>
  );
}

export default function ThemeToggle() {
  const [theme, setThemeState] = useState<Theme>("dark");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const next = resolveTheme(getStoredTheme());
    applyTheme(next);
    setThemeState(next);
    setReady(true);
  }, []);

  const isLight = theme === "light";

  return (
    <button
      type="button"
      aria-label={isLight ? "Включить тёмную тему" : "Включить светлую тему"}
      title={isLight ? "Тёмная тема" : "Светлая тема"}
      disabled={!ready}
      onClick={() => {
        const next: Theme = isLight ? "dark" : "light";
        setTheme(next);
        setThemeState(next);
      }}
      className="relative flex h-9 w-9 items-center justify-center rounded-md text-sand/70 transition hover:bg-[var(--surface-hover)] hover:text-sand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta-light disabled:opacity-60"
    >
      <span
        className={`absolute transition duration-300 ease-out ${
          isLight
            ? "scale-90 rotate-90 opacity-0"
            : "scale-100 rotate-0 opacity-100"
        }`}
      >
        <SunIcon />
      </span>
      <span
        className={`absolute transition duration-300 ease-out ${
          isLight
            ? "scale-100 rotate-0 opacity-100"
            : "scale-90 -rotate-90 opacity-0"
        }`}
      >
        <MoonIcon />
      </span>
    </button>
  );
}

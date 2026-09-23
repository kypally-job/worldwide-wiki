export const LOCALES = ["ru", "en"] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "ru";
export const LOCALE_STORAGE_KEY = "worldwide-wiki-locale";

export function isLocale(value: unknown): value is Locale {
  return value === "ru" || value === "en";
}

export function resolveLocale(stored: string | null): Locale {
  if (isLocale(stored)) {
    return stored;
  }

  if (typeof window !== "undefined") {
    try {
      const browser = window.navigator.language.toLowerCase();
      if (browser.startsWith("en")) {
        return "en";
      }
    } catch {
      // ignore
    }
  }

  return DEFAULT_LOCALE;
}

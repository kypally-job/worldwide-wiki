const JOURNEY_KEY = "worldwide-wiki-intro-seen";
const SAKURA_COOKIE = "wiki-sakura-dismissed";
const YEAR = 60 * 60 * 24 * 365;
const JOURNEY_EVENT = "ww-journey-changed";

const journeyListeners = new Set<() => void>();

function notifyJourney() {
  journeyListeners.forEach((listener) => listener());

  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(JOURNEY_EVENT));
  }
}

export function subscribeJourney(listener: () => void) {
  journeyListeners.add(listener);

  if (typeof window !== "undefined") {
    window.addEventListener(JOURNEY_EVENT, listener);
    window.addEventListener("storage", listener);
  }

  return () => {
    journeyListeners.delete(listener);

    if (typeof window !== "undefined") {
      window.removeEventListener(JOURNEY_EVENT, listener);
      window.removeEventListener("storage", listener);
    }
  };
}

export function isJourneyStarted(): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  try {
    return window.localStorage.getItem(JOURNEY_KEY) === "true";
  } catch {
    return false;
  }
}

export function markJourneyStarted() {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(JOURNEY_KEY, "true");
  } catch {
    // ignore
  }

  notifyJourney();
}

export function isSakuraDismissed(): boolean {
  if (typeof document === "undefined") {
    return false;
  }

  return document.cookie
    .split("; ")
    .some((entry) => entry === `${SAKURA_COOKIE}=1`);
}

export function markSakuraDismissed() {
  document.cookie = `${SAKURA_COOKIE}=1; path=/; max-age=${YEAR}; SameSite=Lax`;
  notifyJourney();
}

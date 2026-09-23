"use client";

import {
  Suspense,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import { useSearchParams } from "next/navigation";
import WorldMap from "@/components/WorldMap";
import { useT } from "@/lib/i18n/LocaleProvider";
import {
  isJourneyStarted,
  markJourneyStarted,
  subscribeJourney,
} from "@/lib/journey";

export default function HomePage() {
  return (
    <div className="relative h-[calc(100dvh-var(--header-height))] overflow-hidden bg-[var(--map-fill)] overscroll-none">
      <Suspense fallback={null}>
        <HomeExperience />
      </Suspense>
    </div>
  );
}

function HomeExperience() {
  const t = useT();
  const searchParams = useSearchParams();
  const countrySlug = searchParams.get("country") ?? undefined;
  const skipIntro = Boolean(countrySlug);
  const [isIntroVisible, setIsIntroVisible] = useState(false);

  useEffect(() => {
    if (skipIntro) {
      if (!isJourneyStarted()) {
        markJourneyStarted();
      }
      setIsIntroVisible(false);
      return;
    }

    const sync = () => {
      setIsIntroVisible(!isJourneyStarted());
    };

    sync();
    return subscribeJourney(sync);
  }, [skipIntro]);

  const dialogRef = useRef<HTMLElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    if (!isIntroVisible) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        markJourneyStarted();
        return;
      }

      if (event.key !== "Tab") {
        return;
      }

      const dialog = dialogRef.current;

      if (!dialog) {
        return;
      }

      const focusable = dialog.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );

      if (focusable.length === 0) {
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isIntroVisible]);

  const onBackdropClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (event.target === event.currentTarget) {
        markJourneyStarted();
      }
    },
    [],
  );

  return (
    <>
      <WorldMap initialCountrySlug={countrySlug} />

      {isIntroVisible && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/55 px-5 backdrop-blur-sm"
          onClick={onBackdropClick}
        >
          <section
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            aria-describedby={descriptionId}
            className="w-full max-w-md border border-line bg-panel p-7 text-sand shadow-elevated"
            onClick={(event) => event.stopPropagation()}
          >
            <p className="font-heading text-terracotta">Worldwide WIKI</p>

            <h1
              id={titleId}
              className="mt-3 font-heading text-3xl font-normal leading-tight tracking-tight"
            >
              {t("intro.title")}
            </h1>

            <p
              id={descriptionId}
              className="mt-4 text-base leading-7 text-sand/75"
            >
              {t("intro.lead")}
            </p>

            <button
              ref={closeButtonRef}
              type="button"
              onClick={markJourneyStarted}
              className="mt-7 flex min-h-12 w-full items-center justify-center rounded-lg bg-terracotta px-5 py-3 text-sm font-semibold text-white transition hover:bg-terracotta-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta-light focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
            >
              {t("intro.cta")}
              <span className="ml-2 text-lg" aria-hidden="true">
                →
              </span>
            </button>
          </section>
        </div>
      )}
    </>
  );
}

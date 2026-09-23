"use client";

import { useEffect, useId, useRef, useState } from "react";
import BarsIcon from "@/components/BarsIcon";
import { useT } from "@/lib/i18n/LocaleProvider";

type GuideSubsection = {
  id: string;
  title: string;
};

type GuideItem = {
  id: string;
  title: string;
  subsections: GuideSubsection[];
};

type WikiGuideProps = {
  items: GuideItem[];
};

function Caret({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 12 12"
      className={`h-3 w-3 shrink-0 text-current transition-transform duration-200 ease-out ${
        open ? "rotate-90" : ""
      }`}
      aria-hidden="true"
    >
      <path
        d="M4.2 2.4 8.4 6 4.2 9.6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function WikiGuide({ items }: WikiGuideProps) {
  const t = useT();
  const panelId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const wasOpen = useRef(false);
  const [isOpen, setIsOpen] = useState(false);
  const [showTop, setShowTop] = useState(false);
  const [activeId, setActiveId] = useState(items[0]?.id ?? "");
  const [openSections, setOpenSections] = useState<string[]>([]);

  const activeItem =
    items.find(
      (item) =>
        item.id === activeId ||
        item.subsections.some((subsection) => subsection.id === activeId),
    ) ?? items[0];

  useEffect(() => {
    const headingIds = items.flatMap((item) => [
      item.id,
      ...item.subsections.map((subsection) => subsection.id),
    ]);
    const headings = headingIds
      .map((id) => document.getElementById(id))
      .filter((element): element is HTMLElement => element !== null);

    if (headings.length === 0) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (left, right) =>
              left.boundingClientRect.top - right.boundingClientRect.top,
          );

        const nextId = visible[0]?.target.id;

        if (nextId) {
          setActiveId(nextId);
        }
      },
      {
        rootMargin: "-22% 0px -62% 0px",
        threshold: [0, 0.15, 0.4],
      },
    );

    headings.forEach((heading) => observer.observe(heading));

    return () => observer.disconnect();
  }, [items]);

  useEffect(() => {
    const justOpened = isOpen && !wasOpen.current;

    if (justOpened && activeItem?.subsections.length) {
      setOpenSections([activeItem.id]);

      window.setTimeout(() => {
        rootRef.current
          ?.querySelector("[data-wiki-active]")
          ?.scrollIntoView({ block: "center", behavior: "smooth" });
      }, 60);
    }

    wasOpen.current = isOpen;
  }, [activeItem, isOpen]);

  useEffect(() => {
    const onScroll = () => {
      setShowTop(window.scrollY > 480);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("pointerdown", onPointerDown);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("pointerdown", onPointerDown);
    };
  }, [isOpen]);

  if (items.length === 0) {
    return null;
  }

  const scrollToTop = () => {
    setIsOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const toggleSection = (id: string) => {
    setOpenSections((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );
  };

  const goTo = (id: string) => {
    setActiveId(id);
    setIsOpen(false);
  };

  return (
    <>
      <div
        className={`fixed inset-0 z-[60] bg-[var(--overlay)] transition duration-200 ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
      />

      <div
        ref={rootRef}
        className="fixed bottom-[max(1.25rem,env(safe-area-inset-bottom))] right-4 z-[70] sm:right-6"
      >
        <div
          id={panelId}
          role="dialog"
          aria-label={t("wiki.guideTitle")}
          aria-hidden={!isOpen}
          {...(!isOpen ? { inert: true } : {})}
          className={`absolute right-0 flex w-[min(18.5rem,calc(100vw-2rem))] origin-bottom-right flex-col overflow-hidden rounded-2xl border border-line bg-panel-strong/97 shadow-elevated backdrop-blur-xl transition duration-200 ease-out ${
            showTop
              ? "bottom-[calc(100%+3.85rem)]"
              : "bottom-[calc(100%+0.75rem)]"
          } ${
            isOpen
              ? "translate-y-0 scale-100 opacity-100"
              : "pointer-events-none translate-y-2 scale-[0.97] opacity-0"
          } ${
            showTop
              ? "max-h-[min(28rem,calc(100dvh-var(--header-height)-12.5rem))]"
              : "max-h-[min(28rem,calc(100dvh-var(--header-height)-8.75rem))]"
          }`}
        >
          <div className="border-b border-line-soft px-3.5 py-2.5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-sand/45">
              {t("wiki.guideToThePoint")}
            </p>
          </div>

          <div className="wiki-nav-scroll min-h-0 flex-1 overflow-y-auto overscroll-contain py-1.5">
            <ul className="px-1.5">
              {items.map((item) => {
                const hasSubsections = item.subsections.length > 0;
                const isSectionOpen = openSections.includes(item.id);
                const isSectionActive =
                  item.id === activeId ||
                  item.subsections.some(
                    (subsection) => subsection.id === activeId,
                  );

                return (
                  <li key={item.id}>
                    <div className="flex items-stretch">
                      {hasSubsections ? (
                        <button
                          type="button"
                          aria-label={
                            isSectionOpen
                              ? t("wiki.hideSection", { title: item.title })
                              : t("wiki.showSection", { title: item.title })
                          }
                          aria-expanded={isSectionOpen}
                          onClick={() => toggleSection(item.id)}
                          className="flex w-7 shrink-0 items-center justify-center text-sand/40 transition hover:text-sand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta"
                        >
                          <Caret open={isSectionOpen} />
                        </button>
                      ) : (
                        <span className="w-7 shrink-0" aria-hidden="true" />
                      )}

                      <a
                        href={`#${item.id}`}
                        onClick={() => goTo(item.id)}
                        data-wiki-active={
                          item.id === activeId ? true : undefined
                        }
                        className={`my-0.5 min-w-0 flex-1 rounded-md px-2 py-1.5 text-[14px] leading-5 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta ${
                          isSectionActive
                            ? "bg-terracotta/12 text-terracotta"
                            : "text-sand/80 hover:bg-surface-hover hover:text-sand"
                        }`}
                      >
                        {item.title}
                      </a>
                    </div>

                    {hasSubsections ? (
                      <div
                        className={`grid transition-[grid-template-rows] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                          isSectionOpen
                            ? "grid-rows-[1fr]"
                            : "grid-rows-[0fr]"
                        }`}
                      >
                        <div className="min-h-0 overflow-hidden">
                          <ul className="mb-1 ml-7 border-l border-line">
                            {item.subsections.map((subsection) => {
                              const isSubActive = subsection.id === activeId;

                              return (
                                <li key={subsection.id}>
                                  <a
                                    href={`#${subsection.id}`}
                                    onClick={() => goTo(subsection.id)}
                                    data-wiki-active={
                                      isSubActive ? true : undefined
                                    }
                                    className={`block rounded-r-md py-1 pe-2 ps-2.5 text-[12.5px] leading-5 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta ${
                                      isSubActive
                                        ? "bg-terracotta/12 text-terracotta"
                                        : "text-sand/48 hover:bg-surface-hover hover:text-sand"
                                    }`}
                                  >
                                    {subsection.title}
                                  </a>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      </div>
                    ) : null}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        <div className="relative">
          <button
            type="button"
            aria-label={t("wiki.backToTop")}
            onClick={scrollToTop}
            className={`absolute bottom-[calc(100%+0.65rem)] left-1/2 flex h-11 w-11 -translate-x-1/2 items-center justify-center rounded-full border border-line bg-panel/95 text-sand shadow-elevated transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta-light focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-ink)] hover:border-terracotta/50 hover:text-terracotta-light ${
              showTop
                ? "pointer-events-auto translate-y-0 opacity-100"
                : "pointer-events-none translate-y-1 opacity-0"
            }`}
          >
            <span
              className="inline-block h-[11px] w-[11px] translate-y-[3px] -rotate-45 border-t border-r border-current"
              aria-hidden="true"
            />
          </button>

          <button
            type="button"
            aria-label={
              isOpen ? t("wiki.closeSections") : t("wiki.openSections")
            }
            aria-expanded={isOpen}
            aria-controls={panelId}
            onClick={() => setIsOpen((open) => !open)}
            className={`flex h-12 w-12 items-center justify-center rounded-full border shadow-elevated transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta-light focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-ink)] ${
              isOpen
                ? "border-terracotta bg-terracotta text-white"
                : "border-line bg-panel/95 text-sand hover:border-terracotta/50 hover:text-terracotta-light"
            }`}
          >
            <BarsIcon open={isOpen} />
          </button>
        </div>
      </div>
    </>
  );
}

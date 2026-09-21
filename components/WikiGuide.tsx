"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import BarsIcon from "@/components/BarsIcon";
import { WIKI_TOC_GROUPS, getWikiGroup } from "@/lib/wiki";

type GuideSubsection = {
  id: string;
  title: string;
};

type GuideItem = {
  id: string;
  title: string;
  summary: string;
  isPlaceholder?: boolean;
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
  const panelId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const wasOpen = useRef(false);
  const [isOpen, setIsOpen] = useState(false);
  const [showTop, setShowTop] = useState(false);
  const [activeId, setActiveId] = useState(items[0]?.id ?? "");
  const [openGroups, setOpenGroups] = useState<string[]>([]);
  const [openSections, setOpenSections] = useState<string[]>([]);

  const groups = useMemo(() => {
    const byId = new Map(items.map((item) => [item.id, item]));

    return WIKI_TOC_GROUPS.map((group) => ({
      label: group.label,
      items: group.ids
        .map((id) => byId.get(id))
        .filter((item): item is GuideItem => Boolean(item)),
    })).filter((group) => group.items.length > 0);
  }, [items]);

  const activeItem =
    items.find(
      (item) =>
        item.id === activeId ||
        item.subsections.some((subsection) => subsection.id === activeId),
    ) ?? items[0];

  const activeGroupLabel = activeItem
    ? getWikiGroup(activeItem.id).label
    : "";

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

    if (justOpened && activeItem) {
      setOpenGroups([getWikiGroup(activeItem.id).label]);
      setOpenSections(
        activeItem.subsections.length > 0 ? [activeItem.id] : [],
      );

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

  const scrollToTop = () => {
    setIsOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const toggleGroup = (label: string) => {
    setOpenGroups((current) =>
      current.includes(label)
        ? current.filter((item) => item !== label)
        : [...current, label],
    );
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
          aria-label="Разделы статьи"
          aria-hidden={!isOpen}
          {...(!isOpen ? { inert: true } : {})}
          className={`absolute right-0 flex w-[min(21rem,calc(100vw-2rem))] origin-bottom-right flex-col overflow-hidden rounded-2xl border border-line bg-panel-strong/97 shadow-elevated backdrop-blur-xl transition duration-200 ease-out ${
            showTop ? "bottom-[calc(100%+3.85rem)]" : "bottom-[calc(100%+0.75rem)]"
          } ${
            isOpen
              ? "translate-y-0 scale-100 opacity-100"
              : "pointer-events-none translate-y-2 scale-[0.97] opacity-0"
          } ${
            showTop
              ? "max-h-[min(30rem,calc(100dvh-var(--header-height)-12.5rem))]"
              : "max-h-[min(30rem,calc(100dvh-var(--header-height)-8.75rem))]"
          }`}
        >
          <div className="wiki-nav-scroll min-h-0 flex-1 overflow-y-auto overscroll-contain py-2">
            {groups.map((group) => {
              const isGroupOpen = openGroups.includes(group.label);
              const isCurrentGroup = group.label === activeGroupLabel;

              return (
                <section key={group.label} className="px-2">
                  <button
                    type="button"
                    onClick={(event) => {
                      toggleGroup(group.label);
                      const button = event.currentTarget;
                      window.requestAnimationFrame(() => {
                        button.scrollIntoView({
                          block: "nearest",
                          behavior: "smooth",
                        });
                      });
                    }}
                    aria-expanded={isGroupOpen}
                    className={`flex min-h-10 w-full items-center gap-2 rounded-lg px-2 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta ${
                      isCurrentGroup
                        ? "text-terracotta"
                        : "text-sand/70 hover:bg-surface-hover hover:text-sand"
                    }`}
                  >
                    <Caret open={isGroupOpen} />
                    <span className="min-w-0 flex-1 text-[13px] font-medium tracking-wide">
                      {group.label}
                    </span>
                  </button>

                  <div
                    className={`grid transition-[grid-template-rows] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                      isGroupOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                    }`}
                  >
                    <div className="min-h-0 overflow-hidden">
                      <ul className="mb-2">
                        {group.items.map((item) => {
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
                                        ? `Скрыть: ${item.title}`
                                        : `Показать: ${item.title}`
                                    }
                                    aria-expanded={isSectionOpen}
                                    onClick={() => toggleSection(item.id)}
                                    className="flex w-8 shrink-0 items-center justify-center text-sand/40 transition hover:text-sand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta"
                                  >
                                    <Caret open={isSectionOpen} />
                                  </button>
                                ) : (
                                  <span className="w-8 shrink-0" aria-hidden="true" />
                                )}

                                <a
                                  href={`#${item.id}`}
                                  onClick={() => goTo(item.id)}
                                  data-wiki-active={
                                    item.id === activeId ? true : undefined
                                  }
                                  className={`my-0.5 min-w-0 flex-1 rounded-md px-2 py-1.5 text-[14px] leading-5 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta ${
                                    item.isPlaceholder ? "opacity-50" : ""
                                  } ${
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
                                    <ul className="mb-1 ml-8 border-l border-line">
                                      {item.subsections.map((subsection) => {
                                        const isSubActive =
                                          subsection.id === activeId;

                                        return (
                                          <li key={subsection.id}>
                                            <a
                                              href={`#${subsection.id}`}
                                              onClick={() => goTo(subsection.id)}
                                              data-wiki-active={
                                                isSubActive ? true : undefined
                                              }
                                              className={`block rounded-r-md py-1.5 pe-2 ps-3 text-[13px] leading-5 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta ${
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
                </section>
              );
            })}
          </div>
        </div>

        <div className="relative">
          <button
            type="button"
            aria-label="Наверх"
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
            aria-label={isOpen ? "Закрыть разделы" : "Открыть разделы"}
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

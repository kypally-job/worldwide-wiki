"use client";

import { useEffect, useRef, useState } from "react";

const ALL_REGIONS = "Все регионы";

type RegionFilterProps = {
  regions: string[];
  value: string;
  onChange: (value: string) => void;
};

export default function RegionFilter({
  regions,
  value,
  onChange,
}: RegionFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const options = [ALL_REGIONS, ...regions];

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

  return (
    <div className="relative" ref={rootRef}>
      <span className="mb-2 block text-[13px] font-medium tracking-wide text-sand/50">
        Регион
      </span>

      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label="Регион"
        onClick={() => setIsOpen((open) => !open)}
        className="flex w-full items-center justify-between border-b border-line-strong bg-transparent py-2.5 text-left text-sand outline-none transition hover:border-terracotta/50 focus-visible:border-terracotta"
      >
        <span>{value}</span>
      </button>

      {isOpen && (
        <div
          role="listbox"
          aria-label="Регион"
          className="absolute left-0 right-0 top-full z-30 mt-2 overflow-hidden rounded-xl border border-line bg-panel p-1 shadow-elevated"
        >
          {options.map((item) => {
            const isSelected = item === value;

            return (
              <button
                key={item}
                type="button"
                role="option"
                aria-selected={isSelected}
                onClick={() => {
                  onChange(item);
                  setIsOpen(false);
                }}
                className={`flex w-full rounded-lg px-3 py-2.5 text-left text-sm transition hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta ${
                  isSelected ? "bg-surface-hover text-terracotta" : "text-sand/80"
                }`}
              >
                {item}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

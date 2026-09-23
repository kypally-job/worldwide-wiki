"use client";

import { useEffect, useRef, useState } from "react";
import { useT } from "@/lib/i18n/LocaleProvider";

type RegionOption = {
  value: string;
  label: string;
};

type RegionFilterProps = {
  options: RegionOption[];
  value: string;
  onChange: (value: string) => void;
};

export default function RegionFilter({
  options,
  value,
  onChange,
}: RegionFilterProps) {
  const t = useT();
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const selected =
    options.find((item) => item.value === value) ?? options[0];
  const regionLabel = t("catalog.region");

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
        {regionLabel}
      </span>

      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={regionLabel}
        onClick={() => setIsOpen((open) => !open)}
        className="flex w-full items-center justify-between border-b border-line-strong bg-transparent py-2.5 text-left text-sand outline-none transition hover:border-terracotta/50 focus-visible:border-terracotta"
      >
        <span>{selected?.label}</span>
      </button>

      {isOpen && (
        <div
          role="listbox"
          aria-label={regionLabel}
          className="absolute left-0 right-0 top-full z-30 mt-2 max-h-72 overflow-y-auto rounded-xl border border-line bg-panel p-1 shadow-elevated"
        >
          {options.map((item) => {
            const isSelected = item.value === value;

            return (
              <button
                key={item.value}
                type="button"
                role="option"
                aria-selected={isSelected}
                onClick={() => {
                  onChange(item.value);
                  setIsOpen(false);
                }}
                className={`flex w-full rounded-lg px-3 py-2.5 text-left text-sm transition hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta ${
                  isSelected
                    ? "bg-surface-hover text-terracotta"
                    : "text-sand/80"
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

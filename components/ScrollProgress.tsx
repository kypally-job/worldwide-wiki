"use client";

import { useEffect, useState } from "react";
import SakuraMark from "@/components/SakuraMark";

/**
 * Индикатор прокрутки: на десктопе — «стебель» с лепестком справа,
 * на мобиле — тонкая линия под шапкой.
 */
export default function ScrollProgress() {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const update = () => {
      const root = document.documentElement;
      const max = root.scrollHeight - root.clientHeight;

      if (max <= 24) {
        setVisible(false);
        setProgress(0);
        return;
      }

      setVisible(true);
      setProgress(Math.min(1, Math.max(0, window.scrollY / max)));
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);

    const observer = new ResizeObserver(update);
    observer.observe(document.documentElement);
    if (document.body) {
      observer.observe(document.body);
    }

    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      observer.disconnect();
    };
  }, []);

  if (!visible) {
    return null;
  }

  const pct = `${(progress * 100).toFixed(2)}%`;
  const valueNow = Math.round(progress * 100);

  return (
    <>
      {/* Mobile: линия под шапкой */}
      <div
        className="pointer-events-none fixed inset-x-0 top-[var(--header-height)] z-[60] h-[2px] overflow-hidden bg-[var(--line-soft)] sm:hidden"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={valueNow}
        aria-label="Scroll progress"
      >
        <div
          className="h-full origin-left bg-gradient-to-r from-terracotta via-terracotta-light to-terracotta/50 transition-[width] duration-150 ease-out"
          style={{ width: pct }}
        />
      </div>

      {/* Desktop: стебель + лепесток */}
      <div
        className="scroll-progress pointer-events-none fixed right-3 top-[calc(var(--header-height)+1.25rem)] z-[60] hidden h-[min(42vh,22rem)] w-5 sm:block md:right-4"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={valueNow}
        aria-label="Scroll progress"
      >
        <div className="relative mx-auto h-full w-px rounded-full bg-[var(--line)]">
          <div
            className="absolute inset-x-0 top-0 w-px rounded-full bg-gradient-to-b from-terracotta via-terracotta-light to-terracotta/35 transition-[height] duration-150 ease-out"
            style={{ height: pct }}
          />
          <div
            className="scroll-progress__petal absolute left-1/2 text-terracotta"
            style={{ top: pct }}
          >
            <SakuraMark className="h-3.5 w-3.5 drop-shadow-[0_0_10px_rgba(213,96,137,0.45)]" />
          </div>
        </div>
      </div>
    </>
  );
}

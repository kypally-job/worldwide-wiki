"use client";

import Link from "next/link";
import { useT } from "@/lib/i18n/LocaleProvider";

type PlaceholderAction = {
  href: string;
  label: string;
  variant?: "primary" | "secondary";
};

type SectionPlaceholderProps = {
  title: string;
  description: string;
  actions?: PlaceholderAction[];
};

export default function SectionPlaceholder({
  title,
  description,
  actions,
}: SectionPlaceholderProps) {
  const t = useT();
  const resolvedActions =
    actions ?? [{ href: "/", label: t("placeholders.toMap") }];

  return (
    <div className="flex min-h-[calc(100dvh-var(--header-height))] items-center justify-center px-5 py-16">
      <section className="w-full max-w-md border border-line bg-panel p-8 text-center md:p-9">
        <p className="font-heading text-terracotta">Worldwide WIKI</p>

        <h1 className="mt-3 font-heading text-3xl font-normal leading-tight tracking-tight text-sand">
          {title}
        </h1>

        <p className="mt-4 text-base leading-7 text-sand/70">{description}</p>

        <div className="mt-7 grid gap-3">
          {resolvedActions.map((action) => (
            <Link
              key={`${action.href}-${action.label}`}
              href={action.href}
              className={
                action.variant === "secondary"
                  ? "flex min-h-12 items-center justify-center rounded-lg border border-line-strong px-5 py-3 text-sm font-semibold text-sand transition hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta"
                  : "flex min-h-12 w-full items-center justify-center rounded-lg bg-terracotta px-5 py-3 text-sm font-semibold text-white transition hover:bg-terracotta-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta-light focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-ink)]"
              }
            >
              {action.label}
              {action.variant !== "secondary" && (
                <span className="ml-2 text-lg" aria-hidden="true">
                  →
                </span>
              )}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

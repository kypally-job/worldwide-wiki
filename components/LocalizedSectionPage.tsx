"use client";

import SectionPlaceholder from "@/components/SectionPlaceholder";
import { useT } from "@/lib/i18n/LocaleProvider";

type LocalizedSectionPageProps = {
  titleKey: string;
  descriptionKey: string;
  titleVars?: Record<string, string | number>;
  descriptionVars?: Record<string, string | number>;
  actions?: {
    href: string;
    labelKey: string;
    labelVars?: Record<string, string | number>;
    variant?: "primary" | "secondary";
  }[];
};

export default function LocalizedSectionPage({
  titleKey,
  descriptionKey,
  titleVars,
  descriptionVars,
  actions,
}: LocalizedSectionPageProps) {
  const t = useT();

  return (
    <SectionPlaceholder
      title={t(titleKey, titleVars)}
      description={t(descriptionKey, descriptionVars)}
      actions={actions?.map((action) => ({
        href: action.href,
        label: t(action.labelKey, action.labelVars),
        variant: action.variant,
      }))}
    />
  );
}

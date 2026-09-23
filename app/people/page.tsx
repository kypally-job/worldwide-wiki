"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import LocalizedSectionPage from "@/components/LocalizedSectionPage";
import { getCountryBySlug } from "@/lib/countries";
import { getCountryName } from "@/lib/i18n/country-locale";
import { useLocale } from "@/lib/i18n/LocaleProvider";

function PeoplePageContent() {
  const searchParams = useSearchParams();
  const { locale } = useLocale();
  const countrySlug = searchParams.get("country") ?? "";
  const country = getCountryBySlug(countrySlug);

  if (country) {
    const name = getCountryName(country, locale);

    return (
      <LocalizedSectionPage
        titleKey="placeholders.peopleCountryTitle"
        titleVars={{ name }}
        descriptionKey="placeholders.peopleCountryDescription"
        descriptionVars={{ name }}
        actions={[
          {
            href: `/countries/${country.slug}`,
            labelKey: "placeholders.toCountry",
            labelVars: { name },
          },
          {
            href: "/",
            labelKey: "placeholders.toMap",
            variant: "secondary",
          },
        ]}
      />
    );
  }

  return (
    <LocalizedSectionPage
      titleKey="placeholders.peopleTitle"
      descriptionKey="placeholders.peopleDescription"
    />
  );
}

export default function PeoplePage() {
  return (
    <Suspense
      fallback={
        <LocalizedSectionPage
          titleKey="placeholders.peopleTitle"
          descriptionKey="placeholders.peopleDescription"
        />
      }
    >
      <PeoplePageContent />
    </Suspense>
  );
}

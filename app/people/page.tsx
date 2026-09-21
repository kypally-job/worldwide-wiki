import type { Metadata } from "next";
import SectionPlaceholder from "@/components/SectionPlaceholder";
import { getCountryBySlug } from "@/lib/countries";

type PeoplePageProps = {
  searchParams: Promise<{
    country?: string | string[];
  }>;
};

function getCountrySlug(
  country: string | string[] | undefined,
): string | undefined {
  return Array.isArray(country) ? country[0] : country;
}

export async function generateMetadata({
  searchParams,
}: PeoplePageProps): Promise<Metadata> {
  const params = await searchParams;
  const country = getCountryBySlug(getCountrySlug(params.country) ?? "");

  return {
    title: country
      ? `Мастера: ${country.name} — Worldwide WIKI`
      : "Люди — Worldwide WIKI",
    description: country
      ? `Маркетплейс мастеров и исполнителей в стране ${country.name}.`
      : "Маркетплейс мастеров и исполнителей: фильтр по стране, языку общения и отзывам.",
  };
}

export default async function PeoplePage({ searchParams }: PeoplePageProps) {
  const params = await searchParams;
  const country = getCountryBySlug(getCountrySlug(params.country) ?? "");

  if (country) {
    return (
      <SectionPlaceholder
        title={`Мастера: ${country.name}`}
        description={`Маркетплейс исполнителей для страны ${country.name} появится на следующем этапе. Там будут фильтры по стране, языку общения и отзывам.`}
        actions={[
          {
            href: `/countries/${country.slug}`,
            label: `К странице ${country.name}`,
          },
          {
            href: "/",
            label: "На карту",
            variant: "secondary",
          },
        ]}
      />
    );
  }

  return (
    <SectionPlaceholder
      title="Люди"
      description="Скоро здесь появится маркетплейс мастеров и исполнителей: фильтр по стране, языку общения и отзывам."
    />
  );
}

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CountryArticle from "@/components/CountryArticle";
import { countries, getCountryBySlug } from "@/lib/countries";

type CountryPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return countries.map((country) => ({ slug: country.slug }));
}

export async function generateMetadata({
  params,
}: CountryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const country = getCountryBySlug(slug);

  if (!country) {
    return {
      title: "Country not found — Worldwide WIKI",
    };
  }

  return {
    title: `${country.name} — Worldwide WIKI`,
    description: country.description,
  };
}

export default async function CountryPage({ params }: CountryPageProps) {
  const { slug } = await params;
  const country = getCountryBySlug(slug);

  if (!country) {
    notFound();
  }

  return <CountryArticle country={country} />;
}

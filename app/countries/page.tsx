import type { Metadata } from "next";
import CountriesCatalog from "@/components/CountriesCatalog";

export const metadata: Metadata = {
  title: "Countries of the world — Worldwide WIKI",
  description:
    "A country catalog for travel, relocation, study, and life abroad: visas, cost of living, language, and safety.",
};

export default function CountriesPage() {
  return <CountriesCatalog />;
}

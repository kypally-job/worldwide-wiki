import type { Metadata } from "next";
import CountriesCatalog from "@/components/CountriesCatalog";

export const metadata: Metadata = {
  title: "Страны мира — Worldwide WIKI",
  description:
    "Каталог стран для путешествий, переезда, учёбы и жизни: визы, стоимость жизни, язык и безопасность.",
};

export default function CountriesPage() {
  return <CountriesCatalog />;
}

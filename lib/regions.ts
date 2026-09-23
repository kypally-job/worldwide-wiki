/** Единая классификация регионов каталога (без дублей вроде «Восточная Европа»). */
export const REGION_ALIASES: Record<string, string> = {
  "Восточная Европа": "Европа",
  "Европа / Кавказ": "Европа",
  "Юго-Восточная Азия": "Азия",
  "Центральная Азия": "Азия",
};

export function normalizeRegion(region: string): string {
  return REGION_ALIASES[region] ?? region;
}

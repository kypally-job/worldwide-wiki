/** Курортные теги и шкала температуры для карты */

export type MapFilterId = "beach" | "ski";

export const MAP_FILTERS: { id: MapFilterId; label: string }[] = [
  { id: "beach", label: "Пляжный отдых" },
  { id: "ski", label: "Горнолыжные курорты" },
];

/** ISO-коды стран с выраженным пляжным туризмом */
export const BEACH_COUNTRY_CODES = new Set([
  "AL",
  "AO",
  "AR",
  "AU",
  "BS",
  "BB",
  "BZ",
  "BR",
  "CV",
  "KH",
  "CL",
  "CN",
  "CO",
  "CR",
  "HR",
  "CU",
  "CY",
  "DO",
  "EC",
  "EG",
  "SV",
  "FJ",
  "FR",
  "GM",
  "GE",
  "GH",
  "GR",
  "GT",
  "HN",
  "IN",
  "ID",
  "IL",
  "IT",
  "JM",
  "JP",
  "KE",
  "LB",
  "MG",
  "MY",
  "MV",
  "MT",
  "MU",
  "MX",
  "ME",
  "MA",
  "MZ",
  "NA",
  "NZ",
  "NI",
  "OM",
  "PA",
  "PE",
  "PH",
  "PT",
  "QA",
  "SN",
  "SC",
  "SG",
  "SI",
  "ZA",
  "KR",
  "ES",
  "LK",
  "TH",
  "TN",
  "TR",
  "AE",
  "TZ",
  "US",
  "UY",
  "VE",
  "VN",
]);

/** ISO-коды стран с горнолыжными курортами */
export const SKI_COUNTRY_CODES = new Set([
  "AD",
  "AR",
  "AM",
  "AU",
  "AT",
  "BA",
  "BG",
  "CA",
  "CL",
  "CN",
  "HR",
  "CZ",
  "FI",
  "FR",
  "GE",
  "DE",
  "GR",
  "IS",
  "IN",
  "IR",
  "IT",
  "JP",
  "KZ",
  "KG",
  "LB",
  "MK",
  "ME",
  "NZ",
  "NO",
  "PK",
  "PL",
  "RO",
  "RU",
  "RS",
  "SK",
  "SI",
  "KR",
  "ES",
  "SE",
  "CH",
  "TR",
  "UA",
  "GB",
  "US",
  "UZ",
]);

export function countryHasMapFilter(
  countryCode: string | undefined,
  filter: MapFilterId,
): boolean {
  if (!countryCode) return false;
  const code = countryCode.toUpperCase();
  if (filter === "beach") return BEACH_COUNTRY_CODES.has(code);
  return SKI_COUNTRY_CODES.has(code);
}

export function countryMatchesFilters(
  countryCode: string | undefined,
  active: MapFilterId[],
): boolean {
  if (active.length === 0) return true;
  return active.some((f) => countryHasMapFilter(countryCode, f));
}

/** Ступени шкалы температуры (°C) в палитре night-sakura */
export const TEMP_LEGEND: { min: number; max: number; color: string; label: string }[] = [
  { min: -Infinity, max: -20, color: "#2a1f3d", label: "ниже −20°" },
  { min: -20, max: -10, color: "#3d2f55", label: "−20…−10°" },
  { min: -10, max: 0, color: "#5a4570", label: "−10…0°" },
  { min: 0, max: 10, color: "#7a5a78", label: "0…10°" },
  { min: 10, max: 20, color: "#9a6a80", label: "10…20°" },
  { min: 20, max: 25, color: "#b85f80", label: "20…25°" },
  { min: 25, max: 30, color: "#d56089", label: "25…30°" },
  { min: 30, max: Infinity, color: "#e28aa8", label: "выше 30°" },
];

export function temperatureToColor(tempC: number): string {
  for (const step of TEMP_LEGEND) {
    if (tempC >= step.min && tempC < step.max) return step.color;
  }
  return TEMP_LEGEND[TEMP_LEGEND.length - 1].color;
}

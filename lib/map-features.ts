/** Курортные теги и шкала температуры для карты */

export type MapFilterId = "beach" | "ski";

export const MAP_FILTERS: { id: MapFilterId }[] = [
  { id: "beach" },
  { id: "ski" },
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
export const TEMP_LEGEND: {
  min: number;
  max: number;
  color: string;
  labelKey:
    | "tempBelow20"
    | "tempNeg20Neg10"
    | "tempNeg10Zero"
    | "temp0_10"
    | "temp10_20"
    | "temp20_25"
    | "temp25_30"
    | "tempAbove30";
}[] = [
  { min: -Infinity, max: -20, color: "#3b2a6b", labelKey: "tempBelow20" },
  { min: -20, max: -10, color: "#4f3f8f", labelKey: "tempNeg20Neg10" },
  { min: -10, max: 0, color: "#5c6bb5", labelKey: "tempNeg10Zero" },
  { min: 0, max: 10, color: "#6a8fbf", labelKey: "temp0_10" },
  { min: 10, max: 20, color: "#c4a06a", labelKey: "temp10_20" },
  { min: 20, max: 25, color: "#d4786a", labelKey: "temp20_25" },
  { min: 25, max: 30, color: "#e05a8a", labelKey: "temp25_30" },
  { min: 30, max: Infinity, color: "#f078b0", labelKey: "tempAbove30" },
];

const TEMP_STOPS: Array<{ t: number; rgb: [number, number, number] }> = [
  { t: -30, rgb: [45, 32, 90] },
  { t: -20, rgb: [59, 42, 107] },
  { t: -10, rgb: [79, 63, 143] },
  { t: 0, rgb: [92, 107, 181] },
  { t: 10, rgb: [106, 143, 191] },
  { t: 18, rgb: [196, 160, 106] },
  { t: 25, rgb: [212, 120, 106] },
  { t: 30, rgb: [224, 90, 138] },
  { t: 38, rgb: [240, 120, 176] },
];

export function temperatureToColor(tempC: number): string {
  return temperatureToColorSmooth(tempC);
}

/** Плавная интерполяция по шкале — для heatmap без «ступенек». */
export function temperatureToColorSmooth(tempC: number): string {
  if (tempC <= TEMP_STOPS[0].t) {
    return rgbToHex(TEMP_STOPS[0].rgb);
  }

  const last = TEMP_STOPS[TEMP_STOPS.length - 1];
  if (tempC >= last.t) {
    return rgbToHex(last.rgb);
  }

  for (let i = 0; i < TEMP_STOPS.length - 1; i += 1) {
    const a = TEMP_STOPS[i];
    const b = TEMP_STOPS[i + 1];
    if (tempC >= a.t && tempC <= b.t) {
      const u = (tempC - a.t) / (b.t - a.t);
      return rgbToHex([
        Math.round(a.rgb[0] + (b.rgb[0] - a.rgb[0]) * u),
        Math.round(a.rgb[1] + (b.rgb[1] - a.rgb[1]) * u),
        Math.round(a.rgb[2] + (b.rgb[2] - a.rgb[2]) * u),
      ]);
    }
  }

  return rgbToHex(last.rgb);
}

function rgbToHex([r, g, b]: [number, number, number]): string {
  return `#${[r, g, b].map((n) => n.toString(16).padStart(2, "0")).join("")}`;
}

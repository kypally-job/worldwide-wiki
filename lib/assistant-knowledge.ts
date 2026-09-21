/** Curated travel hints for countries with partial wiki coverage. */

export type SeasonBand = "swim" | "mild" | "cool" | "off";

export type CountryTravelProfile = {
  slug: string;
  hasSea: boolean;
  /** Months 1–12 where sea swimming is typically comfortable. */
  swimMonths: number[];
  /** Months that work for seaside rest without requiring swimming. */
  seasideMonths: number[];
  warmth: "warm" | "mild" | "cool-variable";
  notes: string;
  dataDepth: "full" | "partial" | "thin";
};

export const TRAVEL_PROFILES: CountryTravelProfile[] = [
  {
    slug: "georgia",
    hasSea: true,
    swimMonths: [6, 7, 8, 9],
    seasideMonths: [5, 6, 7, 8, 9, 10],
    warmth: "mild",
    notes:
      "Чёрное море у Батуми: купальный пик лето–начало осени; осень часто дождливая. В базе подробно разобраны климат городов и безвиз.",
    dataDepth: "full",
  },
  {
    slug: "thailand",
    hasSea: true,
    swimMonths: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    seasideMonths: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    warmth: "warm",
    notes:
      "Тёплое море почти круглый год; в пик муссона лучше выбирать побережье (Сиамский залив обычно спокойнее Андамана). В базе пока краткие заметки — детали климата по месяцам ещё наполняются.",
    dataDepth: "partial",
  },
  {
    slug: "portugal",
    hasSea: true,
    swimMonths: [6, 7, 8, 9],
    seasideMonths: [4, 5, 6, 7, 8, 9, 10],
    warmth: "mild",
    notes:
      "Атлантика прохладнее Средиземного моря: купание комфортнее летом и в начале осени. Подробный климат по городам в базе пока частичный.",
    dataDepth: "partial",
  },
  {
    slug: "argentina",
    hasSea: true,
    swimMonths: [12, 1, 2, 3],
    seasideMonths: [11, 12, 1, 2, 3, 4],
    warmth: "cool-variable",
    notes:
      "Южное полушарие: пляжный сезон противоположен европейскому. В базе пока общие заметки.",
    dataDepth: "thin",
  },
  {
    slug: "south-korea",
    hasSea: true,
    swimMonths: [7, 8],
    seasideMonths: [6, 7, 8, 9],
    warmth: "cool-variable",
    notes:
      "Купальный сезон короткий, лето влажное. Страница в базе пока без развёрнутого климата по месяцам.",
    dataDepth: "thin",
  },
];

export function getTravelProfile(slug: string) {
  return TRAVEL_PROFILES.find((profile) => profile.slug === slug);
}

export function seasonForMonth(
  profile: CountryTravelProfile,
  month: number,
  wantSwim: boolean,
): SeasonBand {
  if (wantSwim) {
    return profile.swimMonths.includes(month) ? "swim" : "off";
  }

  if (profile.swimMonths.includes(month)) {
    return "swim";
  }

  if (profile.seasideMonths.includes(month)) {
    return "mild";
  }

  return "cool";
}

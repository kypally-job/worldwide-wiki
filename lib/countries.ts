import type { OverviewFacts, WikiContent } from "@/lib/wiki";
import { georgiaWiki } from "@/lib/wiki/georgia";
import { landmarkImageForCode } from "@/lib/landmark-images";
import { normalizeRegion } from "@/lib/regions";
import worldCatalog from "@/lib/world-catalog.json";
import worldCountries from "world-countries";

export type Country = {
  slug: string;
  /** Russian display name */
  name: string;
  /** English display name (for EN locale + sorting) */
  nameEn: string;
  mapName: string;
  /** English Natural Earth / world-atlas geography names for this country. */
  mapKeys: string[];
  region: string;
  description: string;
  highlights: string[];
  imageUrl: string;
  countryCode: string;
  mapCoordinates: [number, number];
  facts?: OverviewFacts;
  wiki: WikiContent;
  updatedAt?: string;
  isPlaceholder?: boolean;
};

type CatalogCountry = {
  slug: string;
  name: string;
  mapName: string;
  mapKeys: string[];
  region: string;
  description: string;
  highlights: string[];
  imageUrl: string;
  countryCode: string;
  mapCoordinates: number[];
  wiki: WikiContent;
  isPlaceholder?: boolean;
};

const PLACEHOLDER_IMAGE =
  "https://images.unsplash.com/photo-1526779259212-939e64788e3c?auto=format&fit=crop&w=1000&q=80";

const ENGLISH_NAME_BY_CODE = new Map(
  worldCountries.map((entry) => [entry.cca2.toUpperCase(), entry.name.common]),
);

function resolveEnglishName(
  countryCode: string,
  mapKeys: string[],
  fallback: string,
): string {
  return (
    ENGLISH_NAME_BY_CODE.get(countryCode.toUpperCase()) ??
    mapKeys[0] ??
    fallback
  );
}

const richCountries: Array<Omit<Country, "nameEn">> = [
  {
    slug: "georgia",
    name: "Грузия",
    mapName: "Грузия",
    mapKeys: ["Georgia"],
    imageUrl:
      "https://images.unsplash.com/photo-1565008576549-57569a49371d?auto=format&fit=crop&w=1200&q=80",
    region: "Европа",
    description:
      "Сюда едут не за идеальным сервисом, а за людьми, едой и ощущением, что жизнь тут чуть теплее.",
    highlights: [
      "Горы и море",
      "Грузинская кухня",
      "Винодельческие регионы",
    ],
    countryCode: "GE",
    mapCoordinates: [41.715138, 44.827096],
    updatedAt: "2026-09-21",
    facts: {
      area: "Около 69 700 км² — небольшая страна, но с очень разным рельефом.",
      population: "Около 3,7 млн человек, большая часть живёт в Тбилиси и крупных городах.",
      languages:
        "Государственный — грузинский. В городах часто понимают русский и английский.",
      religion: "Большинство — Грузинская православная церковь; есть мусульманские и другие общины.",
      government:
        "Парламентская республика: президент — глава государства, правительство возглавляет премьер-министр. Фамилии лучше сверять перед поездкой.",
    },
    wiki: georgiaWiki,
  },
  {
    slug: "portugal",
    name: "Португалия",
    mapName: "Португалия",
    mapKeys: ["Portugal"],
    imageUrl:
      "https://images.unsplash.com/photo-1555881400-74d7acaacd8b?auto=format&fit=crop&w=1200&q=80",
    region: "Европа",
    description:
      "Сюда едут не за суетой столиц, а за океаном, светом и ощущением, что день может тянуться медленнее.",
    highlights: [
      "Атлантический океан",
      "Португальская кухня",
      "Исторические города",
    ],
    countryCode: "PT",
    mapCoordinates: [39.399872, -8.224454],
    wiki: {
      overview:
        "Официальный язык — португальский. В туристической среде распространён английский.",
      visa: "Условия пребывания зависят от гражданства, цели поездки и длительности проживания.",
      housing:
        "### Аренда {#rent}\n\nЖильё в Лиссабоне и популярных прибрежных городах обычно дороже, чем в небольших населённых пунктах.\n\n### Покупка жилья {#buy}\n\nРаздел про покупку жилья в Португалии появится при наполнении.\n\n### Ипотека {#mortgage}\n\nРаздел про ипотеку появится при наполнении.\n\n### ЖКХ {#utilities}\n\nРаздел про коммунальные платежи появится при наполнении.",
      before:
        "Популярное направление для путешествий и переезда, однако в крупных городах нужно следить за вещами в туристических местах.",
    },
  },
  {
    slug: "south-korea",
    name: "Южная Корея",
    mapName: "Южная Корея",
    mapKeys: ["South Korea"],
    imageUrl:
      "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1200&q=80",
    region: "Азия",
    description:
      "Сюда едут не за тишиной, а за плотным городским ритмом, ночными рынками и ощущением, что всё работает точно.",
    highlights: ["K-pop и дорамы", "Корейская кухня", "Современная культура"],
    countryCode: "KR",
    mapCoordinates: [37.566536, 126.977969],
    wiki: {
      overview:
        "Официальный язык — корейский. В международной среде чаще используется английский.",
      visa: "Требования зависят от гражданства, цели поездки и выбранного срока пребывания.",
      housing:
        "### Аренда {#rent}\n\nСеул и другие крупные города могут быть дорогими, особенно в части аренды жилья.\n\n### Покупка жилья {#buy}\n\nРаздел про покупку жилья в Южной Корее появится при наполнении.\n\n### Ипотека {#mortgage}\n\nРаздел про ипотеку появится при наполнении.\n\n### ЖКХ {#utilities}\n\nРаздел про коммунальные платежи появится при наполнении.",
      before:
        "Страна считается удобной для самостоятельных поездок, но важно учитывать местные правила и особенности транспорта.",
    },
  },
  {
    slug: "thailand",
    name: "Таиланд",
    mapName: "Таиланд",
    mapKeys: ["Thailand"],
    imageUrl:
      "https://images.unsplash.com/photo-1528181304800-259b08848526?auto=format&fit=crop&w=1200&q=80",
    region: "Азия",
    description:
      "Сюда едут не за одним сценарием, а за морем, едой с тележки и ощущением, что день можно начать и босиком, и в гуле города.",
    highlights: ["Пляжи и острова", "Тайская кухня", "Храмы и национальные парки"],
    countryCode: "TH",
    mapCoordinates: [15.870032, 100.992541],
    wiki: {
      overview:
        "Официальный язык — тайский. В туристических районах часто можно объясниться на английском.",
      visa: "Условия въезда и срок пребывания зависят от гражданства и регулярно меняются.",
      housing:
        "### Аренда {#rent}\n\nСтоимость жизни сильно различается между Бангкоком, туристическими островами и небольшими городами.\n\n### Покупка жилья {#buy}\n\nРаздел про покупку жилья в Таиланде появится при наполнении.\n\n### Ипотека {#mortgage}\n\nРаздел про ипотеку появится при наполнении.\n\n### ЖКХ {#utilities}\n\nРаздел про коммунальные платежи появится при наполнении.",
      before:
        "В целом страна популярна среди путешественников, но необходимо соблюдать правила дорожного движения и осторожность в туристических местах.",
    },
  },
  {
    slug: "argentina",
    name: "Аргентина",
    mapName: "Аргентина",
    mapKeys: ["Argentina"],
    imageUrl:
      "https://images.unsplash.com/photo-1589909202802-8f4aadce1849?auto=format&fit=crop&w=1200&q=80",
    region: "Южная Америка",
    description:
      "Сюда едут не за коротким отпуском, а за широкой страной, громкими ужинами и ощущением, что жизнь тут в полный голос.",
    highlights: ["Патагония", "Танго и местная кухня", "Винные регионы"],
    countryCode: "AR",
    mapCoordinates: [-38.416097, -63.616672],
    wiki: {
      overview:
        "Официальный язык — испанский. Английский чаще встречается в туристической и международной среде.",
      visa: "Условия пребывания зависят от гражданства и цели поездки.",
      housing:
        "### Аренда {#rent}\n\nРасходы могут заметно различаться по регионам и меняться из-за экономической ситуации.\n\n### Покупка жилья {#buy}\n\nРаздел про покупку жилья в Аргентине появится при наполнении.\n\n### Ипотека {#mortgage}\n\nРаздел про ипотеку появится при наполнении.\n\n### ЖКХ {#utilities}\n\nРаздел про коммунальные платежи появится при наполнении.",
      before:
        "При поездке важно заранее изучить особенности конкретного района и соблюдать обычные меры безопасности.",
    },
  },
];

function toCountry(entry: CatalogCountry): Country {
  const code = entry.countryCode;
  const landmark = landmarkImageForCode(code);

  return {
    slug: entry.slug,
    name: entry.name,
    nameEn: resolveEnglishName(code, entry.mapKeys, entry.name),
    mapName: entry.mapName,
    mapKeys: entry.mapKeys,
    region: normalizeRegion(entry.region),
    description: entry.description,
    highlights: entry.highlights,
    imageUrl: landmark || entry.imageUrl || PLACEHOLDER_IMAGE,
    countryCode: entry.countryCode,
    mapCoordinates: [entry.mapCoordinates[0], entry.mapCoordinates[1]],
    wiki: entry.wiki ?? {},
    isPlaceholder: entry.isPlaceholder ?? true,
  };
}

function buildCountries(): Country[] {
  const bySlug = new Map<string, Country>();
  const byCode = new Map<string, Country>();

  for (const rich of richCountries) {
    const normalized: Country = {
      ...rich,
      nameEn: resolveEnglishName(rich.countryCode, rich.mapKeys, rich.name),
      region: normalizeRegion(rich.region),
    };
    bySlug.set(normalized.slug, normalized);
    byCode.set(normalized.countryCode.toUpperCase(), normalized);
  }

  for (const raw of worldCatalog.countries as CatalogCountry[]) {
    const stub = toCountry(raw);
    const richByCode = byCode.get(stub.countryCode.toUpperCase());
    const richBySlug = bySlug.get(stub.slug);
    const rich = richByCode ?? richBySlug;

    if (rich) {
      const landmark = landmarkImageForCode(stub.countryCode);
      const merged: Country = {
        ...rich,
        region: normalizeRegion(rich.region),
        imageUrl: landmark || rich.imageUrl || stub.imageUrl,
        mapKeys: Array.from(
          new Set([...(rich.mapKeys ?? []), ...(stub.mapKeys ?? [])]),
        ),
      };
      bySlug.set(merged.slug, merged);
      byCode.set(merged.countryCode.toUpperCase(), merged);
      continue;
    }

    bySlug.set(stub.slug, stub);
  }

  return Array.from(bySlug.values()).sort((a, b) =>
    a.name.localeCompare(b.name, "ru"),
  );
}

export const countries: Country[] = buildCountries();

export const regions = Array.from(
  new Set(countries.map((country) => country.region)),
).sort((a, b) => a.localeCompare(b, "ru"));

export function getCountryBySlug(slug: string): Country | undefined {
  return countries.find((country) => country.slug === slug);
}

export function findCountryByMapKey(mapKey: string): Country | undefined {
  const normalized = mapKey.trim().toLowerCase();

  return countries.find((country) =>
    country.mapKeys.some((key) => key.toLowerCase() === normalized),
  );
}

export function hasValidFlagCode(countryCode: string): boolean {
  return /^[a-z]{2}$/i.test(countryCode) && countryCode.toUpperCase() !== "XX";
}

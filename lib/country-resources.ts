import type { Country } from "@/lib/countries";
import type { WikiContent, WikiSectionId } from "@/lib/wiki";

export type CountryLink = {
  label: string;
  href: string;
};

export type CountryVideo = {
  id: string;
  title: string;
  lang: "ru" | "en";
  /** Переезд / быт vs туризм и достопримечательности */
  topic?: "live" | "travel";
  /** Если задан — карточка ведёт на поиск YouTube, а не на embed */
  searchQuery?: string;
};

const MAX_VIDEOS = 6;

/**
 * Страны, для которых в сайдбаре показываем русскоязычные гайды.
 * Постсоветское пространство + массовый русский в быту/релокации.
 */
const RUSSIAN_VIDEO_CODES = new Set([
  "RU",
  "BY",
  "KZ",
  "KG",
  "UA",
  "MD",
  "AM",
  "AZ",
  "UZ",
  "TJ",
  "TM",
  "GE",
]);

const LINK_SECTION_PRIORITY: WikiSectionId[] = [
  "gov",
  "visa",
  "law",
  "residence",
  "health",
  "banking",
  "work",
  "before",
];

const MAX_LINKS = 6;

/** Кураторские ссылки (перекрывают/дополняют авторазбор) */
const CURATED_LINKS: Record<string, CountryLink[]> = {
  georgia: [
    { label: "Консульский портал МИД", href: "https://www.geoconsul.gov.ge/en" },
    { label: "e-Visa", href: "https://www.evisa.gov.ge" },
    { label: "ВНЖ — SDA", href: "https://sda.gov.ge/en/products/migration-residence-permits/" },
    { label: "Дом юстиции", href: "https://psh.gov.ge" },
    { label: "Законы — Matsne", href: "https://matsne.gov.ge" },
    { label: "Право на труд", href: "https://labourmigration.moh.gov.ge" },
    { label: "Служба доходов", href: "https://www.rs.ge" },
    { label: "Экстренно 112", href: "https://112.gov.ge" },
  ],
  portugal: [
    { label: "SEF / AIMA (миграция)", href: "https://aima.gov.pt" },
    { label: "ePortugal", href: "https://eportugal.gov.pt" },
    { label: "Visit Portugal", href: "https://www.visitportugal.com" },
  ],
  "south-korea": [
    { label: "Korea Visa Portal", href: "https://www.visa.go.kr" },
    { label: "Hi Korea", href: "https://www.hikorea.go.kr" },
    { label: "Visit Korea", href: "https://english.visitkorea.or.kr" },
  ],
  thailand: [
    { label: "Thai e-Visa", href: "https://www.thaievisa.go.th" },
    { label: "Immigration Bureau", href: "https://www.immigration.go.th" },
    { label: "Tourism Authority", href: "https://www.tourismthailand.org" },
  ],
  argentina: [
    { label: "Migraciones", href: "https://www.migraciones.gov.ar" },
    { label: "Argentina.gob.ar", href: "https://www.argentina.gob.ar" },
    { label: "Visit Argentina", href: "https://www.argentina.travel" },
  ],
};

const CURATED_LINKS_EN: Record<string, CountryLink[]> = {
  georgia: [
    { label: "MFA consular portal", href: "https://www.geoconsul.gov.ge/en" },
    { label: "e-Visa", href: "https://www.evisa.gov.ge" },
    { label: "Residence — SDA", href: "https://sda.gov.ge/en/products/migration-residence-permits/" },
    { label: "House of Justice", href: "https://psh.gov.ge" },
    { label: "Laws — Matsne", href: "https://matsne.gov.ge" },
    { label: "Work rights", href: "https://labourmigration.moh.gov.ge" },
    { label: "Revenue Service", href: "https://www.rs.ge" },
    { label: "Emergency 112", href: "https://112.gov.ge" },
  ],
  portugal: [
    { label: "SEF / AIMA (migration)", href: "https://aima.gov.pt" },
    { label: "ePortugal", href: "https://eportugal.gov.pt" },
    { label: "Visit Portugal", href: "https://www.visitportugal.com" },
  ],
  "south-korea": [
    { label: "Korea Visa Portal", href: "https://www.visa.go.kr" },
    { label: "Hi Korea", href: "https://www.hikorea.go.kr" },
    { label: "Visit Korea", href: "https://english.visitkorea.or.kr" },
  ],
  thailand: [
    { label: "Thai e-Visa", href: "https://www.thaievisa.go.th" },
    { label: "Immigration Bureau", href: "https://www.immigration.go.th" },
    { label: "Tourism Authority", href: "https://www.tourismthailand.org" },
  ],
  argentina: [
    { label: "Migraciones", href: "https://www.migraciones.gov.ar" },
    { label: "Argentina.gob.ar", href: "https://www.argentina.gob.ar" },
    { label: "Visit Argentina", href: "https://www.argentina.travel" },
  ],
};

/**
 * Кураторские видео: и переезд, и туризм.
 * Для страны берём до MAX_VIDEOS роликов нужного языка.
 */
const CURATED_VIDEOS: Record<string, CountryVideo[]> = {
  georgia: [
    {
      id: "QQzSV_aA1Dg",
      title: "Батуми для удалёнщиков: стоит ли переезжать",
      lang: "ru",
      topic: "live",
    },
    {
      id: "Qu-4vHD_Lgs",
      title: "Тбилиси: архитектура, достопримечательности, кухня",
      lang: "ru",
      topic: "travel",
    },
    {
      id: "bySuOmi8A_c",
      title: "Тбилиси 2025: цены, еда, Кахетия, Сигнаги, Мцхета",
      lang: "ru",
      topic: "travel",
    },
    {
      id: "fOiAtiImC8c",
      title: "Батуми за 2 дня: что посмотреть и где поесть",
      lang: "ru",
      topic: "travel",
    },
    {
      id: "Z6PT7PsI7bI",
      title: "Move to Georgia 2025: residence permit",
      lang: "en",
      topic: "live",
    },
    {
      id: "5aT9zNvKr30",
      title: "4 days in Georgia: Tbilisi, Kazbegi, wine, food",
      lang: "en",
      topic: "travel",
    },
    {
      id: "pzahlj-5Xzk",
      title: "4 days in Tbilisi: attractions and food guide",
      lang: "en",
      topic: "travel",
    },
    {
      id: "alHfIBg44tM",
      title: "Journey to Kazbegi: mountains and Gergeti Church",
      lang: "en",
      topic: "travel",
    },
  ],
  portugal: [
    {
      id: "Vyxdsgkp_8Y",
      title: "What You Need to Move to Portugal",
      lang: "en",
      topic: "live",
    },
    {
      id: "xM0o4L4iqsU",
      title: "Portugal 2025 living expenses",
      lang: "en",
      topic: "live",
    },
    {
      id: "mH4mYuloF_E",
      title: "Moving to Portugal: visas and paperwork",
      lang: "en",
      topic: "live",
    },
    {
      id: "ufoKC9bzCbI",
      title: "3 days in Lisbon: itinerary for first visit",
      lang: "en",
      topic: "travel",
    },
    {
      id: "fRCZqTTuCAM",
      title: "Lisbon in 3 days: Belém, Sintra, Cascais",
      lang: "en",
      topic: "travel",
    },
    {
      id: "wtoDb6y7Oyw",
      title: "Top things to do in Lisbon travel guide",
      lang: "en",
      topic: "travel",
    },
  ],
  thailand: [
    {
      id: "search-en-th-live",
      title: "Moving to Thailand expat guide",
      lang: "en",
      topic: "live",
      searchQuery: "Moving to Thailand 2025 expat guide",
    },
    {
      id: "search-en-th-bkk",
      title: "Bangkok travel guide attractions",
      lang: "en",
      topic: "travel",
      searchQuery: "Bangkok travel guide top attractions",
    },
    {
      id: "search-en-th-islands",
      title: "Thailand islands and beaches guide",
      lang: "en",
      topic: "travel",
      searchQuery: "Thailand islands beaches travel guide",
    },
    {
      id: "search-en-th-chiang",
      title: "Chiang Mai what to see",
      lang: "en",
      topic: "travel",
      searchQuery: "Chiang Mai travel guide attractions",
    },
  ],
  "south-korea": [
    {
      id: "search-en-kr-live",
      title: "Moving to South Korea guide",
      lang: "en",
      topic: "live",
      searchQuery: "Moving to South Korea 2025 guide",
    },
    {
      id: "search-en-kr-seoul",
      title: "Seoul travel guide attractions",
      lang: "en",
      topic: "travel",
      searchQuery: "Seoul travel guide top attractions",
    },
    {
      id: "search-en-kr-busan",
      title: "Busan what to see",
      lang: "en",
      topic: "travel",
      searchQuery: "Busan travel guide attractions",
    },
    {
      id: "search-en-kr-food",
      title: "Korea food and culture trip",
      lang: "en",
      topic: "travel",
      searchQuery: "South Korea food travel vlog",
    },
  ],
  argentina: [
    {
      id: "search-en-ar-live",
      title: "Moving to Argentina expat guide",
      lang: "en",
      topic: "live",
      searchQuery: "Moving to Argentina 2025 guide",
    },
    {
      id: "search-en-ar-ba",
      title: "Buenos Aires travel guide",
      lang: "en",
      topic: "travel",
      searchQuery: "Buenos Aires travel guide attractions",
    },
    {
      id: "search-en-ar-iguazu",
      title: "Iguazu and Patagonia highlights",
      lang: "en",
      topic: "travel",
      searchQuery: "Argentina Iguazu Patagonia travel guide",
    },
    {
      id: "search-en-ar-food",
      title: "Argentina food and wine trip",
      lang: "en",
      topic: "travel",
      searchQuery: "Argentina food wine travel vlog",
    },
  ],
};

export function isRussianSpeakingCountry(countryCode: string): boolean {
  return RUSSIAN_VIDEO_CODES.has(countryCode.toUpperCase());
}

export function getCountryVideoLang(
  countryCode: string,
): "ru" | "en" {
  return isRussianSpeakingCountry(countryCode) ? "ru" : "en";
}

function extractLinksFromText(text: string): CountryLink[] {
  const links: CountryLink[] = [];
  const pattern = /\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(text)) !== null) {
    const label = match[1].trim();
    const href = match[2].trim();

    if (!label || !href) {
      continue;
    }

    links.push({ label, href });
  }

  return links;
}

function hostKey(href: string): string {
  try {
    return new URL(href).hostname.replace(/^www\./, "");
  } catch {
    return href;
  }
}

export function getCountryUsefulLinks(
  country: Country,
  locale: "ru" | "en" = "ru",
): CountryLink[] {
  const curated =
    (locale === "en"
      ? CURATED_LINKS_EN[country.slug]
      : CURATED_LINKS[country.slug]) ??
    CURATED_LINKS[country.slug] ??
    [];
  const seen = new Set(curated.map((link) => hostKey(link.href) + link.href));
  const merged = [...curated];

  for (const sectionId of LINK_SECTION_PRIORITY) {
    const text = country.wiki[sectionId];

    if (!text) {
      continue;
    }

    for (const link of extractLinksFromText(text)) {
      const key = hostKey(link.href) + link.href;

      if (seen.has(key)) {
        continue;
      }

      seen.add(key);
      merged.push(link);

      if (merged.length >= MAX_LINKS) {
        return merged.slice(0, MAX_LINKS);
      }
    }
  }

  return merged.slice(0, MAX_LINKS);
}

function youtubeSearchVideos(
  country: Country,
  lang: "ru" | "en",
): CountryVideo[] {
  const name = country.name;
  const mapName = country.mapName || name;
  const queries =
    lang === "ru"
      ? [
          { title: `${name}: переезд и жизнь`, q: `${name} переезд гайд`, topic: "live" as const },
          { title: `${name}: жизнь экспатов`, q: `${name} жизнь экспатов`, topic: "live" as const },
          { title: `${name}: достопримечательности`, q: `${name} достопримечательности путешествие`, topic: "travel" as const },
          { title: `${name}: что посмотреть туристу`, q: `${name} туризм что посмотреть`, topic: "travel" as const },
          { title: `${name}: маршруты и города`, q: `${name} путешествие города гайд`, topic: "travel" as const },
          { title: `${name}: еда и места`, q: `${name} еда путешествие влог`, topic: "travel" as const },
        ]
      : [
          { title: `Moving to ${mapName}`, q: `Moving to ${mapName} guide`, topic: "live" as const },
          { title: `Living in ${mapName}`, q: `Living in ${mapName} expat`, topic: "live" as const },
          { title: `${mapName} travel guide`, q: `${mapName} travel guide attractions`, topic: "travel" as const },
          { title: `Things to do in ${mapName}`, q: `Things to do in ${mapName} tourism`, topic: "travel" as const },
          { title: `${mapName} cities and sights`, q: `${mapName} best places to visit`, topic: "travel" as const },
          { title: `${mapName} food trip`, q: `${mapName} food travel vlog`, topic: "travel" as const },
        ];

  return queries.map((item, index) => ({
    id: `search-${lang}-${index}`,
    title: item.title,
    lang,
    topic: item.topic,
    searchQuery: item.q,
  }));
}

/** Чередуем live и travel, чтобы подборка не была только про переезд */
function balanceVideoTopics(videos: CountryVideo[]): CountryVideo[] {
  const live = videos.filter((video) => video.topic !== "travel");
  const travel = videos.filter((video) => video.topic === "travel");
  const mixed: CountryVideo[] = [];
  const maxLen = Math.max(live.length, travel.length);

  for (let index = 0; index < maxLen; index += 1) {
    if (live[index]) {
      mixed.push(live[index]);
    }
    if (travel[index]) {
      mixed.push(travel[index]);
    }
  }

  return mixed;
}

export function getCountryVideos(
  country: Country,
  preferredLang?: "ru" | "en",
): {
  lang: "ru" | "en";
  videos: CountryVideo[];
} {
  const lang = preferredLang ?? getCountryVideoLang(country.countryCode);
  const curated = (CURATED_VIDEOS[country.slug] ?? []).filter(
    (video) => video.lang === lang,
  );

  if (curated.length >= MAX_VIDEOS) {
    return {
      lang,
      videos: balanceVideoTopics(curated).slice(0, MAX_VIDEOS),
    };
  }

  if (curated.length > 0) {
    const fillers = youtubeSearchVideos(country, lang).slice(
      0,
      MAX_VIDEOS - curated.length,
    );

    return {
      lang,
      videos: balanceVideoTopics([...curated, ...fillers]).slice(0, MAX_VIDEOS),
    };
  }

  return {
    lang,
    videos: balanceVideoTopics(youtubeSearchVideos(country, lang)).slice(
      0,
      MAX_VIDEOS,
    ),
  };
}

export function isYoutubeSearchVideo(videoId: string): boolean {
  return videoId.startsWith("search-");
}

export function youtubeWatchUrl(videoId: string): string {
  return `https://www.youtube.com/watch?v=${videoId}`;
}

export function youtubeEmbedUrl(videoId: string): string {
  return `https://www.youtube.com/embed/${videoId}`;
}

export function youtubeSearchUrl(query: string): string {
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
}

export function youtubeThumbUrl(videoId: string): string {
  return `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
}

/** Секции, которые уводим в сайдбар и не дублируем длинным блоком в статье */
export function shouldHideWikiSectionInArticle(
  sectionId: string,
  hasSidebarVideos: boolean,
): boolean {
  if (sectionId === "videos" && hasSidebarVideos) {
    return true;
  }

  return false;
}

export type { WikiContent };

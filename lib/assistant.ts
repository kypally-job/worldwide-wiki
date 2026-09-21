import { countries, type Country } from "@/lib/countries";
import {
  getTravelProfile,
  seasonForMonth,
} from "@/lib/assistant-knowledge";
import { WIKI_SECTIONS, type WikiSectionId } from "@/lib/wiki";

export type AssistantMessage = {
  id: string;
  role: "assistant" | "user";
  text: string;
  href?: string;
  hrefLabel?: string;
  suggestions?: string[];
  offerFullChat?: boolean;
};

export type AssistantReply = {
  text: string;
  href?: string;
  hrefLabel?: string;
  suggestions?: string[];
  offerFullChat?: boolean;
  slots?: TripSlots;
};

export type TripSlots = {
  topic?: "sea" | "rest" | "visa" | "housing" | "work" | "health" | "country" | "general";
  swim?: boolean | null;
  warmth?: "warm" | "cool" | "any" | null;
  month?: number | null;
  visaFree?: boolean | null;
  waitingFor?: "swim" | "warmth" | "month" | null;
  countrySlug?: string | null;
};

export type AssistantTurnInput = {
  query: string;
  history?: Pick<AssistantMessage, "role" | "text">[];
  slots?: TripSlots | null;
  messageCount?: number;
};

const MONTH_NAMES_RU = [
  "январь",
  "февраль",
  "март",
  "апрель",
  "май",
  "июнь",
  "июль",
  "август",
  "сентябрь",
  "октябрь",
  "ноябрь",
  "декабрь",
];

const MONTH_NAMES_RU_GEN = [
  "января",
  "февраля",
  "марта",
  "апреля",
  "мая",
  "июня",
  "июля",
  "августа",
  "сентября",
  "октября",
  "ноября",
  "декабря",
];

const MONTH_STEMS: { stem: string; month: number }[] = [
  { stem: "январ", month: 1 },
  { stem: "феврал", month: 2 },
  { stem: "март", month: 3 },
  { stem: "апрел", month: 4 },
  { stem: " май", month: 5 },
  { stem: " мая", month: 5 },
  { stem: " мае", month: 5 },
  { stem: "may", month: 5 },
  { stem: "июн", month: 6 },
  { stem: "июл", month: 7 },
  { stem: "август", month: 8 },
  { stem: "сентябр", month: 9 },
  { stem: "октябр", month: 10 },
  { stem: "ноябр", month: 11 },
  { stem: "декабр", month: 12 },
];

const INTENT_KEYWORDS = {
  rest: ["отдых", "отдохн", "курорт", "путешеств", "тур", "вакац", "weekend"],
  sea: ["море", "пляж", "остров", "купат", "плават", "побереж", "океан"],
  visa: ["виз", "безвиз", "въезд", "паспорт", "граница"],
  housing: ["жиль", "аренд", "квартир", "снять", "ипотек"],
  work: ["работ", "трудо", "ваканс", "удалён", "удален"],
  health: ["медицин", "страхов", "клиник", "врач"],
  climate: ["климат", "погод", "температур", "дожд", "жар", "зим", "лет"],
} as const;

type Intent = keyof typeof INTENT_KEYWORDS;

function normalize(text: string) {
  return text.toLowerCase().replace(/ё/g, "е");
}

function stripMarkdown(text: string) {
  return text
    .replace(/###[^\n]*/g, " ")
    .replace(/\{#[^}]+\}/g, " ")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[*_`>#-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function nowContext(date = new Date()) {
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const year = date.getFullYear();

  return {
    date,
    month,
    day,
    year,
    monthName: MONTH_NAMES_RU[month - 1],
    label: `${day} ${MONTH_NAMES_RU_GEN[month - 1]} ${year}`,
  };
}

function detectMonths(query: string): number[] {
  const found: number[] = [];

  for (const { stem, month } of MONTH_STEMS) {
    if (query.includes(stem) && !found.includes(month)) {
      found.push(month);
    }
  }

  if (query.includes("сейчас") || query.includes("в этом месяц")) {
    const current = nowContext().month;
    if (!found.includes(current)) {
      found.push(current);
    }
  }

  return found;
}

function detectIntents(query: string): Intent[] {
  return (Object.keys(INTENT_KEYWORDS) as Intent[]).filter((intent) =>
    INTENT_KEYWORDS[intent].some((keyword) => query.includes(keyword)),
  );
}

function parseSlotAnswers(query: string, slots: TripSlots): TripSlots {
  const next = { ...slots };

  if (
    query.includes("купат") ||
    query.includes("плават") ||
    query.includes("в воду") ||
    query === "хочу купаться"
  ) {
    next.swim = true;
  } else if (
    query.includes("просто у моря") ||
    query.includes("без купан") ||
    query.includes("не купат") ||
    query.includes("возле моря") ||
    query.includes("у моря без")
  ) {
    next.swim = false;
  }

  if (
    query.includes("тепл") ||
    query.includes("жарк") ||
    query.includes("в тепло")
  ) {
    next.warmth = "warm";
  } else if (
    query.includes("прохлад") ||
    query.includes("не жарк") ||
    query.includes("свеж")
  ) {
    next.warmth = "cool";
  } else if (query.includes("без разницы") || query.includes("любой климат")) {
    next.warmth = "any";
  }

  if (query.includes("без виз") || query.includes("безвиз")) {
    next.visaFree = true;
  }

  const months = detectMonths(query);
  if (months.length > 0) {
    next.month = months[0];
  }

  return next;
}

function findMentionedCountries(query: string) {
  return countries
    .filter((country) => {
      const name = normalize(country.name);
      return name.length >= 3 && (query.includes(name) || name.includes(query.trim()));
    })
    .sort((a, b) => b.name.length - a.name.length);
}

function filledCountries() {
  return countries.filter(
    (country) =>
      !country.isPlaceholder ||
      Object.values(country.wiki).some((part) => Boolean(part?.trim())),
  );
}

function countryCorpus(country: Country) {
  const wikiParts = Object.values(country.wiki).filter(Boolean) as string[];
  const facts = country.facts ? Object.values(country.facts) : [];
  const profile = getTravelProfile(country.slug);

  return normalize(
    [
      country.name,
      country.region,
      country.description,
      ...country.highlights,
      ...facts,
      ...wikiParts,
      profile?.notes ?? "",
    ].join(" "),
  );
}

function isLegalDateNoise(sentence: string) {
  const normalized = normalize(sentence);
  return (
    /\d{4}/.test(normalized) &&
    (normalized.includes("штраф") ||
      normalized.includes("запрет") ||
      normalized.includes("постановлен") ||
      normalized.includes("закон") ||
      normalized.includes("просроч"))
  );
}

function extractSnippets(
  text: string,
  months: number[],
  preferTravel: boolean,
  limit = 2,
) {
  const plain = stripMarkdown(text);
  const sentences = plain
    .split(/(?<=[.!?])\s+/)
    .map((sentence) => sentence.trim())
    .filter((sentence) => sentence.length > 35 && !isLegalDateNoise(sentence));

  const travelWords = [
    "температур",
    "осадк",
    "дожд",
    "море",
    "пляж",
    "климат",
    "сезон",
    "влажн",
    "купал",
  ];

  const scored = sentences.map((sentence) => {
    const normalized = normalize(sentence);
    let score = 0;

    for (const month of months) {
      if (normalized.includes(MONTH_NAMES_RU[month - 1].slice(0, 5))) {
        score += 5;
      }
    }

    if (preferTravel) {
      score += travelWords.filter((word) => normalized.includes(word)).length * 2;
    }

    return { sentence, score };
  });

  return scored
    .filter((entry) => entry.score > 0 || !preferTravel)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((entry) => entry.sentence.slice(0, 320));
}

function pickSection(
  country: Country,
  intents: Intent[],
  months: number[],
): WikiSectionId | undefined {
  const preference: WikiSectionId[] = [];

  if (
    intents.includes("rest") ||
    intents.includes("sea") ||
    intents.includes("climate") ||
    months.length > 0
  ) {
    preference.push("cities", "overview", "before");
  }
  if (intents.includes("visa")) preference.push("visa", "before");
  if (intents.includes("housing")) preference.push("housing");
  if (intents.includes("work")) preference.push("work", "residence");
  if (intents.includes("health")) preference.push("health");
  preference.push("overview", "visa", "cities", "before");

  for (const id of preference) {
    if (country.wiki[id]?.trim()) {
      return id;
    }
  }

  return WIKI_SECTIONS.map((section) => section.id).find(
    (id) => country.wiki[id]?.trim(),
  );
}

function maybeOfferFullChat(text: string, messageCount?: number): boolean {
  return (messageCount ?? 0) >= 5 || text.length > 520;
}

function withOffer(reply: AssistantReply, messageCount?: number): AssistantReply {
  if (reply.offerFullChat || maybeOfferFullChat(reply.text, messageCount)) {
    return { ...reply, offerFullChat: true };
  }

  return reply;
}

function mergeHistoryContext(
  query: string,
  history?: Pick<AssistantMessage, "role" | "text">[],
) {
  if (!history?.length) {
    return query;
  }

  const recent = history
    .slice(-6)
    .map((message) => normalize(message.text))
    .join(" ");

  return `${recent} ${query}`.trim();
}

function inferSlotsFromQuery(query: string, previous: TripSlots | null | undefined): TripSlots {
  const now = nowContext();
  const slots = parseSlotAnswers(query, { ...(previous ?? {}) });
  const intents = detectIntents(query);
  const months = detectMonths(query);

  if (months.length > 0) {
    slots.month = months[0];
  }

  if (intents.includes("sea") || query.includes("на море") || query.includes("к морю")) {
    slots.topic = "sea";
  } else if (intents.includes("rest") && !slots.topic) {
    slots.topic = "rest";
  } else if (intents.includes("visa")) {
    slots.topic = "visa";
  } else if (intents.includes("housing")) {
    slots.topic = "housing";
  } else if (intents.includes("work")) {
    slots.topic = "work";
  } else if (intents.includes("health")) {
    slots.topic = "health";
  }

  if (slots.topic === "sea" || slots.topic === "rest") {
    if (slots.month == null) {
      slots.month = now.month;
    }

    // Defaults from wording — no follow-up questions
    if (slots.swim == null) {
      slots.swim =
        query.includes("купат") ||
        query.includes("плават") ||
        query.includes("пляж")
          ? true
          : query.includes("прогул") || query.includes("просто у")
            ? false
            : true;
    }

    if (slots.warmth == null) {
      slots.warmth =
        query.includes("тепл") || query.includes("жарк")
          ? "warm"
          : query.includes("прохлад") || query.includes("свеж")
            ? "cool"
            : "any";
    }
  }

  slots.waitingFor = null;
  return slots;
}

function rankSeaCountries(slots: TripSlots) {
  const month = slots.month ?? nowContext().month;
  const wantSwim = slots.swim !== false;

  return filledCountries()
    .map((country) => {
      const profile = getTravelProfile(country.slug);
      let score = country.isPlaceholder ? 0 : 3;

      if (!profile?.hasSea) {
        const corpus = countryCorpus(country);
        if (corpus.includes("море") || corpus.includes("пляж") || corpus.includes("океан")) {
          score += 2;
        } else {
          return { country, profile, score: 0, band: "off" as const };
        }
      }

      if (profile) {
        const band = seasonForMonth(profile, month, wantSwim);
        if (wantSwim && band === "swim") score += 10;
        if (!wantSwim && (band === "swim" || band === "mild")) score += 8;
        if (band === "off") score -= 4;

        if (slots.warmth === "warm" && profile.warmth === "warm") score += 5;
        if (slots.warmth === "warm" && profile.warmth === "mild") score += 2;
        if (slots.warmth === "cool" && profile.warmth !== "warm") score += 4;
        if (slots.warmth === "cool" && profile.warmth === "warm") score -= 3;

        if (slots.visaFree) {
          const corpus = countryCorpus(country);
          if (corpus.includes("безвиз") || corpus.includes("без виз")) score += 3;
        }

        score += profile.dataDepth === "full" ? 4 : profile.dataDepth === "partial" ? 2 : 0;

        return { country, profile, score, band };
      }

      return { country, profile: undefined, score, band: "mild" as const };
    })
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score);
}

function buildSeaAnswer(slots: TripSlots, messageCount?: number): AssistantReply {
  const now = nowContext();
  const month = slots.month ?? now.month;
  const monthName = MONTH_NAMES_RU[month - 1];
  const ranked = rankSeaCountries(slots).slice(0, 3);

  if (ranked.length === 0) {
    return withOffer(
      {
        text: `К сожалению, у меня нет полной информации по морскому отдыху на ${monthName} в текущей базе. Могу открыть каталог стран — там можно выбрать направление вручную.`,
        href: "/countries",
        hrefLabel: "Открыть каталог стран",
        slots: { ...slots, waitingFor: null },
      },
      messageCount,
    );
  }

  const lines: string[] = [];
  lines.push(
    `По запросу про море смотрю направления, где в ${monthName} обычно можно купаться или быть у тёплого моря${
      slots.swim === false
        ? " — с акцентом на отдых у воды, без обязательного купания"
        : ""
    }${
      slots.warmth === "warm"
        ? ", с уклоном в тепло"
        : slots.warmth === "cool"
          ? ", с уклоном в более прохладный климат"
          : ""
    }.`,
  );

  for (const entry of ranked) {
    const { country, profile, band } = entry;
    const parts: string[] = [`${country.name}:`];

    if (profile) {
      if (band === "swim") {
        parts.push("купальный сезон в этот период обычно открыт.");
      } else if (band === "mild") {
        parts.push(
          "море и побережье ещё уместны, хотя купание уже зависит от погоды и конкретного места.",
        );
      } else {
        parts.push("купальный сезон в этот месяц обычно слабый или закрыт.");
      }
      parts.push(profile.notes);
    } else {
      parts.push(country.description || "Есть в каталоге, но климат по месяцам ещё не разобран.");
    }

    const sectionId = pickSection(country, ["sea", "rest", "climate"], [month]);
    const sectionText = sectionId ? country.wiki[sectionId] : undefined;
    if (sectionText?.trim()) {
      const snippets = extractSnippets(sectionText, [month], true, 1);
      if (snippets[0]) {
        parts.push(`Из базы: ${snippets[0]}`);
      }
    } else if (profile?.dataDepth !== "full") {
      parts.push(
        "К сожалению, у меня нет полной информации по этой теме в карточке страны — опираюсь на краткие заметки каталога.",
      );
    }

    lines.push(parts.join(" "));
  }

  const top = ranked[0].country;
  const thin = ranked.every(
    (entry) => !entry.profile || entry.profile.dataDepth !== "full",
  );

  if (thin) {
    lines.push(
      "Если нужно точнее по визе, жилью или климату конкретного города — назови страну: глубже всего пока разобрана Грузия.",
    );
  }

  return withOffer(
    {
      text: lines.join("\n\n"),
      href: `/countries/${top.slug}`,
      hrefLabel: `Открыть ${top.name}`,
      slots: { ...slots, waitingFor: null, countrySlug: top.slug },
    },
    messageCount,
  );
}

function buildCountryAnswer(
  country: Country,
  query: string,
  intents: Intent[],
  months: number[],
  messageCount?: number,
): AssistantReply {
  const sectionId = pickSection(country, intents, months);
  const sectionTitle = WIKI_SECTIONS.find((section) => section.id === sectionId)?.title;
  const sectionText = sectionId ? country.wiki[sectionId] : undefined;
  const profile = getTravelProfile(country.slug);
  const lines: string[] = [];

  if (country.description && !country.isPlaceholder) {
    lines.push(`${country.name}: ${country.description}`);
  } else {
    lines.push(`${country.name} есть в каталоге Worldwide WIKI.`);
  }

  if (profile && (intents.includes("sea") || intents.includes("rest"))) {
    const month = months[0] ?? nowContext().month;
    const band = seasonForMonth(profile, month, intents.includes("sea"));
    lines.push(
      `По сезону (${MONTH_NAMES_RU[month - 1]}): ${
        band === "swim"
          ? "обычно подходит для моря и купания"
          : band === "mild"
            ? "море/побережье возможны, купание зависит от погоды"
            : "купальный сезон скорее слабый"
      }. ${profile.notes}`,
    );
  }

  if (sectionText?.trim()) {
    const snippets = extractSnippets(
      sectionText,
      months,
      intents.includes("sea") || intents.includes("rest") || intents.includes("climate"),
      2,
    );
    if (snippets.length > 0) {
      lines.push(
        sectionTitle
          ? `Из раздела «${sectionTitle}»:\n${snippets.join("\n\n")}`
          : snippets.join("\n\n"),
      );
    }
  } else if (country.highlights.length > 0) {
    lines.push(`Что отмечают чаще всего: ${country.highlights.slice(0, 4).join(", ")}.`);
    lines.push(
      "К сожалению, у меня нет полной информации по этой теме — подробные разделы ещё наполняются.",
    );
  } else {
    lines.push(
      "К сожалению, у меня нет полной информации по этой теме. Пока доступна только карточка в каталоге.",
    );
  }

  if (intents.includes("visa") || query.includes("без виз")) {
    lines.push(
      "По визе условия зависят от гражданства: сверяй актуальные правила перед поездкой.",
    );
  }

  return withOffer(
    {
      text: lines.join("\n\n"),
      href: `/countries/${country.slug}`,
      hrefLabel: `Открыть ${country.name}`,
      slots: { countrySlug: country.slug, waitingFor: null },
    },
    messageCount,
  );
}

function buildTopicAnswer(
  query: string,
  intents: Intent[],
  months: number[],
  messageCount?: number,
): AssistantReply {
  const ranked = filledCountries()
    .map((country) => {
      const corpus = countryCorpus(country);
      let score = country.isPlaceholder ? 0 : 4;

      for (const intent of intents) {
        for (const keyword of INTENT_KEYWORDS[intent]) {
          if (corpus.includes(keyword)) score += 2;
        }
      }

      for (const month of months) {
        if (corpus.includes(MONTH_NAMES_RU[month - 1].slice(0, 5))) score += 5;
      }

      return { country, score };
    })
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  if (ranked.length === 0) {
    return withOffer(
      {
        text: "К сожалению, у меня нет полной информации по этой теме в базе. Уточни страну или раздел — виза, жильё, климат, отдых — и я поищу снова.",
        href: "/countries",
        hrefLabel: "Открыть каталог стран",
      },
      messageCount,
    );
  }

  return buildCountryAnswer(
    ranked[0].country,
    query,
    intents,
    months,
    messageCount,
  );
}

export function createGreeting(): AssistantReply {
  return {
    text: "Привет! Задай мне вопрос — соберу ответ из базы Worldwide WIKI.",
  };
}

export function answerFromSiteData(
  rawQuery: string,
  input: Omit<AssistantTurnInput, "query"> = {},
): AssistantReply {
  const query = normalize(rawQuery.trim());
  const now = nowContext();
  const messageCount = input.messageCount ?? 0;

  if (query.length < 2) {
    return {
      text: "Напиши вопрос чуть подробнее — например про море, визу, жильё или конкретную страну.",
    };
  }

  const contextQuery = mergeHistoryContext(query, input.history);
  const slots = inferSlotsFromQuery(contextQuery, input.slots);
  const intents = detectIntents(contextQuery);
  const months = detectMonths(contextQuery);

  if (slots.topic === "sea" || (intents.includes("sea") && findMentionedCountries(query).length === 0)) {
    return buildSeaAnswer(
      {
        ...slots,
        topic: "sea",
        month: slots.month ?? months[0] ?? now.month,
      },
      messageCount,
    );
  }

  if (
    intents.includes("rest") &&
    !intents.includes("sea") &&
    findMentionedCountries(query).length === 0
  ) {
    return buildTopicAnswer(
      contextQuery,
      intents.length > 0 ? intents : ["rest"],
      months.length > 0 ? months : [now.month],
      messageCount,
    );
  }

  const mentioned = findMentionedCountries(query);
  if (mentioned.length === 0) {
    const fromContext = findMentionedCountries(contextQuery);
    if (fromContext.length > 0) {
      return buildCountryAnswer(
        fromContext[0],
        contextQuery,
        intents,
        months.length > 0 ? months : [now.month],
        messageCount,
      );
    }
  } else {
    return buildCountryAnswer(
      mentioned[0],
      contextQuery,
      intents,
      months.length > 0 ? months : [now.month],
      messageCount,
    );
  }

  if (intents.length > 0 || months.length > 0) {
    return buildTopicAnswer(contextQuery, intents, months, messageCount);
  }

  const loose = filledCountries().find((country) => {
    const corpus = countryCorpus(country);
    return contextQuery
      .split(/[^a-zа-я0-9]+/i)
      .filter((word) => word.length > 4)
      .some((word) => corpus.includes(word));
  });

  if (loose) {
    return buildCountryAnswer(loose, contextQuery, intents, months, messageCount);
  }

  return withOffer(
    {
      text: "К сожалению, у меня нет полной информации по этой теме. Могу искать по странам и разделам базы: море и сезон, виза, климат, жильё, работа. Спроси конкретнее или назови страну.",
      href: "/countries",
      hrefLabel: "Открыть каталог стран",
      slots: { ...slots, waitingFor: null },
    },
    messageCount,
  );
}

/** @deprecated use answerFromSiteData with context */
export function answerQuery(query: string) {
  return answerFromSiteData(query);
}

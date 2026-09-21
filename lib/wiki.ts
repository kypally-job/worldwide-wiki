export const WIKI_SECTIONS = [
  { id: "visa", title: "Въезд", summary: "Безвиз, виза, граница" },
  { id: "before", title: "Подготовка", summary: "Документы и запреты" },
  { id: "cities", title: "Города", summary: "Климат и где жить" },
  { id: "health", title: "Медицина", summary: "Страховка и клиники" },
  { id: "residence", title: "ВНЖ", summary: "Разрешение на жизнь" },
  { id: "housing", title: "Жильё", summary: "Аренда, покупка, ЖКХ" },
  { id: "banking", title: "Деньги", summary: "Счёт, карты, переводы" },
  { id: "work", title: "Работа", summary: "Найм и право на труд" },
  { id: "transport", title: "Транспорт", summary: "Город и между городами" },
  { id: "connectivity", title: "Связь", summary: "SIM и интернет" },
  { id: "gov", title: "Госорганы", summary: "Официальные сайты" },
  { id: "overview", title: "О стране", summary: "Факты и устройство" },
  { id: "education", title: "Учёба", summary: "Школы, вузы, язык" },
  { id: "business", title: "Бизнес", summary: "ИП и компании" },
  { id: "status", title: "ПМЖ", summary: "Долгий статус и паспорт" },
  { id: "animals", title: "Животные", summary: "Питомцы и улица" },
  { id: "communities", title: "Сообщества", summary: "Чаты и группы" },
  { id: "videos", title: "Видео", summary: "Что смотреть" },
  { id: "law", title: "Законы", summary: "Нормы и первоисточники" },
] as const;

export type WikiSectionId = (typeof WIKI_SECTIONS)[number]["id"];

export type WikiContent = Partial<Record<WikiSectionId, string>>;

export const WIKI_TOC_GROUPS = [
  {
    label: "Граница",
    description: "Виза, документы, города",
    ids: ["visa", "before", "cities"],
  },
  {
    label: "Оформление",
    description: "Страховка и ВНЖ",
    ids: ["health", "residence"],
  },
  {
    label: "Быт",
    description: "Жильё, деньги, работа",
    ids: ["housing", "banking", "work", "transport", "connectivity", "gov"],
  },
  {
    label: "Справка",
    description: "ПМЖ, законы, учёба",
    ids: [
      "overview",
      "education",
      "business",
      "status",
      "animals",
      "communities",
      "videos",
      "law",
    ],
  },
] as const satisfies ReadonlyArray<{
  label: string;
  description: string;
  ids: readonly WikiSectionId[];
}>;

export const OVERVIEW_FACTS = [
  { id: "area", title: "Размер" },
  { id: "population", title: "Население" },
  { id: "languages", title: "Языки" },
  { id: "religion", title: "Религия" },
  { id: "government", title: "Действующая власть" },
] as const;

export type OverviewFactId = (typeof OVERVIEW_FACTS)[number]["id"];

export type OverviewFacts = Partial<Record<OverviewFactId, string>>;

export type WikiSubsection = {
  id: string;
  title: string;
};

export type WikiSectionView = {
  id: WikiSectionId;
  title: string;
  summary: string;
  text: string;
  isPlaceholder: boolean;
  subsections: WikiSubsection[];
};

export function getWikiGroup(sectionId: string) {
  return (
    WIKI_TOC_GROUPS.find((group) =>
      (group.ids as readonly string[]).includes(sectionId),
    ) ?? WIKI_TOC_GROUPS[0]
  );
}

export function slugifyHeading(title: string): string {
  return title
    .toLowerCase()
    .replace(/ё/g, "е")
    .replace(/[^a-z0-9а-я]+/gi, "-")
    .replace(/^-+|-+$/g, "");
}

export function parseHeadingLine(
  line: string,
  sectionId: string,
): WikiSubsection {
  const match = line.match(/^(.*?)\s*\{#([a-z0-9-]+)\}\s*$/);

  if (match) {
    return {
      title: match[1].trim(),
      id: `${sectionId}-${match[2]}`,
    };
  }

  const title = line.trim();

  return {
    title,
    id: `${sectionId}-${slugifyHeading(title)}`,
  };
}

export function getWikiSubsections(
  sectionId: string,
  text: string,
): WikiSubsection[] {
  return text
    .split("\n")
    .filter((line) => line.startsWith("### "))
    .map((line) => parseHeadingLine(line.slice(4), sectionId));
}

export function getWikiSections(
  countryName: string,
  wiki: WikiContent,
): WikiSectionView[] {
  return WIKI_SECTIONS.map((section) => {
    const text = wiki[section.id]?.trim() ?? "";
    const filled = text.length > 0;

    return {
      ...section,
      isPlaceholder: !filled,
      text: filled
        ? text
        : `Раздел «${section.title}» для страны ${countryName} появится на следующем шаге наполнения.`,
      subsections: filled ? getWikiSubsections(section.id, text) : [],
    };
  });
}

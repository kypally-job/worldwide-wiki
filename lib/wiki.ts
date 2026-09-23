import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";

export const WIKI_SECTION_IDS = [
  "overview",
  "visa",
  "before",
  "cities",
  "health",
  "residence",
  "status",
  "housing",
  "banking",
  "connectivity",
  "transport",
  "work",
  "business",
  "education",
  "animals",
  "communities",
  "gov",
  "law",
  "videos",
] as const;

export type WikiSectionId = (typeof WIKI_SECTION_IDS)[number];

/** @deprecated prefer dictionary titles via getWikiSections(locale) */
export const WIKI_SECTIONS = WIKI_SECTION_IDS.map((id) => ({
  id,
  title: getDictionary("ru").wiki.sections[id].title,
  summary: getDictionary("ru").wiki.sections[id].summary,
}));

export type WikiContent = Partial<Record<WikiSectionId, string>>;

export const WIKI_TOC_GROUP_IDS = [
  {
    id: "start" as const,
    ids: ["overview", "visa", "before", "cities"] as const,
  },
  {
    id: "status" as const,
    ids: ["health", "residence", "status"] as const,
  },
  {
    id: "daily" as const,
    ids: ["housing", "banking", "connectivity", "transport"] as const,
  },
  {
    id: "work" as const,
    ids: ["work", "business", "education"] as const,
  },
  {
    id: "more" as const,
    ids: ["animals", "communities", "gov", "law", "videos"] as const,
  },
];

export const WIKI_TOC_GROUPS = WIKI_TOC_GROUP_IDS.map((group) => ({
  label: getDictionary("ru").wiki.groups[group.id],
  description: "",
  ids: group.ids,
}));

export const OVERVIEW_FACTS = [
  { id: "area", title: "Размер" },
  { id: "population", title: "Население" },
  { id: "languages", title: "Языки" },
  { id: "religion", title: "Религия" },
  { id: "government", title: "Власть" },
] as const;

export const SNAPSHOT_FACTS = [
  { id: "area", title: "Размер" },
  { id: "population", title: "Население" },
  { id: "languages", title: "Языки" },
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

export function isWikiSectionFilled(text: string): boolean {
  const trimmed = text.trim();

  if (!trimmed) {
    return false;
  }

  const withoutHeadings = trimmed
    .replace(/^### .+$/gm, "")
    .replace(/\n{2,}/g, "\n")
    .trim();

  if (!withoutHeadings) {
    return false;
  }

  if (
    /появится (на следующем шаге|при наполнении)|will (appear|be filled)/i.test(
      withoutHeadings,
    )
  ) {
    const useful = withoutHeadings
      .split("\n")
      .map((line) => line.trim())
      .filter(
        (line) =>
          line.length > 0 &&
          !/^появится/i.test(line) &&
          !/will (appear|be filled)/i.test(line) &&
          !/появится (на следующем шаге|при наполнении)/i.test(line),
      );

    return useful.length > 0;
  }

  return true;
}

export function getWikiSections(
  countryName: string,
  wiki: WikiContent,
  options: { includePlaceholders?: boolean; locale?: Locale } = {},
): WikiSectionView[] {
  const includePlaceholders = options.includePlaceholders ?? false;
  const locale = options.locale ?? "ru";
  const dictionary = getDictionary(locale);

  return WIKI_SECTION_IDS.map((id) => {
    const meta = dictionary.wiki.sections[id];
    const raw = wiki[id]?.trim() ?? "";
    const filled = isWikiSectionFilled(raw);

    return {
      id,
      title: meta.title,
      summary: meta.summary,
      isPlaceholder: !filled,
      text: filled
        ? raw
        : dictionary.wiki.placeholder
            .replace("{title}", meta.title)
            .replace("{name}", countryName),
      subsections: filled ? getWikiSubsections(id, raw) : [],
    };
  }).filter((section) => includePlaceholders || !section.isPlaceholder);
}

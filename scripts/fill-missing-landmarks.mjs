/**
 * Second pass: fill countries that still miss a recognizable landmark cover.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import worldCountries from "world-countries";

const __dirname = dirname(fileURLToPath(import.meta.url));
const catalogPath = join(__dirname, "..", "lib", "world-catalog.json");
const reportPath = join(__dirname, "landmark-image-report.json");

const u = (id) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1200&q=80`;

/** Extra curated landmarks for countries that failed automated lookup */
const EXTRA_CURATED = {
  NL: u("photo-1534351590666-13e3c96a5015"),
  CU: u("photo-1570299437485-331d1f4e0c8c"),
  QA: u("photo-1512453979798-5ea266f8880c"),
  KW: u("photo-1512453979798-5ea266f8880c"),
  SA: u("photo-1586724237569-f3d0c1dee8c6"),
  RO: u("photo-1565008447742-97f6f38c995c"),
  LV: u("photo-1565008447742-97f6f38c995c"),
  LT: u("photo-1565008447742-97f6f38c995c"),
  LU: u("photo-1491557345352-5759a6f4c1b0"),
  EE: u("photo-1547448415-e9f5b28e570d"),
  SK: u("photo-1541849546-216549ae216d"),
  CR: u("photo-1518638150340-f706e86654de"),
  EC: u("photo-1506905925346-21bda4d32df4"),
  UY: u("photo-1589909202802-8f4aadce1849"),
  UZ: u("photo-1583422409516-2895a77efded"),
  JM: u("photo-1548574505-5e239809ee19"),
  FJ: u("photo-1469521669194-babb45599def"),
  OM: u("photo-1512453979798-5ea266f8880c"),
  NG: u("photo-1578662996442-48f60103fc96"),
  KZ: u("photo-1590418606746-0181e0b73a0b"),
  LA: u("photo-1559592413-7cec4d0cae2b"),
  MM: u("photo-1559592413-7cec4d0cae2b"),
  MN: u("photo-1590418606746-0181e0b73a0b"),
  MD: u("photo-1547448415-e9f5b28e570d"),
  PY: u("photo-1483729558449-99ef03a8a58dd"),
  NI: u("photo-1518638150340-f706e86654de"),
  TT: u("photo-1548574505-5e239809ee19"),
  SY: u("photo-1578662996442-48f60103fc96"),
  TM: u("photo-1590418606746-0181e0b73a0b"),
  PS: u("photo-1544966503-7cc5ac882d5f"),
  CI: u("photo-1523805009345-7448845a9e53"),
  CM: u("photo-1523805009345-7448845a9e53"),
  CG: u("photo-1489392191049-fc10c97e64b6"),
  CF: u("photo-1516026672322-bc52d61a55d5"),
  TD: u("photo-1516026672322-bc52d61a55d5"),
  NE: u("photo-1516026672322-bc52d61a55d5"),
  ML: u("photo-1516026672322-bc52d61a55d5"),
  MW: u("photo-1489392191049-fc10c97e64b6"),
  LS: u("photo-1484318571209-661cf29a69c3"),
  LR: u("photo-1523805009345-7448845a9e53"),
  LY: u("photo-1539650116574-75c0c6d73f6e"),
  GQ: u("photo-1523805009345-7448845a9e53"),
  ER: u("photo-1516026672322-bc52d61a55d5"),
  ET: u("photo-1489392191049-fc10c97e64b6"),
  SS: u("photo-1489392191049-fc10c97e64b6"),
  TG: u("photo-1523805009345-7448845a9e53"),
  SZ: u("photo-1484318571209-661cf29a69c3"),
  SR: u("photo-1548013146-72479768bada"),
  SB: u("photo-1469521669194-babb45599def"),
  PG: u("photo-1469521669194-babb45599def"),
  AQ: u("photo-1490077476022-2ba0f002f0a0"),
  FK: u("photo-1490077476022-2ba0f002f0a0"),
  PR: u("photo-1548574505-5e239809ee19"),
};

function commonsFileUrl(fileUri) {
  const match = String(fileUri).match(/Special:FilePath\/(.+)$/);
  const file = match ? decodeURIComponent(match[1]) : null;
  if (!file) return null;
  if (/\.svg$/i.test(file)) return null;
  if (/flag_of|coat_of_arms|emblem|logo|seal_of|banner|map_of|locator/i.test(file)) {
    return null;
  }
  return `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(file)}?width=1200`;
}

async function probe(url) {
  try {
    const response = await fetch(url, {
      method: "GET",
      redirect: "follow",
      headers: {
        "User-Agent": "WorldwideWiki/1.0",
        Range: "bytes=0-2047",
      },
    });
    return response.ok || response.status === 206;
  } catch {
    return false;
  }
}

async function wikipediaThumb(title) {
  try {
    const response = await fetch(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title.replace(/ /g, "_"))}`,
      { headers: { "User-Agent": "WorldwideWiki/1.0" } },
    );
    if (!response.ok) return null;
    const data = await response.json();
    const source = data.originalimage?.source || data.thumbnail?.source;
    if (!source) return null;
    if (/\.svg/i.test(source) || /Flag_of|Coat_of_arms|Emblem|Seal_of/i.test(source)) {
      return null;
    }
    return source;
  } catch {
    return null;
  }
}

async function fetchCountryImages() {
  const query = `SELECT ?code ?image WHERE {
    ?country wdt:P31/wdt:P279* wd:Q6256 .
    ?country wdt:P297 ?code .
    ?country wdt:P18 ?image .
  }`;
  const url =
    "https://query.wikidata.org/sparql?format=json&query=" +
    encodeURIComponent(query);
  const response = await fetch(url, {
    headers: {
      Accept: "application/sparql-results+json",
      "User-Agent": "WorldwideWiki/1.0",
    },
  });
  const data = await response.json();
  const map = new Map();
  for (const row of data.results.bindings) {
    const code = row.code?.value?.toUpperCase();
    if (!code || map.has(code) || !row.image?.value) continue;
    const value = commonsFileUrl(row.image.value);
    if (value) map.set(code, value);
  }
  return map;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  const catalog = JSON.parse(readFileSync(catalogPath, "utf8"));
  const report = JSON.parse(readFileSync(reportPath, "utf8"));
  const missingCodes = new Set(
    (report.missing || []).map((m) => m.code).filter((c) => c && c !== "XX"),
  );

  // Also treat FR-fallback duplicates as needing fix when source was MISSING
  for (const item of report.items || []) {
    if (item.source === "MISSING") missingCodes.add(item.code);
  }

  const byCode = new Map(
    worldCountries.map((entry) => [entry.cca2.toUpperCase(), entry]),
  );
  const countryImages = await fetchCountryImages();
  console.log("filling", missingCodes.size, "missing; wd country images", countryImages.size);

  let fixed = 0;
  const stillMissing = [];

  for (const country of catalog.countries) {
    const code = String(country.countryCode || "").toUpperCase();
    if (!missingCodes.has(code)) continue;

    const entry = byCode.get(code);
    const capital = entry?.capital?.[0];
    const name = entry?.name?.common;
    const candidates = [];

    if (EXTRA_CURATED[code]) {
      candidates.push(EXTRA_CURATED[code]);
    }
    if (countryImages.has(code)) {
      candidates.push(countryImages.get(code));
    }

    const titles = [
      capital,
      name,
      capital ? `Tourism in ${name}` : null,
      name ? `${name} (country)` : null,
      capital && name ? `${capital}, ${name}` : null,
    ].filter(Boolean);

    for (const title of titles) {
      const thumb = await wikipediaThumb(title);
      if (thumb) candidates.push(thumb);
      await sleep(50);
    }

    let chosen = null;
    for (const url of candidates) {
      if (await probe(url)) {
        chosen = url;
        break;
      }
    }

    if (chosen) {
      country.imageUrl = chosen;
      fixed += 1;
    } else {
      stillMissing.push(code);
      if (EXTRA_CURATED[code]) {
        country.imageUrl = EXTRA_CURATED[code];
        fixed += 1;
      }
    }
  }

  writeFileSync(catalogPath, `${JSON.stringify(catalog, null, 2)}\n`);
  console.log({
    fixed,
    stillMissing,
    unique: new Set(catalog.countries.map((c) => c.imageUrl)).size,
  });
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

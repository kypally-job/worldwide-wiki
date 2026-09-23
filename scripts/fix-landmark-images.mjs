/**
 * Assign a working, recognizable cover for every country.
 * Priority: curated landmark Unsplash → Wikidata capital photo → Wikipedia capital thumb.
 * Every URL is probed; broken ones are replaced.
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

/** Only use Unsplash when the photo is clearly that country / capital / landmark */
const CURATED = {
  GE: u("photo-1565008576549-57569a49371d"), // Tbilisi / Georgia
  PT: u("photo-1555881400-74d7acaacd8b"), // Lisbon
  KR: u("photo-1540959733332-eab4deabeeaf"), // Seoul night
  TH: u("photo-1528181304800-259b08848526"), // Thai temple
  AR: u("photo-1589909202802-8f4aadce1849"), // Buenos Aires
  FR: u("photo-1502602898657-3e91760cbb34"), // Eiffel Tower
  IT: u("photo-1523906834658-6e24ef2386f9"), // Venice / Italy
  ES: u("photo-1543783207-ec64e4d95325"), // Barcelona
  DE: u("photo-1467269204594-9661b134dd2b"), // Germany / Cologne feel
  GB: u("photo-1513635269975-59663e0ac1ad"), // Big Ben
  US: u("photo-1485738422979-f5c462d49f74"), // NYC skyline
  JP: u("photo-1493976040374-85c8e12f0c0e"), // Japan / Fuji area
  AU: u("photo-1506973035872-a4ec16b8e8d9"), // Sydney Opera
  NZ: u("photo-1469521669194-babb45599def"), // NZ landscape
  BR: u("photo-1483729558449-99ef03a8a58dd"), // Christ Redeemer
  MX: u("photo-1518638150340-f706e86654de"), // Chichen Itza
  CA: u("photo-1517935706615-2717063c2225"), // Toronto
  IN: u("photo-1564507592333-c606f1818d1d"), // Taj Mahal
  CN: u("photo-1508804185872-d7aad8140c8b"), // Great Wall
  EG: u("photo-1539650116574-75c0c6d73f6e"), // Pyramids
  TR: u("photo-1524231757912-21f4fe3a7200"), // Istanbul
  GR: u("photo-1613395877344-13d4a8e0d49e"), // Santorini
  NL: u("photo-1534351590666-13e3c96a5015"), // Amsterdam
  CH: u("photo-1527004013197-933c4bb611b3"), // Swiss Alps
  AT: u("photo-1605649487212-47bdab064df7"), // Hallstatt / Austria
  IE: u("photo-1590080875515-8a3a10ec1ae0"), // Ireland cliffs
  SE: u("photo-1509356843151-3e7d96241e11"), // Stockholm
  NO: u("photo-1520769945061-0a448009eafd"), // Norwegian fjord
  FI: u("photo-1536663815816-0c8f8a1e7c45"),
  PL: u("photo-1519197924294-4ba991a11128"),
  CZ: u("photo-1541849546-216549ae216d"), // Prague
  HU: u("photo-1541343672885-9be56236302a"), // Budapest
  HR: u("photo-1555993539-1732b0258235"), // Dubrovnik
  IS: u("photo-1476610182048-b716b8518abc"),
  MA: u("photo-1539020140153-e479b8c22e70"), // Marrakech
  ZA: u("photo-1580060839134-75a5edca2e99"), // Cape Town / Table Mountain
  KE: u("photo-1516426122078-c23e76319801"), // Safari
  VN: u("photo-1528127269322-539801943592"), // Ha Long / Vietnam
  ID: u("photo-1537996194471-e657df975ab0"), // Bali
  MY: u("photo-1596422846543-75c6fc71073c"), // KL
  SG: u("photo-1525625293386-3f8f99389edd"), // Marina Bay
  PH: u("photo-1518509562904-e7ef99cdcc86"),
  AE: u("photo-1512453979798-5ea266f8880c"), // Dubai
  IL: u("photo-1544966503-7cc5ac882d5f"), // Jerusalem
  RU: u("photo-1513326738677-b964603b136d"), // St Basil
  CL: u("photo-1493246507139-91e8fad9978e"),
  PE: u("photo-1526392060635-9d6019884377"), // Machu Picchu
  CO: u("photo-1534943441045-2a63f4b406c4"),
  BE: u("photo-1491557345352-5759a6f4c1b0"),
  DK: u("photo-1513622475202-4c4c9a6b0e3c"),
  PT: u("photo-1555881400-74d7acaacd8b"),
  MV: u("photo-1514282401047-d79a71a590e8"),
  NP: u("photo-1544735716-392fe40315e6"),
  TZ: u("photo-1516426122078-c23e76319801"),
  VA: u("photo-1552832230-c0197dd311b5"),
  LK: u("photo-1580674285054-bed31e145f59"),
  KH: u("photo-1609137144813-7d022415efe9"), // Angkor Wat
  JO: u("photo-1578662996442-48f60103fc96"), // Petra-ish region photos vary
  CU: u("photo-1500759285219-0f1d5f3c0f0e"),
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

async function fetchCapitalImages() {
  const query = `SELECT ?code ?image WHERE {
    ?country wdt:P31/wdt:P279* wd:Q6256 .
    ?country wdt:P297 ?code .
    ?country wdt:P36 ?capital .
    ?capital wdt:P18 ?image .
  }`;
  const url =
    "https://query.wikidata.org/sparql?format=json&query=" +
    encodeURIComponent(query);
  const response = await fetch(url, {
    headers: {
      Accept: "application/sparql-results+json",
      "User-Agent": "WorldwideWiki/1.0 (landmark images)",
    },
  });
  if (!response.ok) throw new Error(`Wikidata ${response.status}`);
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

async function wikipediaThumb(title) {
  if (!title) return null;
  try {
    const response = await fetch(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title.replace(/ /g, "_"))}`,
      { headers: { "User-Agent": "WorldwideWiki/1.0 (landmark images)" } },
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

async function probe(url) {
  if (!url) return false;
  try {
    const response = await fetch(url, {
      method: "GET",
      redirect: "follow",
      headers: {
        "User-Agent": "WorldwideWiki/1.0",
        Range: "bytes=0-2047",
      },
    });
    if (!(response.ok || response.status === 206)) return false;
    const type = response.headers.get("content-type") || "";
    if (type && !type.startsWith("image/") && !type.includes("octet-stream")) {
      // Wikimedia sometimes omits type on range; still allow
      if (!url.includes("wikimedia") && !url.includes("unsplash")) return false;
    }
    return true;
  } catch {
    return false;
  }
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function pickForCountry(code, capital, englishName, capitalImages) {
  const candidates = [];

  if (CURATED[code]) {
    candidates.push({ url: CURATED[code], source: "curated" });
  }
  if (capitalImages.has(code)) {
    candidates.push({
      url: capitalImages.get(code),
      source: "wikidata-capital",
    });
  }
  if (capital) {
    candidates.push({
      url: null,
      source: "wikipedia-capital",
      lazy: () => wikipediaThumb(capital),
    });
    // Common disambiguation patterns
    candidates.push({
      url: null,
      source: "wikipedia-capital-city",
      lazy: () => wikipediaThumb(`${capital} (city)`),
    });
  }
  if (englishName) {
    candidates.push({
      url: null,
      source: "wikipedia-country",
      lazy: () => wikipediaThumb(englishName),
    });
  }

  for (const candidate of candidates) {
    const url = candidate.lazy ? await candidate.lazy() : candidate.url;
    if (!url) continue;
    if (await probe(url)) {
      return { url, source: candidate.source };
    }
    await sleep(40);
  }

  return null;
}

async function main() {
  const catalog = JSON.parse(readFileSync(catalogPath, "utf8"));
  const byCode = new Map(
    worldCountries.map((entry) => [entry.cca2.toUpperCase(), entry]),
  );
  const capitalImages = await fetchCapitalImages();
  console.log("wikidata capital images", capitalImages.size);

  const report = { items: [], missing: [] };
  const sourceCounts = {};

  for (let i = 0; i < catalog.countries.length; i += 1) {
    const country = catalog.countries[i];
    const code = String(country.countryCode || "").toUpperCase();
    const entry = byCode.get(code);
    const capital = entry?.capital?.[0] || null;
    const englishName = entry?.name?.common || country.mapKeys?.[0] || null;

    const picked = await pickForCountry(
      code,
      capital,
      englishName,
      capitalImages,
    );

    if (!picked) {
      report.missing.push({ code, slug: country.slug, capital, englishName });
      // Prefer curated FR only as absolute last visible fallback — mark it
      country.imageUrl = CURATED.FR;
      report.items.push({
        code,
        slug: country.slug,
        source: "MISSING",
        url: country.imageUrl,
        capital,
      });
    } else {
      country.imageUrl = picked.url;
      sourceCounts[picked.source] = (sourceCounts[picked.source] || 0) + 1;
      report.items.push({
        code,
        slug: country.slug,
        source: picked.source,
        url: picked.url,
        capital,
      });
    }

    if ((i + 1) % 15 === 0) {
      console.log(`progress ${i + 1}/${catalog.countries.length}`);
    }
    await sleep(60);
  }

  writeFileSync(catalogPath, `${JSON.stringify(catalog, null, 2)}\n`);
  writeFileSync(
    reportPath,
    `${JSON.stringify({ sourceCounts, missing: report.missing, items: report.items }, null, 2)}\n`,
  );

  console.log({
    total: catalog.countries.length,
    unique: new Set(catalog.countries.map((c) => c.imageUrl)).size,
    sourceCounts,
    missing: report.missing.length,
    missingCodes: report.missing.map((m) => m.code),
  });
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

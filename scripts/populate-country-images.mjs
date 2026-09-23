import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const catalogPath = join(__dirname, "..", "lib", "world-catalog.json");

const u = (id) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1200&q=80`;

/** Hand-picked scenic Unsplash covers by ISO code */
const CURATED_BY_CODE = {
  GE: u("photo-1565008576549-57569a49371d"),
  PT: u("photo-1555881400-74d7acaacd8b"),
  KR: u("photo-1540959733332-eab4deabeeaf"),
  TH: u("photo-1528181304800-259b08848526"),
  AR: u("photo-1589909202802-8f4aadce1849"),
  FR: u("photo-1502602898657-3e91760cbb34"),
  IT: u("photo-1516483638261-f4dbaf036963"),
  ES: u("photo-1543783207-ec64e4d95325"),
  DE: u("photo-1467269204594-9661b134dd2b"),
  GB: u("photo-1513635269975-59663e0ac1ad"),
  US: u("photo-1485738422979-f5c462d49f74"),
  JP: u("photo-1480796927426-f609979314bd"),
  AU: u("photo-1506973035872-a4ec16b8e8d9"),
  NZ: u("photo-1469521669194-babb45599def"),
  BR: u("photo-1483729558449-99ef03a8a58dd"),
  MX: u("photo-1518638150340-f706e86654de"),
  CA: u("photo-1503614472-8c93d56e92ce"),
  IN: u("photo-1524492412937-b28074a5d7da"),
  CN: u("photo-1508804185872-d7aad8140c8b"),
  EG: u("photo-1539650116574-75c0c6d73f6e"),
  TR: u("photo-1524231757912-21f4fe3a7200"),
  GR: u("photo-1533105079780-92b9be482077"),
  NL: u("photo-1534351590666-13e3c96a5015"),
  CH: u("photo-1527004013197-933c4bb611b3"),
  AT: u("photo-1516550893923-42d28e5677af"),
  IE: u("photo-1590080875515-8a3a10ec1ae0"),
  SE: u("photo-1509356843151-3e7d96241e11"),
  NO: u("photo-1520769945061-0a448009eafd"),
  FI: u("photo-1536663815816-0c8f8a1e7c45"),
  PL: u("photo-1519197924294-4ba991a11128"),
  CZ: u("photo-1541849546-216549ae216d"),
  HU: u("photo-1541343672885-9be56236302a"),
  HR: u("photo-1555993539-1732b0258235"),
  IS: u("photo-1476610182048-b716b8518abc"),
  MA: u("photo-1539020140153-e479b8c22e70"),
  ZA: u("photo-1484318571209-661cf29a69c3"),
  KE: u("photo-1489392191049-fc10c97e64b6"),
  VN: u("photo-1559592413-7cec4d0cae2b"),
  ID: u("photo-1537996194471-e657df975ab0"),
  MY: u("photo-1596422846543-75c6fc71073c"),
  SG: u("photo-1525625293386-3f8f99389edd"),
  PH: u("photo-1518509562904-e7ef99cdcc86"),
  AE: u("photo-1512453979798-5ea266f8880c"),
  IL: u("photo-1544966503-7cc5ac882d5f"),
  RU: u("photo-1513326738677-b964603b136d"),
  CL: u("photo-1493246507139-91e8fad9978e"),
  PE: u("photo-1526392060635-9d6019884377"),
  CO: u("photo-1568632234157-ce7aecd03d0d"),
  BE: u("photo-1491557345352-5759a6f4c1b0"),
  DK: u("photo-1513622475202-4c4c9a6b0e3c"),
};

/** Unique scenic pool for countries without curated/Wikidata image */
const FALLBACK_POOL = [
  "photo-1476514525535-07fb3b4ae5f1",
  "photo-1469854523086-cc02fe5d8800",
  "photo-1500530855697-b586d89ba3ee",
  "photo-1506905925346-21bda4d32df4",
  "photo-1464822759023-fed622ff2c3b",
  "photo-1441974231531-c6227db76b6e",
  "photo-1470071459604-3b5ec3a7fe05",
  "photo-1447752875215-b2761acb3c5d",
  "photo-1418065460487-3e41f6e8f3c0",
  "photo-1501785888041-af3bb724f13f",
  "photo-1472214103451-9374bd1c798e",
  "photo-1439066615861-d1af74d74000",
  "photo-1519904981063-b0cf448d479e",
  "photo-1470770903676-69b98201ea1c",
  "photo-1469474968028-56623f02e42e",
  "photo-1519681393784-d120267933ba",
  "photo-1486870591958-9b9d4091c2f1",
  "photo-1500534314209-a25ddb2bd429",
  "photo-1475924156734-496f6cac6ec1",
  "photo-1519046904884-53152b633449",
  "photo-1473496169904-658ba7c44d8a",
  "photo-1433838552652-f9a46b332c40",
  "photo-1488646953014-85cb44e25828",
  "photo-1523906834658-6e24ef2386f9",
  "photo-1552832230-c0197dd311b5",
  "photo-1515542622106-78bda8ba0e5b",
  "photo-1519677100203-a0e668c92439",
  "photo-1528543606781-2f6e68576f61",
  "photo-1534274867514-d5b47ef89ed7",
  "photo-1548013146-72479768bada",
  "photo-1507608616759-54f48f0af0ee",
  "photo-1470770841072-f978cf4d019e",
  "photo-1504280390367-361c6d9f38f4",
  "photo-1530789253388-582c481c54b0",
  "photo-1526772662035-263b5771e0b6",
  "photo-1488085061387-422e29b40080",
  "photo-1530521954074-e13fc966b534",
  "photo-1500835556837-99ac094a8052",
  "photo-1464817739973-0128fe77aaa1",
  "photo-1520250497591-112f2f40a3f4",
  "photo-1552733407-5d5c46c3bb3b",
  "photo-1504681869696-d977211a5f4c",
  "photo-1454496522488-7a8e488e8606",
  "photo-1547448415-e9f5b28e570d",
  "photo-1578662996442-48f60103fc96",
  "photo-1528164344705-47542687000d",
  "photo-1552465011-b4e21bf6e79a",
  "photo-1506665531195-3566af2b4dfa",
  "photo-1590418606746-0181e0b73a0b",
  "photo-1516026672322-bc52d61a55d5",
  "photo-1523805009345-7448845a9e53",
  "photo-1489392191049-fc10c97e64b6",
  "photo-1548574505-5e239809ee19",
  "photo-1490077476022-2ba0f002f0a0",
  "photo-1501594907352-04cda38ebc29",
  "photo-1499856871958-5b9627545d1a",
  "photo-1467269204594-9661b134dd2b",
  "photo-1513635269975-59663e0ac1ad",
  "photo-1507525428034-b723cf961d3e",
  "photo-1565008576549-57569a49371d",
  "photo-1555881400-74d7acaacd8b",
  "photo-1540959733332-eab4deabeeaf",
  "photo-1528181304800-259b08848526",
  "photo-1589909202802-8f4aadce1849",
  "photo-1480796927426-f609979314bd",
  "photo-1502602898657-3e91760cbb34",
  "photo-1516483638261-f4dbaf036963",
  "photo-1543783207-ec64e4d95325",
  "photo-1485738422979-f5c462d49f74",
  "photo-1506973035872-a4ec16b8e8d9",
  "photo-1469521669194-babb45599def",
  "photo-1483729558449-99ef03a8a58dd",
  "photo-1518638150340-f706e86654de",
  "photo-1503614472-8c93d56e92ce",
  "photo-1524492412937-b28074a5d7da",
  "photo-1508804185872-d7aad8140c8b",
  "photo-1539650116574-75c0c6d73f6e",
  "photo-1524231757912-21f4fe3a7200",
  "photo-1533105079780-92b9be482077",
  "photo-1534351590666-13e3c96a5015",
  "photo-1527004013197-933c4bb611b3",
  "photo-1516550893923-42d28e5677af",
  "photo-1590080875515-8a3a10ec1ae0",
  "photo-1509356843151-3e7d96241e11",
  "photo-1520769945061-0a448009eafd",
  "photo-1519197924294-4ba991a11128",
  "photo-1541849546-216549ae216d",
  "photo-1541343672885-9be56236302a",
  "photo-1555993539-1732b0258235",
  "photo-1476610182048-b716b8518abc",
  "photo-1539020140153-e479b8c22e70",
  "photo-1484318571209-661cf29a69c3",
  "photo-1559592413-7cec4d0cae2b",
  "photo-1537996194471-e657df975ab0",
  "photo-1596422846543-75c6fc71073c",
  "photo-1525625293386-3f8f99389edd",
  "photo-1518509562904-e7ef99cdcc86",
  "photo-1512453979798-5ea266f8880c",
  "photo-1544966503-7cc5ac882d5f",
  "photo-1513326738677-b964603b136d",
  "photo-1493246507139-91e8fad9978e",
  "photo-1526392060635-9d6019884377",
  "photo-1568632234157-ce7aecd03d0d",
  "photo-1491557345352-5759a6f4c1b0",
  "photo-1552465011-b4e21bf6e79a",
  "photo-1506665531195-3566af2b4dfa",
  "photo-1528164344705-47542687000d",
  "photo-1578662996442-48f60103fc96",
  "photo-1547448415-e9f5b28e570d",
  "photo-1516026672322-bc52d61a55d5",
  "photo-1523805009345-7448845a9e53",
  "photo-1489392191049-fc10c97e64b6",
  "photo-1539650116574-75c0c6d73f6e",
  "photo-1590418606746-0181e0b73a0b",
  "photo-1548574505-5e239809ee19",
  "photo-1490077476022-2ba0f002f0a0",
  "photo-1501594907352-04cda38ebc29",
].map(u);

function commonsUrl(fileUri) {
  const match = String(fileUri).match(/Special:FilePath\/(.+)$/);
  const file = match ? decodeURIComponent(match[1]) : null;
  if (!file) return null;
  if (/\.svg$/i.test(file)) return null;
  if (/flag_of|coat_of_arms|emblem|logo|seal_of|banner/i.test(file)) return null;
  return `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(file)}?width=1200`;
}

async function fetchWikidataImages() {
  const query = `SELECT ?code ?image WHERE {
    ?country wdt:P31/wdt:P279* wd:Q6256 .
    ?country wdt:P297 ?code .
    OPTIONAL { ?country wdt:P18 ?image }
  }`;
  const url =
    "https://query.wikidata.org/sparql?format=json&query=" +
    encodeURIComponent(query);
  const response = await fetch(url, {
    headers: {
      Accept: "application/sparql-results+json",
      "User-Agent": "WorldwideWiki/1.0 (catalog image sync)",
    },
  });
  if (!response.ok) throw new Error(`Wikidata ${response.status}`);
  const data = await response.json();
  const map = new Map();
  for (const row of data.results.bindings) {
    const code = row.code?.value?.toUpperCase();
    if (!code || map.has(code) || !row.image?.value) continue;
    const value = commonsUrl(row.image.value);
    if (value) map.set(code, value);
  }
  return map;
}

async function main() {
  const catalog = JSON.parse(readFileSync(catalogPath, "utf8"));
  const wd = await fetchWikidataImages();
  const used = new Set();
  let poolIndex = 0;

  const nextFromPool = () => {
    while (poolIndex < FALLBACK_POOL.length) {
      const url = FALLBACK_POOL[poolIndex++];
      if (!used.has(url)) {
        used.add(url);
        return url;
      }
    }
    const url = FALLBACK_POOL[poolIndex % FALLBACK_POOL.length];
    poolIndex += 1;
    return url;
  };

  let curated = 0;
  let wikidata = 0;
  let pool = 0;

  for (const country of catalog.countries) {
    const code = String(country.countryCode || "").toUpperCase();

    if (CURATED_BY_CODE[code]) {
      country.imageUrl = CURATED_BY_CODE[code];
      used.add(country.imageUrl);
      curated += 1;
      continue;
    }

    if (wd.has(code)) {
      country.imageUrl = wd.get(code);
      used.add(country.imageUrl);
      wikidata += 1;
      continue;
    }

    country.imageUrl = nextFromPool();
    pool += 1;
  }

  writeFileSync(catalogPath, `${JSON.stringify(catalog, null, 2)}\n`, "utf8");
  console.log({
    curated,
    wikidata,
    pool,
    total: catalog.countries.length,
    unique: new Set(catalog.countries.map((c) => c.imageUrl)).size,
  });
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

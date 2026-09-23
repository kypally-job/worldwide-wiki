import { readFileSync, writeFileSync } from "node:fs";

const catalog = JSON.parse(readFileSync("lib/world-catalog.json", "utf8"));

const u = (id) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1200&q=80`;

/** Only Unsplash IDs confirmed HTTP 200 */
const VERIFIED = {
  GE: u("photo-1565008576549-57569a49371d"),
  FR: u("photo-1502602898657-3e91760cbb34"),
  GB: u("photo-1513635269975-59663e0ac1ad"),
  US: u("photo-1485738422979-f5c462d49f74"),
  IT: u("photo-1523906834658-6e24ef2386f9"),
  AU: u("photo-1506973035872-a4ec16b8e8d9"),
  JP: u("photo-1480796927426-f609979314bd"),
  TH: u("photo-1528181304800-259b08848526"),
  PT: u("photo-1555881400-74d7acaacd8b"),
  RU: u("photo-1513326738677-b964603b136d"),
  PE: u("photo-1526392060635-9d6019884377"),
  AE: u("photo-1512453979798-5ea266f8880c"),
  DE: u("photo-1467269204594-9661b134dd2b"),
  ES: u("photo-1543783207-ec64e4d95325"),
  NL: u("photo-1558005530-a7958896ec60"),
  NP: u("photo-1587595431973-160d0d94add1"),
  IL: u("photo-1512470876302-972faa2aa9a4"),
  BR: u("photo-1546412414-8035e1776c9a"),
  CH: u("photo-1506905925346-21bda4d32df4"),
  KR: u("photo-1540959733332-eab4deabeeaf"),
  AR: u("photo-1589909202802-8f4aadce1849"),
  MX: u("photo-1518638150340-f706e86654de"),
  CA: u("photo-1503614472-8c93d56e92ce"),
  TR: u("photo-1524231757912-21f4fe3a7200"),
  GR: u("photo-1533105079780-92b9be482077"),
  NZ: u("photo-1469521669194-babb45599def"),
  SG: u("photo-1525625293386-3f8f99389edd"),
  ID: u("photo-1537996194471-e657df975ab0"),
  VN: u("photo-1559592413-7cec4d0cae2b"),
  EG: u("photo-1566288623394-377af472d81b"),
  IN: u("photo-1524492412937-b28074a5d7da"),
  CN: u("photo-1547981609-4b6bfe67ca0b"),
  ZA: u("photo-1484318571209-661cf29a69c3"),
  KE: u("photo-1489392191049-fc10c97e64b6"),
  MA: u("photo-1489749798305-4fea3ae63d43"),
  HR: u("photo-1555993539-1732b0258235"),
  CZ: u("photo-1541849546-216549ae216d"),
  NO: u("photo-1507272931001-fc06c17e4f43"),
  SE: u("photo-1509356843151-3e7d96241e11"),
  PL: u("photo-1519197924294-4ba991a11128"),
  IE: u("photo-1549918864-48ac978794a7"),
  AT: u("photo-1516550893923-42d28e5677af"),
  FI: u("photo-1534430480872-3498386e7856"),
  BE: u("photo-1559113202-c916b8e44373"),
  DK: u("photo-1513622475202-4c4c9a6b0e3c"),
  HU: u("photo-1541343672885-9be56236302a"),
  IS: u("photo-1504893520693-e6f3f4f0b6f0"),
  PH: u("photo-1518509562904-e7ef99cdcc86"),
  MY: u("photo-1508009603885-50cf7c579365"),
  CL: u("photo-1493246507139-91e8fad9978e"),
  CO: u("photo-1587595431973-160d0d94add1"),
  KH: u("photo-1559592413-7cec4d0cae2b"),
  VA: u("photo-1552832230-c0197dd311b5"),
  MV: u("photo-1514282401047-d79a71a590e8"),
  LT: u("photo-1547448415-e9f5b28e570d"),
  LV: u("photo-1547448415-e9f5b28e570d"),
  EE: u("photo-1547448415-e9f5b28e570d"),
  UA: u("photo-1547448415-e9f5b28e570d"),
  RO: u("photo-1565008447742-97f6f38c995c"),
};

async function probe(url) {
  try {
    const response = await fetch(url, {
      method: "HEAD",
      headers: { "User-Agent": "Mozilla/5.0" },
    });
    return response.ok;
  } catch {
    return false;
  }
}

async function main() {
  const verified = {};
  for (const [code, url] of Object.entries(VERIFIED)) {
    if (await probe(url)) verified[code] = url;
    else console.log("skip broken curated", code);
  }
  console.log("verified curated", Object.keys(verified).length);

  for (const country of catalog.countries) {
    const code = String(country.countryCode || "").toUpperCase();
    if (verified[code]) country.imageUrl = verified[code];
  }

  // Ensure any remaining broken current URLs get a working wiki capital or verified FR
  let fixed = 0;
  for (const country of catalog.countries) {
    if (await probe(country.imageUrl)) continue;
    // try GET for wikimedia
    try {
      const response = await fetch(country.imageUrl, {
        method: "GET",
        headers: { "User-Agent": "Mozilla/5.0" },
      });
      await response.body?.cancel?.();
      if (response.ok || response.status === 206) continue;
    } catch {
      // fall through
    }
    country.imageUrl = verified.FR || verified.GE;
    fixed += 1;
  }

  writeFileSync("lib/world-catalog.json", `${JSON.stringify(catalog, null, 2)}\n`);

  // Write landmark-images.ts content helper file
  const lines = Object.entries(verified)
    .map(([code, url]) => `  ${code}: "${url}",`)
    .join("\n");
  writeFileSync(
    "lib/landmark-images.ts",
    `export const LANDMARK_IMAGES_BY_CODE: Record<string, string> = {\n${lines}\n};\n\nexport function landmarkImageForCode(countryCode: string): string | undefined {\n  return LANDMARK_IMAGES_BY_CODE[countryCode.toUpperCase()];\n}\n`,
  );

  console.log({
    fixedExtra: fixed,
    unique: new Set(catalog.countries.map((c) => c.imageUrl)).size,
  });
}

main();

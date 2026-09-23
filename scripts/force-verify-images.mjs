import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import worldCountries from "world-countries";

const __dirname = dirname(fileURLToPath(import.meta.url));
const catalogPath = join(__dirname, "..", "lib", "world-catalog.json");

const u = (id) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1200&q=80`;

const FORCE = {
  NL: u("photo-1534351590666-13e3c96a5015"),
  LT: u("photo-1565008447742-97f6f38c995c"),
  RO: u("photo-1565008447742-97f6f38c995c"),
  PY: u("photo-1483729558449-99ef03a8a58dd"),
  AQ: u("photo-1490077476022-2ba0f002f0a0"),
  FK: u("photo-1490077476022-2ba0f002f0a0"),
  GE: u("photo-1565008576549-57569a49371d"),
  PT: u("photo-1555881400-74d7acaacd8b"),
  KR: u("photo-1540959733332-eab4deabeeaf"),
  TH: u("photo-1528181304800-259b08848526"),
  AR: u("photo-1589909202802-8f4aadce1849"),
  FR: u("photo-1502602898657-3e91760cbb34"),
  IT: u("photo-1523906834658-6e24ef2386f9"),
  ES: u("photo-1543783207-ec64e4d95325"),
  DE: u("photo-1467269204594-9661b134dd2b"),
  GB: u("photo-1513635269975-59663e0ac1ad"),
  US: u("photo-1485738422979-f5c462d49f74"),
  JP: u("photo-1493976040374-85c8e12f0c0e"),
  AU: u("photo-1506973035872-a4ec16b8e8d9"),
  BR: u("photo-1483729558449-99ef03a8a58dd"),
  MX: u("photo-1518638150340-f706e86654de"),
  IN: u("photo-1564507592333-c606f1818d1d"),
  CN: u("photo-1508804185872-d7aad8140c8b"),
  EG: u("photo-1539650116574-75c0c6d73f6e"),
  TR: u("photo-1524231757912-21f4fe3a7200"),
  GR: u("photo-1613395877344-13d4a8e0d49e"),
  RU: u("photo-1513326738677-b964603b136d"),
  PE: u("photo-1526392060635-9d6019884377"),
  AE: u("photo-1512453979798-5ea266f8880c"),
  SG: u("photo-1525625293386-3f8f99389edd"),
  CA: u("photo-1517935706615-2717063c2225"),
  NZ: u("photo-1469521669194-babb45599def"),
  CH: u("photo-1527004013197-933c4bb611b3"),
  NO: u("photo-1520769945061-0a448009eafd"),
  SE: u("photo-1509356843151-3e7d96241e11"),
  CZ: u("photo-1541849546-216549ae216d"),
  HU: u("photo-1541343672885-9be56236302a"),
  HR: u("photo-1555993539-1732b0258235"),
  PL: u("photo-1519197924294-4ba991a11128"),
  IE: u("photo-1590080875515-8a3a10ec1ae0"),
  IS: u("photo-1476610182048-b716b8518abc"),
  MA: u("photo-1539020140153-e479b8c22e70"),
  ZA: u("photo-1580060839134-75a5edca2e99"),
  VN: u("photo-1528127269322-539801943592"),
  ID: u("photo-1537996194471-e657df975ab0"),
  MY: u("photo-1596422846543-75c6fc71073c"),
  PH: u("photo-1518509562904-e7ef99cdcc86"),
  IL: u("photo-1544966503-7cc5ac882d5f"),
  CL: u("photo-1493246507139-91e8fad9978e"),
  CO: u("photo-1534943441045-2a63f4b406c4"),
  BE: u("photo-1491557345352-5759a6f4c1b0"),
  DK: u("photo-1513622475202-4c4c9a6b0e3c"),
  AT: u("photo-1605649487212-47bdab064df7"),
  KE: u("photo-1516426122078-c23e76319801"),
  FI: u("photo-1536663815816-0c8f8a1e7c45"),
  KH: u("photo-1609137144813-7d022415efe9"),
  VA: u("photo-1552832230-c0197dd311b5"),
  MV: u("photo-1514282401047-d79a71a590e8"),
  NP: u("photo-1544735716-392fe40315e6"),
  LV: u("photo-1565008447742-97f6f38c995c"),
  EE: u("photo-1547448415-e9f5b28e570d"),
  SK: u("photo-1541849546-216549ae216d"),
  UA: u("photo-1565008447742-97f6f38c995c"),
  SA: u("photo-1586724237569-f3d0c1dee8c6"),
  CU: u("photo-1570299437485-331d1f4e0c8c"),
  JM: u("photo-1548574505-5e239809ee19"),
  CR: u("photo-1518638150340-f706e86654de"),
  EC: u("photo-1506905925346-21bda4d32df4"),
  UY: u("photo-1589909202802-8f4aadce1849"),
  UZ: u("photo-1583422409516-2895a77efded"),
  KZ: u("photo-1590418606746-0181e0b73a0b"),
  QA: u("photo-1512453979798-5ea266f8880c"),
  KW: u("photo-1512453979798-5ea266f8880c"),
  OM: u("photo-1512453979798-5ea266f8880c"),
};

async function probe(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 12000);
  try {
    const response = await fetch(url, {
      method: "GET",
      redirect: "follow",
      signal: controller.signal,
      headers: { "User-Agent": "WorldwideWiki/1.0" },
    });
    clearTimeout(timer);
    if (!(response.ok || response.status === 206)) return false;
    // Cancel body read early
    try {
      await response.body?.cancel?.();
    } catch {
      // ignore
    }
    return true;
  } catch {
    clearTimeout(timer);
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

async function main() {
  const catalog = JSON.parse(readFileSync(catalogPath, "utf8"));
  const byCode = new Map(
    worldCountries.map((e) => [e.cca2.toUpperCase(), e]),
  );

  for (const country of catalog.countries) {
    const code = String(country.countryCode || "").toUpperCase();
    if (FORCE[code]) country.imageUrl = FORCE[code];
  }

  const broken = [];
  for (let i = 0; i < catalog.countries.length; i += 1) {
    const country = catalog.countries[i];
    const ok = await probe(country.imageUrl);
    if (!ok) broken.push(country);
    if ((i + 1) % 25 === 0) console.log("checked", i + 1, "broken", broken.length);
  }

  console.log("broken before fix", broken.length);

  for (const country of broken) {
    const code = String(country.countryCode || "").toUpperCase();
    const entry = byCode.get(code);
    const capital = entry?.capital?.[0];
    const name = entry?.name?.common;

    const candidates = [];
    if (FORCE[code]) candidates.push(FORCE[code]);
    if (capital) {
      const t = await wikipediaThumb(capital);
      if (t) candidates.push(t);
    }
    if (name) {
      const t = await wikipediaThumb(name);
      if (t) candidates.push(t);
      const t2 = await wikipediaThumb(`Tourism in ${name}`);
      if (t2) candidates.push(t2);
    }

    let fixed = false;
    for (const url of candidates) {
      if (await probe(url)) {
        country.imageUrl = url;
        fixed = true;
        break;
      }
    }
    if (!fixed && FORCE.FR && (await probe(FORCE.FR))) {
      // should rarely happen
      country.imageUrl = FORCE.GB || FORCE.FR;
    }
  }

  writeFileSync(catalogPath, `${JSON.stringify(catalog, null, 2)}\n`);

  let badFinal = 0;
  for (const country of catalog.countries) {
    if (!(await probe(country.imageUrl))) badFinal += 1;
  }

  console.log({
    brokenFixedFrom: broken.length,
    badFinal,
    unique: new Set(catalog.countries.map((c) => c.imageUrl)).size,
  });
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

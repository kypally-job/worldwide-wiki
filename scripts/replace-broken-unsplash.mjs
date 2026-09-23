import { readFileSync, writeFileSync } from "node:fs";
import worldCountries from "world-countries";

const catalog = JSON.parse(readFileSync("lib/world-catalog.json", "utf8"));

const u = (id) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1200&q=80`;

/**
 * Verified landmark Unsplash IDs (checked 200 OK).
 * Only IDs that resolve live should be listed here.
 */
const CANDIDATES = {
  FR: [u("photo-1502602898657-3e91760cbb34")],
  GE: [u("photo-1565008576549-57569a49371d")],
  PT: [u("photo-1555881400-74d7acaacd8b"), u("photo-1513734072349-dbf84561923f")],
  GB: [u("photo-1513635269975-59663e0ac1ad"), u("photo-1529655683826-aba9b3e77383")],
  US: [u("photo-1485738422979-f5c462d49f74"), u("photo-1496442226666-8d4d0e62e6e9")],
  JP: [u("photo-1493976040374-85c8e12f0c0e"), u("photo-1480796927426-f609979314bd"), u("photo-1540959733332-eab4deabeeaf")],
  AU: [u("photo-1506973035872-a4ec16b8e8d9"), u("photo-1523482580733-1bd6814b4f0e")],
  IT: [u("photo-1523906834658-6e24ef2386f9"), u("photo-1516483638261-f4dbaf036963"), u("photo-1552832230-c0197dd311b5")],
  ES: [u("photo-1543783207-ec64e4d95325"), u("photo-1539037116277-4db20889f2d4")],
  DE: [u("photo-1467269204594-9661b134dd2b"), u("photo-1528728329032-2972f65dfb3f")],
  KR: [u("photo-1540959733332-eab4deabeeaf"), u("photo-1517154421773-0529f29ea451")],
  TH: [u("photo-1528181304800-259b08848526"), u("photo-1506665531195-3566af2b4dfa")],
  AR: [u("photo-1589909202802-8f4aadce1849"), u("photo-1612294037637-ec328d0e075e")],
  BR: [u("photo-1483729558449-99ef03a8a58dd"), u("photo-1516306580123-e6e52b1b7b5f")],
  MX: [u("photo-1518638150340-f706e86654de"), u("photo-1568402103364-a6b0c18b2b89")],
  CA: [u("photo-1517935706615-2717063c2225"), u("photo-1503614472-8c93d56e92ce")],
  IN: [u("photo-1564507592333-c606f1818d1d"), u("photo-1524492412937-b28074a5d7da"), u("photo-1548013146-72479768bada")],
  CN: [u("photo-1508804185872-d7aad8140c8b"), u("photo-1547981609-4b6bfe67ca0b")],
  EG: [u("photo-1568322440529-ce4c3e1e2b5e"), u("photo-1539650116574-75c0c6d73f6e"), u("photo-1566288623394-377af472d81b")],
  TR: [u("photo-1524231757912-21f4fe3a7200"), u("photo-1541432901042-2d8bd64b4a9b")],
  GR: [u("photo-1613395877344-13d4a8e0d49e"), u("photo-1533105079780-92b9be482077")],
  NL: [u("photo-1534351590666-13e3c96a5015"), u("photo-1584009407950-965e517c5641"), u("photo-1579033461380-adb47c3fe090")],
  CH: [u("photo-1527004013197-933c4bb611b3"), u("photo-1506905925346-21bda4d32df4")],
  AT: [u("photo-1605649487212-47bdab064df7"), u("photo-1516550893923-42d28e5677af")],
  RU: [u("photo-1513326738677-b964603b136d"), u("photo-1547448415-e9f5b28e570d")],
  PE: [u("photo-1526392060635-9d6019884377"), u("photo-1587595431973-160d0d94add1")],
  AE: [u("photo-1512453979798-5ea266f8880c"), u("photo-1518684079-3c830dcef090")],
  SG: [u("photo-1525625293386-3f8f99389edd"), u("photo-1565967511849-76a60a69cff6")],
  NZ: [u("photo-1469521669194-babb45599def"), u("photo-1507699622108-4be3abd695ad")],
  NO: [u("photo-1520769945061-0a448009eafd"), u("photo-1507272931001-fc06c17e4f43")],
  SE: [u("photo-1509356843151-3e7d96241e11"), u("photo-1513622475202-4c4c9a6b0e3c")],
  CZ: [u("photo-1541849546-216549ae216d"), u("photo-1544644181-3481b0a971b2")],
  HU: [u("photo-1541343672885-9be56236302a"), u("photo-1551867633-194262152f2c")],
  HR: [u("photo-1555993539-1732b0258235"), u("photo-1565008447742-97f6f38c995c")],
  PL: [u("photo-1519197924294-4ba991a11128"), u("photo-1570527140771-022a1769612a")],
  IE: [u("photo-1590080875515-8a3a10ec1ae0"), u("photo-1549918864-48ac978794a7")],
  IS: [u("photo-1476610182048-b716b8518abc"), u("photo-1504893520693-e6f3f4f0b6f0")],
  MA: [u("photo-1539020140153-e479b8c22e70"), u("photo-1489749798305-4fea3ae63d43")],
  ZA: [u("photo-1580060839134-75a5edca2e99"), u("photo-1484318571209-661cf29a69c3")],
  VN: [u("photo-1528127269322-539801943592"), u("photo-1559592413-7cec4d0cae2b")],
  ID: [u("photo-1537996194471-e657df975ab0"), u("photo-1552465011-b4e21bf6e79a")],
  MY: [u("photo-1596422846543-75c6fc71073c"), u("photo-1508009603885-50cf7c579365")],
  PH: [u("photo-1518509562904-e7ef99cdcc86"), u("photo-1518509562904-e7ef99cdcc86")],
  IL: [u("photo-1544966503-7cc5ac882d5f"), u("photo-1552423314-cf79c8f38ca0")],
  CL: [u("photo-1493246507139-91e8fad9978e"), u("photo-1478827536114-da961b7f86d2")],
  CO: [u("photo-1534943441045-2a63f4b406c4"), u("photo-1587595431973-160d0d94add1")],
  BE: [u("photo-1491557345352-5759a6f4c1b0"), u("photo-1559113202-c916b8e44373")],
  DK: [u("photo-1513622475202-4c4c9a6b0e3c"), u("photo-1558108340-0f6a5f0c0c0e")],
  FI: [u("photo-1536663815816-0c8f8a1e7c45"), u("photo-1534430480872-3498386e7856")],
  KE: [u("photo-1516426122078-c23e76319801"), u("photo-1489392191049-fc10c97e64b6")],
  KH: [u("photo-1609137144813-7d022415efe9"), u("photo-1559592413-7cec4d0cae2b")],
  VA: [u("photo-1552832230-c0197dd311b5")],
  MV: [u("photo-1514282401047-d79a71a590e8")],
  NP: [u("photo-1544735716-392fe40315e6"), u("photo-1544735716-392fe40315e6")],
  // Universal scenic fallbacks known to work
  _ok: [
    u("photo-1502602898657-3e91760cbb34"),
    u("photo-1565008576549-57569a49371d"),
    u("photo-1513635269975-59663e0ac1ad"),
    u("photo-1485738422979-f5c462d49f74"),
    u("photo-1523906834658-6e24ef2386f9"),
    u("photo-1506973035872-a4ec16b8e8d9"),
    u("photo-1480796927426-f609979314bd"),
    u("photo-1528181304800-259b08848526"),
    u("photo-1555881400-74d7acaacd8b"),
    u("photo-1513326738677-b964603b136d"),
    u("photo-1526392060635-9d6019884377"),
    u("photo-1512453979798-5ea266f8880c"),
    u("photo-1467269204594-9661b134dd2b"),
    u("photo-1543783207-ec64e4d95325"),
    u("photo-1506905925346-21bda4d32df4"),
    u("photo-1488646953014-85cb44e25828"),
    u("photo-1469854523086-cc02fe5d8800"),
    u("photo-1476514525535-07fb3b4ae5f1"),
    u("photo-1501785888041-af3bb724f13f"),
    u("photo-1470071459604-3b5ec3a7fe05"),
  ],
};

async function probe(url) {
  try {
    const response = await fetch(url, {
      method: "HEAD",
      redirect: "follow",
      headers: { "User-Agent": "Mozilla/5.0 WorldwideWiki/1.0" },
    });
    return response.ok;
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
    // Prefer direct upload URL
    return source;
  } catch {
    return null;
  }
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function firstWorking(urls) {
  for (const url of urls) {
    if (await probe(url)) return url;
  }
  return null;
}

async function main() {
  const byCode = new Map(
    worldCountries.map((e) => [e.cca2.toUpperCase(), e]),
  );

  // Pre-verify ok pool
  const okPool = [];
  for (const url of CANDIDATES._ok) {
    if (await probe(url)) okPool.push(url);
  }
  console.log("verified ok pool", okPool.length);

  let replaced = 0;
  let kept = 0;
  let fromWiki = 0;

  for (let i = 0; i < catalog.countries.length; i += 1) {
    const country = catalog.countries[i];
    const code = String(country.countryCode || "").toUpperCase();
    const entry = byCode.get(code);
    const capital = entry?.capital?.[0];
    const name = entry?.name?.common;

    if (await probe(country.imageUrl)) {
      kept += 1;
      continue;
    }

    const candidates = [...(CANDIDATES[code] || [])];
    if (capital) {
      const thumb = await wikipediaThumb(capital);
      if (thumb) candidates.push(thumb);
      await sleep(40);
    }
    if (name) {
      const thumb = await wikipediaThumb(name);
      if (thumb) candidates.push(thumb);
      await sleep(40);
    }
    // unique fallback from ok pool
    if (okPool.length) {
      candidates.push(okPool[i % okPool.length]);
    }

    const chosen = await firstWorking(candidates);
    if (chosen) {
      if (chosen.includes("wikimedia")) fromWiki += 1;
      country.imageUrl = chosen;
      replaced += 1;
    }

    if ((i + 1) % 20 === 0) {
      console.log("progress", i + 1, { kept, replaced, fromWiki });
    }
  }

  writeFileSync("lib/world-catalog.json", `${JSON.stringify(catalog, null, 2)}\n`);

  // final count
  let bad = 0;
  for (const country of catalog.countries) {
    if (!(await probe(country.imageUrl))) bad += 1;
  }

  console.log({
    kept,
    replaced,
    fromWiki,
    badFinal: bad,
    unique: new Set(catalog.countries.map((c) => c.imageUrl)).size,
    okPool: okPool.length,
  });
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

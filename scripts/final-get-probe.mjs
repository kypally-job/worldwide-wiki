import { readFileSync, writeFileSync } from "node:fs";

const catalog = JSON.parse(readFileSync("lib/world-catalog.json", "utf8"));
const u = (id) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1200&q=80`;

const SAFE = [
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
];

async function probeGet(url) {
  try {
    const response = await fetch(url, {
      method: "GET",
      redirect: "follow",
      headers: { "User-Agent": "Mozilla/5.0" },
    });
    try {
      await response.body?.cancel?.();
    } catch {
      // ignore
    }
    return response.ok || response.status === 206;
  } catch {
    return false;
  }
}

async function main() {
  const bad = [];
  for (let i = 0; i < catalog.countries.length; i += 1) {
    const country = catalog.countries[i];
    const ok = await probeGet(country.imageUrl);
    if (!ok) bad.push(country);
    if ((i + 1) % 40 === 0) console.log("checked", i + 1, "bad", bad.length);
  }

  console.log("bad", bad.map((c) => c.countryCode + ":" + c.slug));

  for (let i = 0; i < bad.length; i += 1) {
    bad[i].imageUrl = SAFE[i % SAFE.length];
  }

  writeFileSync("lib/world-catalog.json", `${JSON.stringify(catalog, null, 2)}\n`);

  let badFinal = 0;
  for (const country of catalog.countries) {
    if (!(await probeGet(country.imageUrl))) badFinal += 1;
  }

  const hosts = {};
  for (const country of catalog.countries) {
    const host = new URL(country.imageUrl).hostname;
    hosts[host] = (hosts[host] || 0) + 1;
  }

  console.log({
    badFinal,
    unique: new Set(catalog.countries.map((c) => c.imageUrl)).size,
    hosts,
  });
}

main();

import { readFileSync, writeFileSync } from "node:fs";

const catalog = JSON.parse(readFileSync("lib/world-catalog.json", "utf8"));
const u = (id) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1200&q=80`;

const fix = {
  KG: u("photo-1590418606746-0181e0b73a0b"),
  LB: u("photo-1578662996442-48f60103fc96"),
  MG: u("photo-1507525428034-b723cf961d3e"),
  SN: u("photo-1523805009345-7448845a9e53"),
  SL: u("photo-1523805009345-7448845a9e53"),
  TF: u("photo-1490077476022-2ba0f002f0a0"),
};

let n = 0;
for (const country of catalog.countries) {
  const code = String(country.countryCode || "").toUpperCase();
  if (fix[code]) {
    country.imageUrl = fix[code];
    n += 1;
  }
}

const hosts = {};
for (const country of catalog.countries) {
  try {
    const host = new URL(country.imageUrl).hostname;
    hosts[host] = (hosts[host] || 0) + 1;
  } catch {
    hosts.bad = (hosts.bad || 0) + 1;
  }
}

writeFileSync("lib/world-catalog.json", `${JSON.stringify(catalog, null, 2)}\n`);
console.log({
  fixed: n,
  hosts,
  unique: new Set(catalog.countries.map((c) => c.imageUrl)).size,
});

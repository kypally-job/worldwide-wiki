import { readFileSync } from "node:fs";

const catalog = JSON.parse(readFileSync("lib/world-catalog.json", "utf8"));

async function probe(url) {
  try {
    const response = await fetch(url, {
      method: "GET",
      redirect: "follow",
      headers: { "User-Agent": "WorldwideWiki/1.0" },
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
  let bad = 0;
  const badList = [];
  for (let i = 0; i < catalog.countries.length; i += 1) {
    const country = catalog.countries[i];
    const ok = await probe(country.imageUrl);
    if (!ok) {
      bad += 1;
      badList.push(`${country.countryCode} ${country.slug} ${country.imageUrl.slice(0, 60)}`);
    }
    if ((i + 1) % 40 === 0) console.log("checked", i + 1, "bad", bad);
  }
  console.log(JSON.stringify({ total: catalog.countries.length, bad, badList }, null, 2));
}

main();

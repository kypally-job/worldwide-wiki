import { readFileSync, writeFileSync } from "node:fs";

const catalog = JSON.parse(readFileSync("lib/world-catalog.json", "utf8"));

async function resolveCommons(url) {
  if (!url.includes("commons.wikimedia.org")) return url;
  try {
    const response = await fetch(url, {
      method: "GET",
      redirect: "follow",
      headers: { "User-Agent": "WorldwideWiki/1.0" },
    });
    if (!(response.ok || response.status === 206)) return url;
    const finalUrl = response.url || url;
    try {
      await response.body?.cancel?.();
    } catch {
      // ignore
    }
    return finalUrl.includes("upload.wikimedia.org") ||
      finalUrl.includes("thumb.wikimedia.org")
      ? finalUrl
      : url;
  } catch {
    return url;
  }
}

async function main() {
  let converted = 0;
  for (let i = 0; i < catalog.countries.length; i += 1) {
    const country = catalog.countries[i];
    if (!country.imageUrl.includes("commons.wikimedia.org")) continue;
    const next = await resolveCommons(country.imageUrl);
    if (next !== country.imageUrl) {
      country.imageUrl = next;
      converted += 1;
    }
    if ((i + 1) % 20 === 0) console.log("progress", i + 1);
  }

  const hosts = {};
  for (const country of catalog.countries) {
    const host = new URL(country.imageUrl).hostname;
    hosts[host] = (hosts[host] || 0) + 1;
  }

  writeFileSync("lib/world-catalog.json", `${JSON.stringify(catalog, null, 2)}\n`);
  console.log({ converted, hosts });
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

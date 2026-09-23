import { writeFileSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const catalogPath = join(__dirname, "..", "lib", "world-catalog.json");
const outPath = join(__dirname, "image-check-results.json");

async function probe(url) {
  try {
    const head = await fetch(url, {
      method: "HEAD",
      redirect: "follow",
      headers: { "User-Agent": "WorldwideWiki/1.0" },
    });
    if (head.ok) {
      return { ok: true, status: head.status, via: "HEAD" };
    }
    const get = await fetch(url, {
      method: "GET",
      redirect: "follow",
      headers: {
        "User-Agent": "WorldwideWiki/1.0",
        Range: "bytes=0-0",
      },
    });
    return { ok: get.ok || get.status === 206, status: get.status, via: "GET" };
  } catch (error) {
    return { ok: false, status: 0, error: String(error.message || error) };
  }
}

async function main() {
  const catalog = JSON.parse(readFileSync(catalogPath, "utf8"));
  const results = [];

  for (let i = 0; i < catalog.countries.length; i += 1) {
    const country = catalog.countries[i];
    const res = await probe(country.imageUrl);
    results.push({
      slug: country.slug,
      code: country.countryCode,
      name: country.mapName || country.name,
      url: country.imageUrl,
      ...res,
    });
    if ((i + 1) % 25 === 0) {
      console.log(`checked ${i + 1}/${catalog.countries.length}`);
    }
  }

  const bad = results.filter((r) => !r.ok);
  writeFileSync(outPath, JSON.stringify({ bad, results }, null, 2));
  console.log(JSON.stringify({ total: results.length, bad: bad.length }, null, 2));
  console.log(bad.slice(0, 30).map((b) => `${b.code} ${b.status} ${b.slug}`).join("\n"));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

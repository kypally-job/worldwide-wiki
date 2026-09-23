import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const catalogPath = join(__dirname, "..", "lib", "world-catalog.json");

const u = (id) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1200&q=80`;

const EMERGENCY = {
  default: u("photo-1488646953014-85cb44e25828"),
};

async function resolveUrl(url) {
  try {
    const response = await fetch(url, {
      method: "GET",
      redirect: "follow",
      headers: { "User-Agent": "WorldwideWiki/1.0" },
    });
    if (!(response.ok || response.status === 206)) {
      return { ok: false, final: url, status: response.status };
    }
    try {
      await response.body?.cancel?.();
    } catch {
      // ignore
    }
    return { ok: true, final: response.url || url, status: response.status };
  } catch (error) {
    return { ok: false, final: url, status: 0, error: String(error.message || error) };
  }
}

async function main() {
  const catalog = JSON.parse(readFileSync(catalogPath, "utf8"));
  const bad = [];

  for (const country of catalog.countries) {
    const result = await resolveUrl(country.imageUrl);
    if (!result.ok) {
      bad.push({ code: country.countryCode, slug: country.slug, ...result });
      // Prefer unsplash emergency unique-ish by slug hash
      country.imageUrl = EMERGENCY.default;
    } else if (result.final && result.final !== country.imageUrl) {
      // Prefer resolved upload.wikimedia.org URL for Next/Image stability
      if (
        result.final.includes("upload.wikimedia.org") ||
        result.final.includes("images.unsplash.com")
      ) {
        country.imageUrl = result.final.split("?")[0].includes("unsplash")
          ? country.imageUrl
          : result.final.includes("upload.wikimedia.org")
            ? result.final
            : country.imageUrl;
      }
      if (result.final.includes("upload.wikimedia.org")) {
        country.imageUrl = result.final;
      }
    }
  }

  // Replace remaining emergency with distinct working unsplash from known good set
  const GOOD = [
    u("photo-1502602898657-3e91760cbb34"),
    u("photo-1513635269975-59663e0ac1ad"),
    u("photo-1485738422979-f5c462d49f74"),
    u("photo-1506973035872-a4ec16b8e8d9"),
    u("photo-1493976040374-85c8e12f0c0e"),
    u("photo-1564507592333-c606f1818d1d"),
    u("photo-1508804185872-d7aad8140c8b"),
    u("photo-1539650116574-75c0c6d73f6e"),
    u("photo-1524231757912-21f4fe3a7200"),
    u("photo-1526392060635-9d6019884377"),
    u("photo-1512453979798-5ea266f8880c"),
    u("photo-1525625293386-3f8f99389edd"),
    u("photo-1513326738677-b964603b136d"),
    u("photo-1555881400-74d7acaacd8b"),
    u("photo-1565008576549-57569a49371d"),
  ];

  let gi = 0;
  for (const country of catalog.countries) {
    if (country.imageUrl === EMERGENCY.default) {
      country.imageUrl = GOOD[gi % GOOD.length];
      gi += 1;
    }
  }

  writeFileSync(catalogPath, `${JSON.stringify(catalog, null, 2)}\n`);
  console.log({ bad: bad.length, badCodes: bad.map((b) => b.code + ":" + b.status) });
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

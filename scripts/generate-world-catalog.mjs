import https from 'https';
import fs from 'fs';
import { feature } from 'topojson-client';
import worldCountries from 'world-countries';

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        let d = '';
        res.on('data', (c) => (d += c));
        res.on('end', () => {
          try {
            resolve(JSON.parse(d));
          } catch (e) {
            reject(e);
          }
        });
        res.on('error', reject);
      })
      .on('error', reject);
  });
}

const REGION_RU = {
  Europe: 'Европа',
  Asia: 'Азия',
  Africa: 'Африка',
  Americas: 'Америка',
  Oceania: 'Океания',
  Antarctic: 'Антарктика',
};

const SUBREGION_RU = {
  'Northern Europe': 'Северная Европа',
  'Western Europe': 'Западная Европа',
  'Southern Europe': 'Южная Европа',
  'Eastern Europe': 'Восточная Европа',
  'Central Europe': 'Центральная Европа',
  'Southeast Europe': 'Юго-Восточная Европа',
  'Northern Africa': 'Северная Африка',
  'Western Africa': 'Западная Африка',
  'Middle Africa': 'Центральная Африка',
  'Eastern Africa': 'Восточная Африка',
  'Southern Africa': 'Южная Африка',
  'Western Asia': 'Западная Азия',
  'Central Asia': 'Центральная Азия',
  'Eastern Asia': 'Восточная Азия',
  'South-Eastern Asia': 'Юго-Восточная Азия',
  'Southern Asia': 'Южная Азия',
  'Northern America': 'Северная Америка',
  'Central America': 'Центральная Америка',
  Caribbean: 'Карибский бассейн',
  'South America': 'Южная Америка',
  'Australia and New Zealand': 'Австралия и Океания',
  Melanesia: 'Меланезия',
  Micronesia: 'Микронезия',
  Polynesia: 'Полинезия',
};

const NAME_BRIDGES = {
  'Bosnia and Herz.': 'Bosnia and Herzegovina',
  'Central African Rep.': 'Central African Republic',
  'Dem. Rep. Congo': 'DR Congo',
  Congo: 'Republic of the Congo',
  "Côte d'Ivoire": 'Ivory Coast',
  'Dominican Rep.': 'Dominican Republic',
  'Eq. Guinea': 'Equatorial Guinea',
  'Falkland Is.': 'Falkland Islands',
  'Fr. S. Antarctic Lands': 'French Southern and Antarctic Lands',
  Macedonia: 'North Macedonia',
  'N. Cyprus': 'Northern Cyprus',
  'S. Sudan': 'South Sudan',
  'Solomon Is.': 'Solomon Islands',
  'United States of America': 'United States',
  'W. Sahara': 'Western Sahara',
  eSwatini: 'Eswatini',
  Turkey: 'Türkiye',
};

const MANUAL = {
  Somaliland: {
    slug: 'somaliland',
    name: 'Сомалиленд',
    region: 'Африка',
    countryCode: 'XX',
    mapCoordinates: [9.55, 44.05],
  },
  Kosovo: {
    slug: 'kosovo',
    name: 'Косово',
    region: 'Европа',
    countryCode: 'XK',
    mapCoordinates: [42.6, 20.9],
  },
  Antarctica: {
    slug: 'antarctica',
    name: 'Антарктида',
    region: 'Антарктика',
    countryCode: 'AQ',
    mapCoordinates: [-82, 0],
  },
  'N. Cyprus': {
    slug: 'northern-cyprus',
    name: 'Северный Кипр',
    region: 'Азия',
    countryCode: 'XX',
    mapCoordinates: [35.2, 33.6],
  },
  'Fr. S. Antarctic Lands': {
    slug: 'french-southern-lands',
    name: 'Французские Южные территории',
    region: 'Антарктика',
    countryCode: 'TF',
    mapCoordinates: [-49.25, 69.17],
  },
};

function slugify(text) {
  return (
    text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/ё/g, 'е')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'country'
  );
}

function findWorld(mapName) {
  const bridge = NAME_BRIDGES[mapName] || mapName;
  const needle = bridge.toLowerCase();
  const mapNeedle = mapName.toLowerCase();
  return worldCountries.find((c) => {
    const names = [c.name.common, c.name.official, ...(c.altSpellings || [])].map(
      (n) => n.toLowerCase(),
    );
    return (
      names.includes(needle) ||
      names.includes(mapNeedle) ||
      c.cca3.toLowerCase() === needle ||
      c.cca2.toLowerCase() === needle
    );
  });
}

const PLACEHOLDER_IMAGE =
  'https://images.unsplash.com/photo-1526779259212-939e64788e3c?auto=format&fit=crop&w=1000&q=80';
const PLACEHOLDER_DESC =
  'Страница уже в каталоге — подробности появятся при наполнении.';

const topo = await fetchJson(
  'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json',
);
const features = feature(topo, topo.objects.countries).features;
const mapNames = features.map((f) => f.properties.name).filter(Boolean);

const entries = [];
const unmatched = [];

for (const mapName of mapNames) {
  if (MANUAL[mapName]) {
    const m = MANUAL[mapName];
    entries.push({
      slug: m.slug,
      name: m.name,
      mapName: m.name,
      mapKeys: [mapName],
      region: m.region,
      description: PLACEHOLDER_DESC,
      highlights: [],
      imageUrl: PLACEHOLDER_IMAGE,
      countryCode: m.countryCode,
      mapCoordinates: m.mapCoordinates,
      wiki: {},
      isPlaceholder: true,
    });
    continue;
  }

  const wc = findWorld(mapName);
  if (!wc) {
    unmatched.push(mapName);
    continue;
  }

  const ru = wc.translations?.rus?.common || wc.name.common;
  // Keep catalog filters readable: continent-level + useful Americas / Middle East splits.
  let region = REGION_RU[wc.region] || wc.region || 'Мир';
  if (wc.region === 'Americas') {
    if (
      wc.subregion === 'South America' ||
      wc.subregion === 'Caribbean' ||
      wc.subregion === 'Central America'
    ) {
      region = SUBREGION_RU[wc.subregion] || 'Америка';
    } else {
      region = 'Северная Америка';
    }
  } else if (wc.region === 'Asia' && wc.subregion === 'Western Asia') {
    region = 'Ближний Восток';
  }
  const [lat, lng] = wc.latlng;

  entries.push({
    slug: slugify(wc.name.common),
    name: ru,
    mapName: ru,
    mapKeys: [mapName],
    region,
    description: PLACEHOLDER_DESC,
    highlights: [],
    imageUrl: PLACEHOLDER_IMAGE,
    countryCode: wc.cca2,
    mapCoordinates: [lat, lng],
    wiki: {},
    isPlaceholder: true,
  });
}

const bySlug = new Map();
for (const entry of entries) {
  const existing = bySlug.get(entry.slug);
  if (existing) {
    existing.mapKeys = Array.from(
      new Set([...(existing.mapKeys || []), ...(entry.mapKeys || [])]),
    );
  } else {
    bySlug.set(entry.slug, entry);
  }
}

const list = Array.from(bySlug.values()).sort((a, b) =>
  a.name.localeCompare(b.name, 'ru'),
);

fs.writeFileSync(
  new URL('../lib/world-catalog.json', import.meta.url),
  JSON.stringify({ unmatched, count: list.length, countries: list }, null, 2),
);

console.log('written', list.length, 'unmatched', unmatched.length);
if (unmatched.length) console.log(unmatched.join(', '));

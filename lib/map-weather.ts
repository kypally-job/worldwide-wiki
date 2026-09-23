import type { Country } from "@/lib/countries";

const BATCH_SIZE = 50;
const MAX_CONCURRENT = 3;

export type TempGridPoint = {
  id: string;
  latitude: number;
  longitude: number;
};

export type TempSample = TempGridPoint & {
  tempC: number;
};

type OpenMeteoLocation = {
  current?: { temperature_2m?: number };
};

/** Плотные зоны для огромных стран (шаг в градусах). ~240 точек + страны. */
const DENSE_REGIONS: Array<{
  minLat: number;
  maxLat: number;
  minLon: number;
  maxLon: number;
  step: number;
}> = [
  // Россия / Сибирь / Дальний Восток
  { minLat: 44, maxLat: 70, minLon: 30, maxLon: 160, step: 8 },
  // Канада + Аляска
  { minLat: 48, maxLat: 70, minLon: -150, maxLon: -60, step: 9 },
  // США
  { minLat: 28, maxLat: 48, minLon: -120, maxLon: -72, step: 8 },
  // Китай / Монголия
  { minLat: 24, maxLat: 48, minLon: 80, maxLon: 125, step: 9 },
  // Бразилия
  { minLat: -28, maxLat: 0, minLon: -68, maxLon: -40, step: 9 },
  // Австралия
  { minLat: -38, maxLat: -16, minLon: 118, maxLon: 148, step: 9 },
  // Африка
  { minLat: -28, maxLat: 30, minLon: -12, maxLon: 45, step: 10 },
  // Европа
  { minLat: 40, maxLat: 66, minLon: -6, maxLon: 36, step: 8 },
  // Индия
  { minLat: 12, maxLat: 30, minLon: 74, maxLon: 90, step: 8 },
];

let cache: { key: string; samples: TempSample[]; fetchedAt: number } | null =
  null;
const CACHE_TTL_MS = 15 * 60 * 1000;

/**
 * Текущая температура по координатам стран через Open-Meteo (без ключа).
 */
export async function fetchCountryTemperatures(
  countries: Country[],
  signal?: AbortSignal,
): Promise<Record<string, number>> {
  const points = countryPoints(countries);
  const samples = await fetchGridTemperatures(points, signal);
  const result: Record<string, number> = {};
  for (const sample of samples) {
    result[sample.id] = sample.tempC;
  }
  return result;
}

/**
 * Сетка по суше: центры стран + уплотнение для крупных регионов.
 * Без «обрезания с юга» — равномерный набор точек.
 */
export function buildLandTemperatureGrid(countries: Country[]): TempGridPoint[] {
  const points: TempGridPoint[] = [...countryPoints(countries)];

  for (const region of DENSE_REGIONS) {
    for (let lat = region.minLat; lat <= region.maxLat + 1e-6; lat += region.step) {
      for (
        let lon = region.minLon;
        lon <= region.maxLon + 1e-6;
        lon += region.step
      ) {
        points.push(makePoint(lat, lon));
      }
    }
  }

  return dedupePoints(points);
}

/**
 * Батч-запрос + кэш на 15 мин (не дёргаем API при каждом pan/zoom).
 */
export async function fetchLandTemperatures(
  countries: Country[],
  signal?: AbortSignal,
): Promise<TempSample[]> {
  const points = buildLandTemperatureGrid(countries);
  const key = `land:${points.length}`;

  if (
    cache &&
    cache.key === key &&
    Date.now() - cache.fetchedAt < CACHE_TTL_MS
  ) {
    return cache.samples;
  }

  const samples = await fetchGridTemperatures(points, signal);

  if (!signal?.aborted && samples.length > 0) {
    cache = { key, samples, fetchedAt: Date.now() };
  }

  return samples;
}

export async function fetchGridTemperatures(
  points: TempGridPoint[],
  signal?: AbortSignal,
): Promise<TempSample[]> {
  const unique = dedupePoints(points);
  const batches: TempGridPoint[][] = [];

  for (let i = 0; i < unique.length; i += BATCH_SIZE) {
    batches.push(unique.slice(i, i + BATCH_SIZE));
  }

  const result: TempSample[] = [];

  for (let i = 0; i < batches.length; i += MAX_CONCURRENT) {
    if (signal?.aborted) break;

    const chunk = batches.slice(i, i + MAX_CONCURRENT);
    const settled = await Promise.all(
      chunk.map((batch) => fetchBatch(batch, signal)),
    );

    for (const part of settled) {
      result.push(...part);
    }
  }

  return result;
}

export function nearestSampleTemp(
  samples: TempSample[],
  latitude: number,
  longitude: number,
): number | undefined {
  if (samples.length === 0) return undefined;

  let best: TempSample | undefined;
  let bestDist = Infinity;

  for (const sample of samples) {
    const dLat = sample.latitude - latitude;
    const dLon = shortestLonDelta(sample.longitude, longitude);
    const dist = dLat * dLat + dLon * dLon;
    if (dist < bestDist) {
      bestDist = dist;
      best = sample;
    }
  }

  return best?.tempC;
}

async function fetchBatch(
  batch: TempGridPoint[],
  signal?: AbortSignal,
): Promise<TempSample[]> {
  const latitudes = batch.map((p) => p.latitude).join(",");
  const longitudes = batch.map((p) => p.longitude).join(",");

  const url =
    `https://api.open-meteo.com/v1/forecast` +
    `?latitude=${latitudes}` +
    `&longitude=${longitudes}` +
    `&current=temperature_2m`;

  const response = await fetchWithRetry(url, signal);
  const data = (await response.json()) as OpenMeteoLocation | OpenMeteoLocation[];
  const items: OpenMeteoLocation[] = Array.isArray(data) ? data : [data];

  const out: TempSample[] = [];
  items.forEach((item, index) => {
    const temp = item.current?.temperature_2m;
    const point = batch[index];
    if (point && typeof temp === "number" && Number.isFinite(temp)) {
      out.push({
        ...point,
        tempC: Math.round(temp),
      });
    }
  });
  return out;
}

async function fetchWithRetry(
  url: string,
  signal?: AbortSignal,
  attempt = 0,
): Promise<Response> {
  const response = await fetch(url, { signal, cache: "no-store" });

  if (response.status === 429 && attempt < 2) {
    await sleep(400 * (attempt + 1), signal);
    return fetchWithRetry(url, signal, attempt + 1);
  }

  if (!response.ok) {
    throw new Error(`Open-Meteo HTTP ${response.status}`);
  }

  return response;
}

function countryPoints(countries: Country[]): TempGridPoint[] {
  return countries
    .filter(
      (c) =>
        Array.isArray(c.mapCoordinates) &&
        c.mapCoordinates.length >= 2 &&
        Number.isFinite(c.mapCoordinates[0]) &&
        Number.isFinite(c.mapCoordinates[1]),
    )
    .map((c) => ({
      id: c.countryCode,
      latitude: roundCoord(c.mapCoordinates[0]),
      longitude: roundCoord(c.mapCoordinates[1]),
    }));
}

function makePoint(lat: number, lon: number): TempGridPoint {
  const latitude = roundCoord(lat);
  const longitude = roundCoord(normalizeLongitude(lon));
  return {
    id: `${latitude}_${longitude}`,
    latitude,
    longitude,
  };
}

function normalizeLongitude(lon: number): number {
  const wrapped = ((((lon + 180) % 360) + 360) % 360) - 180;
  return wrapped === -180 ? 180 : wrapped;
}

function shortestLonDelta(a: number, b: number): number {
  let d = a - b;
  if (d > 180) d -= 360;
  if (d < -180) d += 360;
  return d;
}

function roundCoord(value: number): number {
  return Math.round(value * 10) / 10;
}

function dedupePoints(points: TempGridPoint[]): TempGridPoint[] {
  const seen = new Set<string>();
  const out: TempGridPoint[] = [];

  for (const point of points) {
    if (seen.has(point.id)) continue;
    seen.add(point.id);
    out.push(point);
  }

  return out;
}

function sleep(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(new DOMException("Aborted", "AbortError"));
      return;
    }

    const timer = setTimeout(resolve, ms);
    signal?.addEventListener(
      "abort",
      () => {
        clearTimeout(timer);
        reject(new DOMException("Aborted", "AbortError"));
      },
      { once: true },
    );
  });
}

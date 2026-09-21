import type { Country } from "@/lib/countries";

const BATCH_SIZE = 40;

type OpenMeteoBatchResponse = {
  current?: { temperature_2m?: number };
  /** When multiple locations are requested, Open-Meteo returns an array */
} & Array<{
  current?: { temperature_2m?: number };
}>;

/**
 * Текущая температура по координатам стран через Open-Meteo (без ключа).
 * Возвращает map countryCode → °C.
 */
export async function fetchCountryTemperatures(
  countries: Country[],
  signal?: AbortSignal,
): Promise<Record<string, number>> {
  const withCoords = countries.filter(
    (c) =>
      Array.isArray(c.mapCoordinates) &&
      c.mapCoordinates.length >= 2 &&
      Number.isFinite(c.mapCoordinates[0]) &&
      Number.isFinite(c.mapCoordinates[1]),
  );

  const result: Record<string, number> = {};

  for (let i = 0; i < withCoords.length; i += BATCH_SIZE) {
    if (signal?.aborted) break;

    const batch = withCoords.slice(i, i + BATCH_SIZE);
    const latitudes = batch.map((c) => c.mapCoordinates[0]).join(",");
    const longitudes = batch.map((c) => c.mapCoordinates[1]).join(",");

    const url =
      `https://api.open-meteo.com/v1/forecast` +
      `?latitude=${latitudes}` +
      `&longitude=${longitudes}` +
      `&current=temperature_2m` +
      `&timezone=auto`;

    const response = await fetch(url, { signal, cache: "no-store" });
    if (!response.ok) {
      throw new Error(`Open-Meteo HTTP ${response.status}`);
    }

    const data = (await response.json()) as OpenMeteoBatchResponse | OpenMeteoBatchResponse[];

    const items: Array<{ current?: { temperature_2m?: number } }> = Array.isArray(data)
      ? data
      : [data];

    items.forEach((item, index) => {
      const temp = item.current?.temperature_2m;
      const country = batch[index];
      if (country && typeof temp === "number" && Number.isFinite(temp)) {
        result[country.countryCode] = Math.round(temp);
      }
    });
  }

  return result;
}

import type { Country } from "@/lib/countries";

export type CountryCover = {
  kind: "photo";
  src: string;
};

const PLACEHOLDER_IMAGE_MARKERS = ["photo-1526779259212-939e64788e3c"];

/**
 * Prefer the country's own imageUrl. Flag-art is no longer used once catalog
 * images are populated for every country.
 */
export function getCountryCover(country: Country): CountryCover {
  const isGenericPhoto = PLACEHOLDER_IMAGE_MARKERS.some((marker) =>
    country.imageUrl.includes(marker),
  );

  return {
    kind: "photo",
    src: isGenericPhoto
      ? "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1000&q=80"
      : country.imageUrl,
  };
}

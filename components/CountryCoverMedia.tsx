import Image from "next/image";
import type { CountryCover } from "@/lib/country-cover";

type CountryCoverMediaProps = {
  cover: CountryCover;
  alt: string;
  sizes?: string;
  priority?: boolean;
};

function isWikimedia(src: string): boolean {
  return src.includes("wikimedia.org") || src.includes("wikipedia.org");
}

export default function CountryCoverMedia({
  cover,
  alt,
  sizes = "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw",
  priority = false,
}: CountryCoverMediaProps) {
  return (
    <>
      <Image
        src={cover.src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        unoptimized={isWikimedia(cover.src)}
        className="object-cover transition duration-700 group-hover:scale-[1.03]"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[var(--hero-shade)] via-[var(--hero-mid)] to-[#d56089]/12" />
    </>
  );
}

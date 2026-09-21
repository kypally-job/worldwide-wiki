"use client";

import { usePathname } from "next/navigation";
import SakuraBackdrop from "@/components/SakuraBackdrop";

function shouldShowDots(pathname: string) {
  if (pathname === "/") {
    return false;
  }

  // Country wiki pages keep cultural motifs
  if (/^\/countries\/[^/]+/.test(pathname)) {
    return false;
  }

  return true;
}

export default function SiteBackdrop() {
  const pathname = usePathname();

  if (!shouldShowDots(pathname)) {
    return null;
  }

  return (
    <div className="pointer-events-none absolute inset-0 z-0 min-h-full">
      <SakuraBackdrop />
    </div>
  );
}

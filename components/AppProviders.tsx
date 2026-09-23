"use client";

import { LocaleProvider } from "@/lib/i18n/LocaleProvider";
import type { ReactNode } from "react";

export default function AppProviders({ children }: { children: ReactNode }) {
  return <LocaleProvider>{children}</LocaleProvider>;
}

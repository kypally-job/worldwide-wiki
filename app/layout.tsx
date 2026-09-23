import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AppProviders from "@/components/AppProviders";
import Header from "@/components/Header";
import SakuraAssistant from "@/components/SakuraAssistant";
import ScrollProgress from "@/components/ScrollProgress";
import SiteBackdrop from "@/components/SiteBackdrop";
import { themeInitScript } from "@/lib/theme";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Worldwide WIKI — country knowledge base",
  description:
    "A catalog of countries, specialists, volunteering projects, and traveler community.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className={`${inter.className} dark`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className={`${inter.variable} bg-ink text-sand antialiased`}>
        <AppProviders>
          <Header />
          <main className="relative min-h-[calc(100dvh-var(--header-height))]">
            <SiteBackdrop />
            <div className="relative z-10">{children}</div>
          </main>
          <ScrollProgress />
          <SakuraAssistant />
        </AppProviders>
      </body>
    </html>
  );
}

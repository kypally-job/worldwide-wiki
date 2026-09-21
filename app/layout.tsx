import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import SakuraAssistant from "@/components/SakuraAssistant";
import SiteBackdrop from "@/components/SiteBackdrop";
import { themeInitScript } from "@/lib/theme";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Worldwide WIKI — база знаний о странах мира",
  description:
    "Каталог стран, специалистов, волонтёрских проектов и сообщества путешественников.",
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
        <Header />
        <main className="relative min-h-[calc(100dvh-var(--header-height))]">
          <SiteBackdrop />
          <div className="relative z-10">{children}</div>
        </main>
        <SakuraAssistant />
      </body>
    </html>
  );
}

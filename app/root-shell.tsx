import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono, Caveat, Nothing_You_Could_Do } from "next/font/google";
import "./globals.css";

import { profile } from "@/lib/data";
import { getDict, prefix, LOCALES, type Locale } from "@/lib/i18n";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains", display: "swap" });
const caveat = Caveat({ subsets: ["latin"], variable: "--font-hand", display: "swap" });
const signature = Nothing_You_Could_Do({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-signature",
  display: "swap",
});

export const siteUrl = "https://ggds.tech";

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f6f4ef" },
    { media: "(prefers-color-scheme: dark)", color: "#161616" },
  ],
};

/** Metadados de uma página num idioma, com links hreflang para as versões traduzidas. */
export function pageMetadata(locale: Locale, page: "home" | "cv"): Metadata {
  const t = getDict(locale);
  const sub = page === "cv" ? "/cv" : "";
  const path = (l: Locale) => `${prefix(l)}${sub}` || "/";
  const title = page === "cv" ? t.meta.cvTitle : t.meta.title;
  const description = page === "cv" ? t.meta.cvDescription : t.meta.description;
  return {
    metadataBase: new URL(siteUrl),
    title,
    description,
    authors: [{ name: profile.name, url: profile.links.github }],
    creator: profile.name,
    icons: { icon: "/icon.svg" },
    alternates: {
      canonical: path(locale),
      languages: { ...Object.fromEntries(LOCALES.map((l) => [getDict(l).htmlLang, path(l)])), "x-default": path("pt") },
    },
    openGraph: { type: "website", locale: t.ogLocale, url: path(locale), title, description, siteName: profile.name },
    twitter: { card: "summary_large_image", title, description },
    robots: { index: true, follow: true },
  };
}

/**
 * Roda antes da pintura: aplica o tema salvo (escuro por padrão) e decide
 * se a intro com digitação deve rodar (só nas homes, uma vez por sessão,
 * nunca com "reduzir movimento").
 */
const bootScript = `
(function(){
  var d = document.documentElement;
  try {
    var t = localStorage.getItem('theme');
    if (t !== 'light') d.classList.add('dark');
  } catch (_) { d.classList.add('dark'); }
  try {
    var home = /^\\/(en|es)?\\/?$/.test(location.pathname);
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (home && !reduce && !sessionStorage.getItem('intro-seen')) d.classList.add('intro');
  } catch (_) {}
})();
`;

/** <html> e <body> compartilhados pelos dois layouts raiz (PT e EN/ES). */
export function RootShell({ locale, children }: { locale: Locale; children: React.ReactNode }) {
  return (
    <html
      lang={getDict(locale).htmlLang}
      suppressHydrationWarning
      className={`${inter.variable} ${jetbrains.variable} ${caveat.variable} ${signature.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} suppressHydrationWarning />
      </head>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}

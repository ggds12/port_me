import { notFound } from "next/navigation";
import { RootShell } from "../root-shell";
import type { Locale } from "@/lib/i18n";

export { viewport } from "../root-shell";

/** Só /en e /es; o português fica na raiz do site. */
const OTHER: Locale[] = ["en", "es"];
export const dynamicParams = false;
export function generateStaticParams() {
  return OTHER.map((lang) => ({ lang }));
}

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!OTHER.includes(lang as Locale)) notFound();
  return <RootShell locale={lang as Locale}>{children}</RootShell>;
}

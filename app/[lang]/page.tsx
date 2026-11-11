import { HomeView } from "@/components/views/home-view";
import { pageMetadata } from "../root-shell";
import type { Locale } from "@/lib/i18n";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  return pageMetadata((await params).lang as Locale, "home");
}

export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  return <HomeView locale={(await params).lang as Locale} />;
}

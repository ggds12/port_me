import { CvView } from "@/components/views/cv-view";
import { pageMetadata } from "../../root-shell";
import type { Locale } from "@/lib/i18n";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  return pageMetadata((await params).lang as Locale, "cv");
}

export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  return <CvView locale={(await params).lang as Locale} />;
}

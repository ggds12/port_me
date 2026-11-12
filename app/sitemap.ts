import type { MetadataRoute } from "next";
import { siteUrl } from "./root-shell";
import { LOCALES, prefix } from "@/lib/i18n";

export default function sitemap(): MetadataRoute.Sitemap {
  return (["", "/cv"] as const).flatMap((sub) =>
    LOCALES.map((l) => ({
      url: `${siteUrl}${prefix(l)}${sub}` || siteUrl,
      lastModified: new Date(),
      priority: sub === "" && l === "pt" ? 1 : 0.7,
      alternates: {
        languages: Object.fromEntries(LOCALES.map((x) => [x, `${siteUrl}${prefix(x)}${sub}`])),
      },
    })),
  );
}

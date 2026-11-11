import { pt } from "./pt.ts";
import { en } from "./en.ts";
import { es } from "./es.ts";
import type { Dict, Locale } from "./types.ts";

export * from "./types.ts";

export const dictionaries: Record<Locale, Dict> = { pt, en, es };
export const getDict = (l: Locale) => dictionaries[l];

/**
 * Tipos do sistema de idiomas. Todo dicionário precisa satisfazer `Dict`,
 * então o TypeScript acusa qualquer texto faltando em PT, EN ou ES.
 * (Só imports relativos aqui: o script de validação lê estes arquivos.)
 */

export const LOCALES = ["pt", "en", "es"] as const;
export type Locale = (typeof LOCALES)[number];

/** Pedaços da bio: texto, chip de tecnologia, marca-texto, letra manuscrita, link… */
export type Token =
  | string
  | { chip: string }
  | { mark: string; tone?: "amber" | "blue" }
  | { hand: string }
  | { link: string; to: "experience" | "cv" | "github" }
  | { open: string };

export type Dict = {
  htmlLang: string;
  ogLocale: string;
  numberLocale: string;
  meta: { title: string; description: string; cvTitle: string; cvDescription: string };
  skip: string;
  role: string;
  location: string;
  nav: {
    main: string;
    projects: string;
    experience: string;
    stack: string;
    cv: string;
    home: string;
    downloadPdf: string;
    toLight: string;
    toDark: string;
    language: string;
    home_aria: string;
  };
  intro: { group: string; forward: string; skip: string };
  hero: { greet: string; bio: Token[][] };
  projects: {
    title: string;
    seeAll: string;
    tech: string;
    viewRepo: string;
    items: { name: string; description: string }[];
  };
  visuals: {
    nextRun: string;
    restPaging: string;
    govTitle: string;
    govDataset: string;
    govCompliance: string;
    govFields: string;
    govReport: string;
    catTitle: string;
    ago: string[];
  };
  experience: { title: string; summary: string; highlights: string[] };
  education: { title: string; items: string[] };
  stack: { title: string; note: string; groups: { group: string; tagline: string }[] };
  contact: { before: string; hand: string; text: string; download: string };
  footer: { signature: string; socials: string; train: string };
  cv: {
    kicker: string;
    open: string;
    summary: string;
    downloadPdf: string;
    jobSummary: string;
    highlights: string[];
    skillsTitle: string;
    skillsNote: string;
    skillGroups: string[];
    back: string;
  };
};

/** Prefixo de rota de cada idioma (PT fica na raiz). */
export const prefix = (l: Locale) => (l === "pt" ? "" : `/${l}`);

export const LOCALE_NAMES: Record<Locale, string> = { pt: "Português", en: "English", es: "Español" };

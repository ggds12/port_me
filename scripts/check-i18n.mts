/**
 * Validação das traduções (PT / EN / ES).
 *
 *   npm run check:i18n                 → usa http://localhost:3000
 *   npm run check:i18n -- http://host  → outra URL (ex.: produção)
 *
 * 1. Estática: os três dicionários têm as mesmas chaves, os mesmos
 *    tamanhos de lista, os mesmos chips na bio e nenhum texto vazio.
 * 2. Renderizada: baixa as 6 páginas e, em cada uma, procura textos de
 *    OUTRO idioma que tenham vazado (texto visível, aria-label, alt, title,
 *    <title> e meta tags). Também confere o <html lang>, o seletor de
 *    idioma e palavras com acentos típicos do português em EN/ES.
 */
import { pt } from "../lib/i18n/pt.ts";
import { en } from "../lib/i18n/en.ts";
import { es } from "../lib/i18n/es.ts";

type Locale = "pt" | "en" | "es";
const dicts = { pt, en, es } as Record<Locale, unknown>;
const LOCALES: Locale[] = ["pt", "en", "es"];
const BASE = (process.argv[2] ?? "http://localhost:3000").replace(/\/$/, "");

let failures = 0;
const fail = (msg: string) => {
  failures++;
  console.log(`  ✗ ${msg}`);
};
const ok = (msg: string) => console.log(`  ✓ ${msg}`);

/** Achata o dicionário em { "caminho.da.chave": "texto" }. */
function flatten(v: unknown, path = "", out: Record<string, string> = {}) {
  if (typeof v === "string") out[path] = v;
  else if (Array.isArray(v)) v.forEach((x, i) => flatten(x, `${path}[${i}]`, out));
  else if (v && typeof v === "object")
    for (const [k, x] of Object.entries(v)) flatten(x, path ? `${path}.${k}` : k, out);
  return out;
}

// --------------------------------------------------------------------------
console.log("\n1) Dicionários");
const flat = Object.fromEntries(LOCALES.map((l) => [l, flatten(dicts[l])])) as Record<Locale, Record<string, string>>;
const keys = (l: Locale) => Object.keys(flat[l]);
for (const l of LOCALES.slice(1)) {
  const a = new Set(keys("pt"));
  const b = new Set(keys(l));
  const missing = [...a].filter((k) => !b.has(k));
  const extra = [...b].filter((k) => !a.has(k));
  if (missing.length || extra.length) {
    missing.forEach((k) => fail(`${l.toUpperCase()} não tem a chave ${k}`));
    extra.forEach((k) => fail(`${l.toUpperCase()} tem chave a mais: ${k}`));
  } else ok(`${l.toUpperCase()} tem as mesmas ${a.size} chaves que PT`);
}
for (const l of LOCALES)
  for (const [k, v] of Object.entries(flat[l]))
    if (!v.trim() && k !== "contact.before") fail(`${l.toUpperCase()}: texto vazio em ${k}`);
for (const l of LOCALES.slice(1)) {
  const chips = (x: Locale) => Object.entries(flat[x]).filter(([k]) => k.endsWith(".chip")).map(([, v]) => v).join(",");
  if (chips(l) === chips("pt")) ok(`${l.toUpperCase()}: mesmos chips de tecnologia na bio`);
  else fail(`${l.toUpperCase()}: chips da bio diferentes de PT`);
}

// --------------------------------------------------------------------------
const decode = (s: string) =>
  s
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(+n))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)));

/** Tudo que um visitante (ou leitor de tela / buscador) lê na página. */
function readable(html: string) {
  const clean = html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<!--[\s\S]*?-->/g, "");
  const attrs = [...clean.matchAll(/\s(?:aria-label|alt|title|content|placeholder)="([^"]*)"/g)].map((m) => m[1]);
  const text = clean.replace(/<[^>]+>/g, " ");
  return decode(`${text} ${attrs.join(" ")}`).replace(/\s+/g, " ");
}

const esc = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
/** procura a frase inteira (sem casar pedaço de palavra) */
const has = (hay: string, needle: string) =>
  new RegExp(`(?<![\\p{L}\\p{N}])${esc(needle.replace(/\s+/g, " "))}(?![\\p{L}\\p{N}])`, "u").test(hay);

const pages: { path: string; locale: Locale; page: "home" | "cv" }[] = [
  { path: "/", locale: "pt", page: "home" },
  { path: "/cv", locale: "pt", page: "cv" },
  { path: "/en", locale: "en", page: "home" },
  { path: "/en/cv", locale: "en", page: "cv" },
  { path: "/es", locale: "es", page: "home" },
  { path: "/es/cv", locale: "es", page: "cv" },
];
// nomes próprios e os nomes nativos do menu de idiomas (Português, Español)
const ALLOWED_ACCENTED = new Set(["São", "Português", "Español"]);
const PT_ONLY = /[ãõçâêô]/i;

console.log(`\n2) Páginas renderizadas (${BASE})`);
for (const p of pages) {
  console.log(`\n  ${p.path}  [${p.locale.toUpperCase()}]`);
  let html: string;
  try {
    const res = await fetch(BASE + p.path);
    if (res.status !== 200) {
      fail(`status HTTP ${res.status}`);
      continue;
    }
    html = await res.text();
  } catch (e) {
    fail(`não consegui abrir a página (${(e as Error).message}). O servidor está rodando?`);
    continue;
  }
  const own = flat[p.locale];
  const ownCorpus = Object.values(own).join(" \n ");
  const text = readable(html);

  // <html lang>
  const lang = html.match(/<html[^>]*\slang="([^"]+)"/)?.[1];
  if (lang === own.htmlLang) ok(`<html lang="${lang}">`);
  else fail(`<html lang> é "${lang}", esperado "${own.htmlLang}"`);

  // título da aba
  const title = decode(html.match(/<title>([^<]*)<\/title>/)?.[1] ?? "");
  const expTitle = p.page === "cv" ? own["meta.cvTitle"] : own["meta.title"];
  if (title === expTitle) ok(`<title> traduzido: "${title}"`);
  else fail(`<title> é "${title}", esperado "${expTitle}"`);

  // alguns textos do próprio idioma precisam aparecer
  const anchors = p.page === "home"
    ? ["nav.projects", "projects.title", "experience.title", "education.title", "stack.title", "contact.text", "intro.forward"]
    : ["cv.kicker", "experience.title", "education.title", "cv.skillsTitle", "cv.back"];
  const missingOwn = anchors.filter((k) => !has(text, own[k]));
  if (missingOwn.length) missingOwn.forEach((k) => fail(`texto do próprio idioma não aparece: ${k} = "${own[k]}"`));
  else ok(`${anchors.length} textos-âncora do próprio idioma presentes`);

  // seletor de idioma aponta para a mesma página nos 3 idiomas
  const sub = p.page === "cv" ? "/cv" : "";
  const wanted = LOCALES.map((l) => (l === "pt" ? sub || "/" : `/${l}${sub}`));
  const missingLinks = wanted.filter((h) => !html.includes(`href="${h}" hrefLang=`) && !new RegExp(`href="${esc(h)}"[^>]*hreflang=`, "i").test(html));
  if (missingLinks.length) fail(`seletor de idioma sem link para: ${missingLinks.join(", ")}`);
  else ok(`seletor de idioma leva a ${wanted.join(" · ")}`);

  // textos de OUTROS idiomas que vazaram
  const leaks: string[] = [];
  for (const other of LOCALES) {
    if (other === p.locale) continue;
    for (const [k, v] of Object.entries(flat[other])) {
      if (k.endsWith("Lang") || k.endsWith("Locale") || k.startsWith("ogLocale")) continue;
      if (v === own[k] || v.trim().length < 4) continue;
      if (has(ownCorpus, v)) continue; // a mesma frase existe no próprio idioma
      if (has(text, v)) leaks.push(`${other.toUpperCase()} ${k}: "${v.slice(0, 70)}${v.length > 70 ? "…" : ""}"`);
    }
  }
  if (leaks.length) leaks.forEach((l) => fail(`texto de outro idioma na página → ${l}`));
  else ok("nenhum texto de outro idioma encontrado");

  // acentos suspeitos (texto fixo no código que escapou do dicionário)
  if (p.locale !== "pt") {
    const words = text.match(/[\p{L}]+/gu) ?? [];
    const bad = [
      ...new Set(
        words.filter((w) => {
          if (ALLOWED_ACCENTED.has(w) || has(ownCorpus, w)) return false;
          return p.locale === "en" ? /[^\x00-\x7F]/.test(w) : PT_ONLY.test(w);
        }),
      ),
    ];
    if (bad.length) fail(`palavras com acento de português fora do dicionário: ${bad.slice(0, 15).join(", ")}`);
    else ok("nenhuma palavra em português escondida no código");
  }
}

console.log(failures ? `\n✗ ${failures} problema(s) encontrado(s).\n` : "\n✓ Tudo traduzido corretamente nos 3 idiomas.\n");
process.exit(failures ? 1 : 0);

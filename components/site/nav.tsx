"use client";

import { useEffect, useRef, useState } from "react";
import { Logo } from "./logo";
import { LOCALES, LOCALE_NAMES, type Locale } from "@/lib/i18n/types";

type NavLink = { href: string; label: string; download?: string };

export type NavLabels = {
  main: string;
  toLight: string;
  toDark: string;
  language: string;
  home_aria: string;
};

export function Nav({
  links,
  logoHref,
  labels,
  locale,
  langHrefs,
}: {
  links: NavLink[];
  logoHref: string;
  labels: NavLabels;
  locale: Locale;
  /** link da página atual em cada idioma */
  langHrefs: Record<Locale, string>;
}) {
  const [dark, setDark] = useState(true);
  const [open, setOpen] = useState(false);
  const menu = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
  }, []);

  // fecha o menu de idiomas ao clicar fora ou apertar Esc
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (menu.current && !menu.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const toggle = () => {
    const next = !dark;
    const apply = () => {
      document.documentElement.classList.toggle("dark", next);
      setDark(next);
      try {
        localStorage.setItem("theme", next ? "dark" : "light");
      } catch {}
    };
    // transição suave entre temas quando o navegador suporta
    const d = document as Document & { startViewTransition?: (cb: () => void) => unknown };
    if (d.startViewTransition && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      d.startViewTransition(apply);
    } else apply();
  };

  return (
    <header className="nav dim">
      <div className="nav-inner col">
        <a href={logoHref} className="nav-logo" aria-label={labels.home_aria}>
          <Logo size={30} />
        </a>
        <nav aria-label={labels.main}>
          {links.map((l) => (
            <a key={l.href} href={l.href} download={l.download}>
              {l.label}
            </a>
          ))}

          <div className="lang" ref={menu}>
            <button
              type="button"
              className="lang-btn"
              aria-haspopup="true"
              aria-expanded={open}
              aria-label={`${labels.language}: ${LOCALE_NAMES[locale]}`}
              onClick={() => setOpen((o) => !o)}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
                <g fill="none" stroke="currentColor" strokeWidth="1.8">
                  <circle cx="12" cy="12" r="9" />
                  <path d="M3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3Z" />
                </g>
              </svg>
              {locale.toUpperCase()}
            </button>
            <ul className={`lang-menu ${open ? "on" : ""}`} role="menu" aria-label={labels.language}>
              {LOCALES.map((l) => (
                <li key={l} role="none">
                  <a
                    role="menuitem"
                    href={langHrefs[l]}
                    hrefLang={l}
                    lang={l}
                    aria-current={l === locale ? "true" : undefined}
                    onClick={() => {
                      try {
                        localStorage.setItem("lang", l);
                      } catch {}
                    }}
                  >
                    <span>{LOCALE_NAMES[l]}</span>
                    <small>{l.toUpperCase()}</small>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <button
            type="button"
            className="theme-btn"
            onClick={toggle}
            aria-label={dark ? labels.toLight : labels.toDark}
          >
            {dark ? (
              <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
                <path fill="currentColor" d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
                <circle cx="12" cy="12" r="4.5" fill="currentColor" />
                <g stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
                </g>
              </svg>
            )}
          </button>
        </nav>
      </div>
    </header>
  );
}

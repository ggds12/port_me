"use client";

import { useEffect, useState } from "react";

/**
 * SiteReveal — faz o conteúdo do site entrar suavemente.
 *
 * Escuta o evento "portfolio:reveal" (disparado pelo Welcome no início
 * da sua saída) e aplica uma classe no <body> que dispara um fade-in +
 * rise coordenado do conteúdo. Assim a passagem Welcome → site deixa de
 * ser um corte seco e vira um crossfade contínuo.
 *
 * Se o evento nunca chegar (ex: reduced-motion, onde o Welcome some
 * rápido), um fallback libera o conteúdo após um tempo máximo.
 */
export function SiteReveal() {
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reduced) {
      setRevealed(true);
      return;
    }

    const onReveal = () => setRevealed(true);
    window.addEventListener("portfolio:reveal", onReveal);

    // Fallback: nunca deixa o site preso escondido
    const fallback = window.setTimeout(() => setRevealed(true), 6000);

    return () => {
      window.removeEventListener("portfolio:reveal", onReveal);
      window.clearTimeout(fallback);
    };
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("site-revealed", revealed);
  }, [revealed]);

  return null;
}

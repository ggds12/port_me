"use client";

import { useEffect } from "react";

/**
 * Observador único: todo elemento com [data-reveal] ganha a classe `in`
 * quando entra na tela (blur → nítido, de baixo para cima).
 */
export function Reveal() {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement | SVGElement>("[data-reveal]"));
    if (!("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add("in"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        }
      },
      // margem pequena: elementos colados no fim da página também disparam
      { rootMargin: "0px 0px -30px 0px", threshold: 0.1 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
  return null;
}

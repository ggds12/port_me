"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type ManifestoProps = {
  /** Texto completo do manifesto. */
  text: string;
  /** Palavras (case-insensitive) que devem acender em laranja. */
  accentWords?: string[];
  className?: string;
};

/**
 * Manifesto — texto grande onde cada palavra "acende" conforme o scroll
 * avança. As palavras começam apagadas (muted) e ganham cor à medida que
 * cruzam uma linha de referência na viewport, criando um efeito de leitura
 * guiada. Palavras-chave acendem em laranja (accent).
 */
export function Manifesto({
  text,
  accentWords = [],
  className,
}: ManifestoProps) {
  const ref = useRef<HTMLParagraphElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setProgress(1);
      return;
    }

    let raf = 0;
    const update = () => {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      // 0 quando o topo entra (85% da tela), 1 quando o fim passa (35%)
      const start = vh * 0.85;
      const end = vh * 0.35;
      const total = rect.height + (start - end);
      const passed = start - rect.top;
      const p = Math.min(Math.max(passed / total, 0), 1);
      setProgress(p);
    };

    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const words = text.split(" ");
  const accentSet = new Set(accentWords.map((w) => w.toLowerCase()));
  // Quantas palavras já devem estar acesas
  const litCount = Math.round(progress * words.length);

  return (
    <p ref={ref} className={cn("manifesto", className)}>
      {words.map((word, i) => {
        const clean = word.replace(/[.,;:!?]/g, "").toLowerCase();
        const isAccent = accentSet.has(clean);
        return (
          <span
            key={i}
            className="manifesto__word"
            data-lit={i < litCount ? "true" : "false"}
            data-accent={isAccent ? "true" : "false"}
          >
            {word}
            {i < words.length - 1 ? "\u00A0" : ""}
          </span>
        );
      })}
    </p>
  );
}

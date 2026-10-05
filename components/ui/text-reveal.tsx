"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type TextRevealProps = {
  /** Texto simples a ser revelado palavra a palavra. */
  text: string;
  className?: string;
  /** Atraso entre palavras, em ms. Padrão 60. */
  stagger?: number;
  /** Atraso inicial, em ms. */
  delay?: number;
  as?: "h1" | "h2" | "h3" | "p" | "span";
};

/**
 * TextReveal — revela o texto palavra a palavra quando entra na viewport.
 * Cada palavra sobe de dentro de uma máscara (overflow hidden) com stagger,
 * criando o efeito "TEXT REVEAL ON SCROLL".
 *
 * Respeita prefers-reduced-motion (mostra tudo de imediato).
 */
export function TextReveal({
  text,
  className,
  stagger = 60,
  delay = 0,
  as: Tag = "span",
}: TextRevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.disconnect();
          }
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.15 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const words = text.split(" ");

  return (
    <Tag
      ref={ref as never}
      className={cn("text-reveal", className)}
      data-visible={visible ? "true" : "false"}
    >
      {words.map((word, i) => (
        <span key={i} className="text-reveal__word">
          <span
            style={{
              transitionDelay: `${delay + i * stagger}ms`,
            }}
          >
            {word}
          </span>
          {i < words.length - 1 ? "\u00A0" : ""}
        </span>
      ))}
    </Tag>
  );
}

"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

type MagneticProps = {
  children: React.ReactNode;
  className?: string;
  /** Força da atração (0–1). Padrão 0.35. */
  strength?: number;
  /** Raio de influência em px além do próprio elemento. Padrão 90. */
  radius?: number;
};

/**
 * Magnetic — o elemento é atraído na direção do cursor quando ele se
 * aproxima, e volta ao lugar com um "spring" quando o cursor sai.
 *
 * O conteúdo interno recebe um deslocamento menor (parallax), dando a
 * sensação de que o botão "puxa" o cursor. Só ativa em ponteiro fino e
 * respeita prefers-reduced-motion.
 */
export function Magnetic({
  children,
  className,
  strength = 0.35,
  radius = 90,
}: MagneticProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const innerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    const inner = innerRef.current;
    if (!el || !inner) return;

    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (!fine || reduced) return;

    let raf = 0;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;

      // Distância do cursor até a borda do elemento
      const distX = Math.max(0, Math.abs(dx) - rect.width / 2);
      const distY = Math.max(0, Math.abs(dy) - rect.height / 2);
      const dist = Math.hypot(distX, distY);

      if (dist < radius) {
        // Quanto mais perto, mais forte a atração
        const falloff = 1 - dist / radius;
        targetX = dx * strength * falloff;
        targetY = dy * strength * falloff;
      } else {
        targetX = 0;
        targetY = 0;
      }
    };

    const loop = () => {
      // lerp suave em direção ao alvo
      currentX += (targetX - currentX) * 0.18;
      currentY += (targetY - currentY) * 0.18;
      el.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
      inner.style.transform = `translate3d(${currentX * 0.35}px, ${currentY * 0.35}px, 0)`;
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    raf = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, [strength, radius]);

  return (
    <span ref={ref} className={cn("magnetic", className)}>
      <span ref={innerRef} className="magnetic__inner">
        {children}
      </span>
    </span>
  );
}

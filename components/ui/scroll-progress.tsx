"use client";

import { useEffect, useRef } from "react";

/**
 * ScrollProgress — barra fina no topo que indica o progresso de leitura
 * da página. Usa requestAnimationFrame + transform (sem reflow) e só
 * atualiza quando o valor muda de forma perceptível.
 */
export function ScrollProgress() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let raf = 0;
    let last = -1;

    const update = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight;
      const progress = max > 0 ? Math.min(doc.scrollTop / max, 1) : 0;
      if (Math.abs(progress - last) > 0.001) {
        el.style.transform = `scaleX(${progress})`;
        last = progress;
      }
      raf = 0;
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return <div ref={ref} aria-hidden className="scroll-progress" />;
}

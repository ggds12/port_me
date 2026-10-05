"use client";

import { useEffect, useRef, useState } from "react";

type Phase = "boot" | "exiting" | "done";

const RADIUS = 68;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

/**
 * Preloader — "COUNTER + RING".
 *
 * Um contador tipográfico centralizado dentro de um anel SVG que desenha
 * o progresso. A porcentagem fica legível ao lado do número, e uma barra
 * horizontal preenche embaixo. Ao fundo, um halo laranja que respira.
 *
 * SAÍDA FLUIDA: em vez de um corte seco, o conjunto inteiro "colapsa" —
 * o anel se contrai, o número sobe e desfoca, e o fundo dissolve num
 * wipe radial que entrega a tela para a mensagem de boas-vindas. O
 * Welcome assume o mesmo fundo, criando continuidade visual.
 *
 * Ao terminar, dispara o evento "portfolio:loaded" para que o restante
 * do site (ex: a mensagem de boas-vindas) reaja.
 */
export function Preloader() {
  const [phase, setPhase] = useState<Phase>("boot");
  const [count, setCount] = useState(0);
  const barRef = useRef<HTMLSpanElement>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const prevOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";

    const DURATION = reduced ? 200 : 2000;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - start) / DURATION, 1);
      const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
      const value = eased * 100;
      setCount(Math.round(value));
      if (barRef.current) {
        barRef.current.style.transform = `scaleX(${value / 100})`;
      }
      if (t < 1) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    // Timeline encadeada: o preloader começa a sair, o Welcome entra
    // sobreposto (crossfade) e só depois o site é liberado.
    const exitAt = reduced ? 400 : 2300;
    const doneAt = reduced ? 700 : 3400;

    const exitTimer = window.setTimeout(() => setPhase("exiting"), exitAt);
    const doneTimer = window.setTimeout(() => {
      setPhase("done");
      document.documentElement.style.overflow = prevOverflow;
      // Avisa o resto do site que o carregamento terminou
      window.dispatchEvent(new Event("portfolio:loaded"));
    }, doneAt);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.clearTimeout(exitTimer);
      window.clearTimeout(doneTimer);
      document.documentElement.style.overflow = prevOverflow;
    };
  }, []);

  if (phase === "done") return null;

  const isExit = phase === "exiting";
  const dashOffset = CIRCUMFERENCE * (1 - count / 100);

  return (
    <div
      aria-hidden={isExit ? "true" : "false"}
      role="status"
      aria-live="polite"
      aria-label={`Carregando ${count}%`}
      className={`loader ${isExit ? "loader--exiting" : ""}`}
    >
      <span className="loader__halo" aria-hidden />

      <div className="loader__inner">
        {/* Anel de progresso com o número centralizado dentro */}
        <div className="loader__ring">
          <svg viewBox="0 0 148 148" aria-hidden>
            <circle
              className="loader__ring-track"
              cx="74"
              cy="74"
              r={RADIUS}
            />
            <circle
              className="loader__ring-fill"
              cx="74"
              cy="74"
              r={RADIUS}
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={dashOffset}
            />
          </svg>
          <div className="loader__readout">
            <span className="loader__num">{count}</span>
            <span className="loader__pct">%</span>
          </div>
        </div>

        {/* Barra horizontal */}
        <span className="loader__bar" aria-hidden>
          <span ref={barRef} className="loader__bar-fill" />
        </span>

        <span className="loader__label">carregando</span>
      </div>
    </div>
  );
}

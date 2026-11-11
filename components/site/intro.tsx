"use client";

import { useEffect, useRef } from "react";

/**
 * Intro com digitação: enquanto <html> tem a classe `intro`, o resto da
 * página fica desfocado e a bio aparece palavra por palavra.
 * "Avançar" acelera; "Pular" mostra tudo de uma vez.
 * Roda uma vez por sessão (decidido pelo script de boot no layout).
 */
export function Intro({ labels }: { labels: { group: string; forward: string; skip: string } }) {
  const speed = useRef<"normal" | "fast">("normal");
  const skip = useRef<() => void>(() => {});

  useEffect(() => {
    const root = document.documentElement;
    if (!root.classList.contains("intro")) return;

    const words = Array.from(document.querySelectorAll<HTMLElement>(".hero-copy .w"));
    let i = 0;
    let timer: number | undefined;
    let done = false;

    const finish = () => {
      if (done) return;
      done = true;
      window.clearTimeout(timer);
      words.forEach((w) => w.classList.add("on"));
      root.classList.remove("intro");
      try {
        sessionStorage.setItem("intro-seen", "1");
      } catch {}
    };
    skip.current = finish;

    const step = () => {
      if (done) return;
      if (i >= words.length) {
        timer = window.setTimeout(finish, 350);
        return;
      }
      const w = words[i++];
      w.classList.add("on");
      const fast = speed.current === "fast";
      const text = w.textContent ?? "";
      let delay = fast ? 9 : 42 + Math.random() * 30;
      if (!fast && /[.,;:!?—]$/.test(text)) delay += 240;
      if (!fast && w.classList.contains("chip")) delay += 90;
      timer = window.setTimeout(step, delay);
    };

    // espera a assinatura se desenhar antes de começar a "digitar"
    timer = window.setTimeout(step, 1500);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") finish();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <div className="intro-controls" role="group" aria-label={labels.group}>
      <button
        type="button"
        onClick={(e) => {
          speed.current = "fast";
          e.currentTarget.setAttribute("aria-pressed", "true");
        }}
      >
        <svg width="12" height="12" viewBox="0 0 24 24" aria-hidden="true">
          <path fill="currentColor" d="M3 5v14l9-7zm9 0v14l9-7z" />
        </svg>
        {labels.forward}
      </button>
      <button type="button" onClick={() => skip.current()}>
        {labels.skip}
      </button>
    </div>
  );
}

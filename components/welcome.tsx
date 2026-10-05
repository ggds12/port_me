"use client";

import { useEffect, useState } from "react";

type Phase = "hidden" | "showing" | "leaving";

const MESSAGE = "Seja bem-vindo ao meu portfólio";

/**
 * Welcome — mensagem de boas-vindas exibida logo após o preloader
 * terminar. Escuta o evento "portfolio:loaded" disparado pelo Preloader,
 * revela o texto palavra a palavra e some sozinha depois de alguns
 * segundos.
 *
 * TRANSIÇÕES FLUIDAS:
 * - Entrada: o fundo do preloader permanece e o texto emerge de baixo
 *   com máscara (morph), criando continuidade em vez de um corte seco.
 * - Saída: o conjunto dissolve com um leve zoom-out e desfoque, e ao
 *   mesmo tempo libera o site (evento "portfolio:reveal") para que o
 *   conteúdo faça um fade-in + rise coordenado.
 */
export function Welcome() {
  const [phase, setPhase] = useState<Phase>("hidden");

  useEffect(() => {
    const onLoaded = () => setPhase("showing");
    window.addEventListener("portfolio:loaded", onLoaded);
    return () => window.removeEventListener("portfolio:loaded", onLoaded);
  }, []);

  useEffect(() => {
    if (phase !== "showing") return;
    // Tempo visível antes de começar a sair
    const leaveTimer = window.setTimeout(() => setPhase("leaving"), 2600);
    return () => window.clearTimeout(leaveTimer);
  }, [phase]);

  useEffect(() => {
    if (phase !== "leaving") return;
    // Avisa o site para começar a entrar enquanto o Welcome ainda dissolve
    window.dispatchEvent(new Event("portfolio:reveal"));
    const doneTimer = window.setTimeout(() => setPhase("hidden"), 900);
    return () => window.clearTimeout(doneTimer);
  }, [phase]);

  if (phase === "hidden") return null;

  const words = MESSAGE.split(" ");

  return (
    <div
      role="status"
      aria-live="polite"
      className={`welcome ${phase === "leaving" ? "welcome--leaving" : ""}`}
    >
      <div className="welcome__inner">
        <span className="welcome__eyebrow">gustavo gomes</span>
        <h2 className="welcome__title">
          {words.map((word, i) => (
            <span key={i} className="welcome__word">
              <span style={{ animationDelay: `${0.25 + i * 0.08}s` }}>
                {word}
              </span>
              {i < words.length - 1 ? "\u00A0" : ""}
            </span>
          ))}
        </h2>
        <span className="welcome__line" aria-hidden />
      </div>
    </div>
  );
}

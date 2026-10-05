"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type StackGroup = {
  group: string;
  tagline?: string;
  description?: string;
  items: readonly string[];
};

type StackDeckProps = {
  groups: readonly StackGroup[];
};

/**
 * StackDeck — baralho de cartas animado.
 *
 * Cada grupo da stack é um card empilhado. Ao clicar (ou pressionar
 * Enter/Espaço), o card da frente "vai para trás": ele gira, encolhe e
 * desliza para o fundo do baralho, enquanto o próximo card sobe à frente.
 * A sensação é a de embaralhar cartas colocando a de cima para trás.
 *
 * A posição de cada card é derivada do seu índice relativo ao card ativo,
 * então a animação é puramente CSS (transições de transform/opacity),
 * fluida e sem reflow.
 */
export function StackDeck({ groups }: StackDeckProps) {
  const [active, setActive] = useState(0);
  const [leaving, setLeaving] = useState<number | null>(null);
  const timerRef = useRef<number | null>(null);
  const total = groups.length;

  const advance = useCallback(() => {
    if (total < 2) return;
    const current = active;
    setLeaving(current);
    setActive((prev) => (prev + 1) % total);
    if (timerRef.current) window.clearTimeout(timerRef.current);
    // Tempo da animação de saída do card que vai para trás
    timerRef.current = window.setTimeout(() => setLeaving(null), 620);
  }, [active, total]);

  useEffect(() => {
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, []);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      advance();
    }
  };

  return (
    <div className="stack-deck mt-12">
      <div
        className="stack-deck__stage"
        role="button"
        tabIndex={0}
        aria-label="Avançar para o próximo grupo da stack"
        onClick={advance}
        onKeyDown={onKeyDown}
      >
        {groups.map((group, i) => {
          // Posição relativa ao card ativo (0 = frente)
          const offset = (i - active + total) % total;
          const isLeaving = leaving === i;
          // Só empilha visualmente os primeiros cards; o resto fica oculto
          const depth = Math.min(offset, 3);
          const isFront = offset === 0;

          return (
            <article
              key={group.group}
              className={cn(
                "stack-card",
                isFront && "stack-card--front",
                isLeaving && "stack-card--leaving",
              )}
              style={
                {
                  "--offset": offset,
                  "--depth": depth,
                  zIndex: total - offset,
                } as React.CSSProperties
              }
              aria-hidden={!isFront}
            >
              <div className="stack-card__inner">
                {/* Cabeçalho: índice do grupo + contagem de ferramentas */}
                <header className="stack-card__head">
                  <span className="stack-card__num">
                    {String(i + 1).padStart(2, "0")}
                    <span className="stack-card__num-sep">/</span>
                    {String(total).padStart(2, "0")}
                  </span>
                  <span className="stack-card__count">
                    {String(group.items.length).padStart(2, "0")} ferramentas
                  </span>
                </header>

                {/* Bloco principal: tagline + título + descrição */}
                <div className="stack-card__body">
                  {group.tagline ? (
                    <span className="stack-card__tagline">{group.tagline}</span>
                  ) : null}
                  <h3 className="stack-card__title">{group.group}</h3>
                  {group.description ? (
                    <p className="stack-card__desc">{group.description}</p>
                  ) : null}
                </div>

                {/* Ferramentas */}
                <ul className="stack-card__items">
                  {group.items.map((item) => (
                    <li key={item}>
                      <span className="stack-tag">{item}</span>
                    </li>
                  ))}
                </ul>

                {/* Rodapé: dica de interação */}
                <footer className="stack-card__foot">
                  <span className="stack-card__hint" aria-hidden>
                    <span className="stack-card__hint-icon">↻</span>
                    clique para embaralhar
                  </span>
                </footer>
              </div>
            </article>
          );
        })}
      </div>

      {/* Indicador de progresso do baralho */}
      <div className="stack-deck__dots" aria-hidden>
        {groups.map((group, i) => (
          <span
            key={group.group}
            className={cn(
              "stack-deck__dot",
              i === active && "stack-deck__dot--active",
            )}
          />
        ))}
      </div>
    </div>
  );
}

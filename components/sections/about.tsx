"use client";

import { useRef } from "react";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { Manifesto } from "@/components/ui/manifesto";
import { PrincipleCard } from "@/components/ui/principle-card";
import { profile } from "@/lib/data";

const principles = [
  {
    num: "01",
    title: "Silêncio operacional",
    body: "Pipeline bom é o que ninguém percebe. Se o dado chegou na hora, o trabalho foi bem feito.",
  },
  {
    num: "02",
    title: "Contrato antes do código",
    body: "Schema, SLA e linhagem definidos primeiro. O resto é consequência de um bom contrato.",
  },
  {
    num: "03",
    title: "Observabilidade é feature",
    body: "Métrica, log e trace não são enfeite: são o que separa um pipeline de uma caixa preta.",
  },
];

export function About() {
  const sectionRef = useRef<HTMLElement>(null);

  const onMove = (e: React.MouseEvent<HTMLElement>) => {
    const el = sectionRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - rect.left}px`);
    el.style.setProperty("--my", `${e.clientY - rect.top}px`);
  };

  return (
    <section
      ref={sectionRef}
      id="sobre"
      onMouseMove={onMove}
      className="about border-t border-(--color-border) py-20 sm:py-28"
    >
      <span className="about__spotlight" aria-hidden />
      <span className="about__ghost" aria-hidden>
        01
      </span>

      <Container className="relative z-10">
        <Reveal variant="clip">
          <div className="flex items-center gap-3 text-(--color-muted-foreground)">
            <span className="section-index">01</span>
            <span aria-hidden className="h-px w-8 bg-(--color-border)" />
            <span className="section-index">Sobre</span>
          </div>
        </Reveal>

        {/* Manifesto — palavras acendem conforme o scroll */}
        <div className="mt-10 max-w-3xl">
          <Manifesto
            text="Dados como infraestrutura, não como destino. Construo o caminho invisível entre a fonte bruta e a decisão."
            accentWords={["infraestrutura", "invisível"]}
          />
        </div>

        <Reveal delay={120} className="mt-12 max-w-2xl">
          <p className="text-lg leading-relaxed text-(--color-muted-foreground)">
            {profile.longBio}
          </p>
          <p className="mt-6 text-lg leading-relaxed text-(--color-muted-foreground)">
            {profile.longBioExtra}
          </p>
        </Reveal>

        {/* Cards de princípios com tilt 3D */}
        <div className="mt-16 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {principles.map((p, i) => (
            <Reveal key={p.num} delay={i * 100}>
              <PrincipleCard num={p.num} title={p.title} body={p.body} />
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}

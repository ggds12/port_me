import { SectionNumber } from "@/components/ui/section-number";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { StackDeck } from "@/components/ui/stack-deck";
import { stack } from "@/lib/data";

export function Stack() {
  return (
    <Container
      as="section"
      id="stack"
      className="numbered-section border-t border-(--color-border) py-20 sm:py-28"
    >
      <SectionNumber value="02" />
      <Reveal variant="clip">
        <SectionHeading
          index="02"
          eyebrow="Stack"
          title="Ferramentas do ofício."
        />
      </Reveal>

      {/* Baralho de cartas — clique para passar o card da frente para trás */}
      <Reveal delay={80}>
        <StackDeck groups={stack} />
      </Reveal>
    </Container>
  );
}

import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { profile } from "@/lib/data";

export function About() {
  return (
    <Container
      as="section"
      id="sobre"
      className="border-t border-(--color-border) py-20 sm:py-28"
    >
      <Reveal>
        <SectionHeading
          index="01"
          eyebrow="Sobre"
          title={
            <>
              Dados como <em className="italic">infraestrutura</em>, não como
              destino.
            </>
          }
        />
      </Reveal>

      <Reveal delay={120} className="mt-10 max-w-2xl">
        <p className="text-lg leading-relaxed text-(--color-muted-foreground)">
          {profile.longBio}
        </p>
        <p className="mt-6 text-lg leading-relaxed text-(--color-muted-foreground)">
          {profile.longBioExtra}
        </p>
        <p className="mt-6 text-lg leading-relaxed text-(--color-muted-foreground)">
          Acredito que pipelines bons são{" "}
          <span className="text-(--color-foreground)">discretos</span>: fazem
          seu trabalho sem chamar atenção. É nesse silêncio operacional que
          tento construir.
        </p>
      </Reveal>
    </Container>
  );
}

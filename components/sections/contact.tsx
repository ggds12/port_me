import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { profile } from "@/lib/data";

const channels = [
  {
    label: "GitHub",
    handle: "@ggds12",
    href: profile.links.github,
  },
  {
    label: "LinkedIn",
    handle: "Gustavo Gomes",
    href: profile.links.linkedin,
  },
  {
    label: "Instagram",
    handle: "@gugomes_______",
    href: profile.links.instagram,
  },
];

export function Contact() {
  return (
    <Container
      as="section"
      id="contato"
      className="border-t border-(--color-border) py-20 sm:py-28"
    >
      <Reveal>
        <SectionHeading
          index="05"
          eyebrow="Contato"
          title={
            <>
              Vamos <em className="italic">conversar</em>.
            </>
          }
        />
      </Reveal>

      <Reveal delay={120} className="mt-8 max-w-xl">
        <p className="text-lg leading-relaxed text-(--color-muted-foreground)">
          Aberto a trocas sobre engenharia de dados, ingestão em larga escala,
          BigQuery e Airflow, ou só para um café.
        </p>
      </Reveal>

      <ul className="mt-12 divide-y divide-(--color-border) border-y border-(--color-border)">
        {channels.map((c, idx) => (
          <Reveal as="li" key={c.label} delay={idx * 90}>
            <a
              href={c.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-between gap-6 py-5 transition-colors hover:text-(--color-foreground)"
            >
              <span className="font-serif text-2xl tracking-(--tracking-tighter) sm:text-3xl">
                {c.label}
              </span>
              <span className="flex items-center gap-4 font-mono text-sm tracking-(--tracking-mono) text-(--color-muted-foreground)">
                <span className="hidden sm:inline">{c.handle}</span>
                <span
                  aria-hidden
                  className="inline-block transition-transform group-hover:translate-x-1"
                >
                  →
                </span>
              </span>
            </a>
          </Reveal>
        ))}
      </ul>
    </Container>
  );
}

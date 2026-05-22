import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { experience } from "@/lib/data";

export function Experience() {
  return (
    <Container
      as="section"
      id="experiencia"
      className="border-t border-(--color-border) py-20 sm:py-28"
    >
      <Reveal>
        <SectionHeading
          index="03"
          eyebrow="Experiência"
          title="Onde os dados se movem."
        />
      </Reveal>

      <ol className="mt-12 flex flex-col gap-12">
        {experience.map((job, idx) => (
          <Reveal as="li" key={job.company + job.role} delay={idx * 100}>
            <article className="grid grid-cols-1 gap-6 sm:grid-cols-[160px_1fr] sm:gap-8">
              <div className="section-index pt-1">{job.period}</div>
              <div>
                <h3 className="font-serif text-2xl tracking-(--tracking-tighter)">
                  {job.role}
                  <span className="text-(--color-muted-foreground)">
                    {" "}
                    · {job.company}
                  </span>
                </h3>
                <p className="mt-3 max-w-xl text-base leading-relaxed text-(--color-muted-foreground)">
                  {job.summary}
                </p>
                <ul className="mt-5 flex flex-col gap-2 text-sm text-(--color-muted-foreground)">
                  {job.highlights.map((h) => (
                    <li key={h} className="flex gap-3">
                      <span
                        aria-hidden
                        className="mt-2.5 inline-block size-1 shrink-0 rounded-full bg-(--color-accent)"
                      />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          </Reveal>
        ))}
      </ol>
    </Container>
  );
}

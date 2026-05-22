import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { projects, profile } from "@/lib/data";

type Project = (typeof projects)[number];

function ProjectCard({ project }: { project: Project }) {
  return (
    <a
      href={project.href}
      target="_blank"
      rel="noopener noreferrer"
      className="marquee__card group relative flex w-[18rem] shrink-0 flex-col rounded-lg border border-(--color-border) bg-(--color-background) p-6 transition-colors hover:border-(--color-foreground)/30 sm:w-[22rem] sm:p-7"
    >
      <span
        aria-hidden
        className="absolute left-6 top-6 size-1.5 rounded-full bg-(--color-accent) sm:left-7 sm:top-7"
      />
      <h3 className="mt-6 font-serif text-xl tracking-(--tracking-tighter) sm:text-2xl">
        <span className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1px] bg-[position:0_100%] bg-no-repeat transition-[background-size] duration-500 ease-out group-hover:bg-[length:100%_1px]">
          {project.title}
        </span>
      </h3>
      <p className="mt-4 line-clamp-5 max-w-[44ch] text-sm leading-relaxed text-(--color-muted-foreground)">
        {project.description}
      </p>
      <ul className="mt-6 flex flex-wrap gap-x-3 gap-y-1.5 font-mono text-[0.7rem] tracking-(--tracking-mono) text-(--color-muted-foreground)">
        {project.tags.map((tag) => (
          <li key={tag}>{tag}</li>
        ))}
      </ul>
      <span className="mt-auto inline-flex items-center gap-2 pt-6 text-xs text-(--color-foreground)">
        <span className="font-mono tracking-(--tracking-mono)">GitHub</span>
        <span
          aria-hidden
          className="transition-transform group-hover:translate-x-0.5"
        >
          →
        </span>
      </span>
    </a>
  );
}

export function Projects() {
  return (
    <section
      id="projetos"
      className="border-t border-(--color-border) py-20 sm:py-28"
    >
      <Container>
        <Reveal>
          <div className="flex items-end justify-between gap-6">
            <SectionHeading
              index="04"
              eyebrow="Projetos"
              title="O que costumo construir."
            />
            <p
              aria-hidden
              className="hidden font-mono text-xs tracking-(--tracking-mono) text-(--color-muted-foreground) sm:block"
            >
              pause no hover ↘
            </p>
          </div>
        </Reveal>
      </Container>

      <Reveal delay={120} className="mt-12">
        <div
          className="marquee"
          role="region"
          aria-roledescription="carousel"
          aria-label="Projetos em destaque"
        >
          <ul className="marquee__track" role="list">
            {projects.map((project) => (
              <li key={project.title} className="marquee__item">
                <ProjectCard project={project} />
              </li>
            ))}
            {/* Visual duplicate for seamless loop — hidden from a11y tree */}
            {projects.map((project) => (
              <li
                key={`dup-${project.title}`}
                className="marquee__item"
                // @ts-expect-error — inert is valid HTML but missing from older React types
                inert=""
                aria-hidden="true"
              >
                <ProjectCard project={project} />
              </li>
            ))}
          </ul>
        </div>
      </Reveal>

      <Container>
        <Reveal delay={200} className="mt-12 text-sm">
          <a
            href={profile.links.github}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-(--color-muted-foreground) underline-offset-4 hover:text-(--color-foreground) hover:underline"
          >
            Ver todos os repositórios
            <span aria-hidden>→</span>
          </a>
        </Reveal>
      </Container>
    </section>
  );
}

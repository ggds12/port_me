import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";

export function CvCta() {
  return (
    <Container
      as="section"
      id="curriculo"
      className="border-t border-(--color-border) py-20 sm:py-28"
    >
      <Reveal>
        <div className="grid grid-cols-1 items-end gap-10 sm:grid-cols-[1fr_auto]">
          <div className="max-w-xl">
            <div className="flex items-center gap-3 text-(--color-muted-foreground)">
              <span
                aria-hidden
                className="h-px w-8 bg-(--color-accent)"
              />
              <span className="section-index">Currículo</span>
            </div>

            <h2 className="mt-4 font-serif text-3xl tracking-(--tracking-tighter) sm:text-4xl">
              Uma versão para <em className="italic">imprimir</em>.
            </h2>

            <p className="mt-4 text-base leading-relaxed text-(--color-muted-foreground) sm:text-lg">
              Mesmo trabalho, em um único papel, com formação, certificações e
              os detalhes que não cabem nesta página.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 sm:flex-col sm:items-stretch">
            <Link
              href="/cv"
              className="group inline-flex items-center justify-between gap-3 rounded-full border border-(--color-foreground) bg-(--color-foreground) px-5 py-2.5 text-sm text-(--color-background) transition-colors hover:bg-transparent hover:text-(--color-foreground)"
            >
              <span>Ver currículo</span>
              <span
                aria-hidden
                className="transition-transform group-hover:translate-x-0.5"
              >
                →
              </span>
            </Link>
            <a
              href="/gustavo-gomes-cv.pdf"
              download
              className="inline-flex items-center justify-between gap-3 rounded-full border border-(--color-border) px-5 py-2.5 font-mono text-xs tracking-(--tracking-mono) text-(--color-muted-foreground) transition-colors hover:border-(--color-foreground)/30 hover:text-(--color-foreground)"
            >
              <span>baixar pdf</span>
              <span aria-hidden>↓</span>
            </a>
          </div>
        </div>
      </Reveal>
    </Container>
  );
}

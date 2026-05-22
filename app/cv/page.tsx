import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { ThemeToggle } from "@/components/theme-toggle";
import { profile } from "@/lib/data";
import { cv } from "@/lib/cv-data";

export const metadata: Metadata = {
  title: "Currículo",
  description: `Currículo de ${profile.name}, ${profile.role} ${profile.seniority}`,
};

function SectionRow({
  index,
  eyebrow,
  children,
}: {
  index: string;
  eyebrow: string;
  children: React.ReactNode;
}) {
  return (
    <section className="grid grid-cols-1 gap-6 border-t border-(--color-border) py-10 sm:grid-cols-[100px_1fr] sm:gap-10">
      <header className="flex flex-col gap-1">
        <span className="section-index">{index}</span>
        <span className="section-index">{eyebrow}</span>
      </header>
      <div>{children}</div>
    </section>
  );
}

export default function CVPage() {
  return (
    <>
      {/* Slim top bar — distinct from portfolio nav but consistent */}
      <header
        className="sticky top-0 z-30 border-b border-(--color-border)/60 bg-(--color-background)/80 backdrop-blur-md print:hidden"
        role="banner"
      >
        <Container className="flex h-14 items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 font-mono text-sm tracking-(--tracking-mono) text-(--color-muted-foreground) transition-colors hover:text-(--color-foreground)"
          >
            <span aria-hidden>←</span>
            <span>portfolio</span>
          </Link>

          <div className="flex items-center gap-3">
            <a
              href={cv.pdfHref}
              download
              className="inline-flex items-center gap-2 rounded-full border border-(--color-border) px-4 py-1.5 font-mono text-xs tracking-(--tracking-mono) text-(--color-muted-foreground) transition-colors hover:border-(--color-foreground)/30 hover:text-(--color-foreground)"
            >
              <span>baixar pdf</span>
              <span aria-hidden>↓</span>
            </a>
            <ThemeToggle />
          </div>
        </Container>
      </header>

      <main id="main" className="pb-24 print:pb-0">
        <Container as="article" className="pt-16 sm:pt-24">
          {/* Top utility row — matches PDF */}
          <div className="mb-8 flex items-center justify-between font-mono text-xs tracking-(--tracking-mono) text-(--color-muted-foreground)">
            <span>GG</span>
            <span>CV · 01 / 01</span>
          </div>

          {/* Hero of the CV */}
          <header className="relative">
            <span
              aria-hidden
              className="absolute -left-3 top-3 size-1.5 rounded-full bg-(--color-accent) sm:-left-4"
            />
            <h1 className="font-serif text-5xl leading-[1.05] tracking-(--tracking-tightest) sm:text-6xl">
              {profile.name}
            </h1>
            <p className="mt-3 font-serif text-xl italic text-(--color-muted-foreground) sm:text-2xl">
              engenheiro de dados
            </p>

            <p className="mt-8 max-w-xl text-balance text-base italic leading-relaxed text-(--color-foreground) sm:text-lg">
              {profile.bio}
            </p>

            <div className="mt-6 flex items-center gap-4 text-(--color-muted-foreground)">
              <a
                href={profile.links.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="transition-colors hover:text-(--color-foreground)"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="size-5" aria-hidden>
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
                </svg>
              </a>
              <a
                href={profile.links.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="transition-colors hover:text-(--color-foreground)"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="size-5" aria-hidden>
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
              <span className="font-mono text-xs tracking-(--tracking-mono)">Brasil</span>
            </div>
          </header>

          <div className="mt-16">
            <SectionRow index="01" eyebrow="STACK">
              <dl className="flex flex-col gap-4">
                {cv.stack.map((g) => (
                  <div
                    key={g.label}
                    className="grid grid-cols-1 gap-2 sm:grid-cols-[140px_1fr]"
                  >
                    <dt className="text-sm text-(--color-muted-foreground)">
                      {g.label}
                    </dt>
                    <dd className="font-mono text-sm tracking-(--tracking-mono) text-(--color-foreground)">
                      {g.items.join("   ·   ")}
                    </dd>
                  </div>
                ))}
              </dl>
            </SectionRow>

            <SectionRow index="02" eyebrow="ROLES">
              {cv.roles.map((role) => (
                <article key={role.company} className="flex flex-col">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
                    <h2 className="font-serif text-2xl tracking-(--tracking-tighter) sm:text-3xl">
                      {role.title}
                    </h2>
                    <span className="font-mono text-sm tracking-(--tracking-mono) text-(--color-muted-foreground)">
                      {role.period}
                    </span>
                  </div>
                  <p className="mt-1 font-mono text-xs tracking-(--tracking-mono) text-(--color-muted-foreground)">
                    {role.company.toUpperCase()}
                  </p>
                  <p className="mt-4 text-base leading-relaxed text-(--color-foreground)">
                    {role.summary}
                  </p>
                  <ul className="mt-5 flex flex-col gap-3">
                    {role.highlights.map((h) => (
                      <li key={h} className="flex gap-3 text-base leading-relaxed">
                        <span
                          aria-hidden
                          className="mt-3 inline-block h-px w-3 shrink-0 bg-(--color-accent)"
                        />
                        <span className="text-(--color-foreground)">{h}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </SectionRow>

            <SectionRow index="03" eyebrow="EDU">
              {cv.education.map((e) => (
                <article key={e.title}>
                  <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
                    <h2 className="font-serif text-xl tracking-(--tracking-tighter) sm:text-2xl">
                      {e.title}
                    </h2>
                    <span className="font-mono text-sm tracking-(--tracking-mono) text-(--color-muted-foreground)">
                      {e.period}
                    </span>
                  </div>
                  <p className="mt-2 text-sm italic text-(--color-muted-foreground)">
                    {e.institution}
                  </p>
                </article>
              ))}
            </SectionRow>

          </div>

          <footer className="mt-16 border-t border-(--color-border) pt-6 font-mono text-xs tracking-(--tracking-mono) text-(--color-muted-foreground)">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span>Quiet Engineer, composto em A4</span>
              <span>Instrument Serif · Sans · Geist Mono</span>
            </div>
          </footer>
        </Container>
      </main>
    </>
  );
}

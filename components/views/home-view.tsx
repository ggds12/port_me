import type { CSSProperties } from "react";
import { profile, projects, stack } from "@/lib/data";
import { getDict, prefix, LOCALES, type Locale } from "@/lib/i18n";
import { Nav } from "@/components/site/nav";
import { Intro } from "@/components/site/intro";
import { Petals } from "@/components/site/petals";
import { Reveal } from "@/components/site/reveal";
import { Signature } from "@/components/site/signature";
import { TrainScene } from "@/components/site/train-scene";
import { W, Chip, Hand, TechIcon } from "@/components/site/inline";
import { Rich } from "@/components/site/rich";
import { DagVisual, GoVisual, BeamVisual, GovVisual, CatalogVisual } from "@/components/site/project-visuals";

const palette = [
  { bg: "#0b63c9", bg2: "#0a3f86" },
  { bg: "#0f8fae", bg2: "#0b4f66" },
  { bg: "#e0623a", bg2: "#9c3519" },
  { bg: "#2f8f55", bg2: "#17542f" },
  { bg: "#6b5ce7", bg2: "#3a2f9b" },
];

const education = [
  { name: "São Judas", logo: "/logos/usjt.png", years: "2024 – 2027" },
  { name: "ETEC", logo: "/logos/etec.png", years: "2020 – 2021" },
];

export const Arrow = () => (
  <svg className="arrow" width="11" height="11" viewBox="0 0 24 24" aria-hidden="true">
    <path fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" d="M7 17 17 7M8 7h9v9" />
  </svg>
);
export const Down = () => (
  <svg className="arrow" width="11" height="11" viewBox="0 0 24 24" aria-hidden="true">
    <path fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" d="M12 4v15M6 13l6 6 6-6" />
  </svg>
);

export function HomeView({ locale }: { locale: Locale }) {
  const t = getDict(locale);
  const base = prefix(locale);
  const year = new Date().getFullYear();
  const visuals = [
    <DagVisual key="dag" t={t.visuals} />,
    <GoVisual key="go" t={t.visuals} />,
    <BeamVisual key="beam" t={t.visuals} n={t.numberLocale} />,
    <GovVisual key="gov" t={t.visuals} />,
    <CatalogVisual key="cat" t={t.visuals} />,
  ];
  const langHrefs = Object.fromEntries(LOCALES.map((l) => [l, prefix(l) || "/"])) as Record<Locale, string>;

  return (
    <div className="site" id="top">
      <a href="#main" className="skip-link">
        {t.skip}
      </a>
      <Petals />
      <div className="rays dim" aria-hidden="true">
        <div className="rays-beams" />
        <div className="rays-glow" />
        <i className="bokeh b1" />
        <i className="bokeh b2" />
        <i className="bokeh b3" />
      </div>

      <Nav
        locale={locale}
        langHrefs={langHrefs}
        labels={t.nav}
        logoHref="#top"
        links={[
          { href: "#projects", label: t.nav.projects },
          { href: "#experience", label: t.nav.experience },
          { href: "#stack", label: t.nav.stack },
          { href: `${base}/cv`, label: t.nav.cv },
        ]}
      />
      <Reveal />
      <Intro labels={t.intro} />

      <main id="main" className="col">
        {/* ------------------------------ HERO ------------------------------ */}
        <section className="hero" aria-labelledby="hero-title">
          <h1 id="hero-title" className="sr-only">
            {profile.name} — {t.role}
          </h1>
          <Signature text="Gustavo Gomes" width={330} height={80} fontSize={46} drawn className="hero-sig" />
          <p className="greet">
            <W>{t.hero.greet}</W> <span className="wave w">👋</span>
          </p>

          <div className="hero-copy">
            {t.hero.bio.map((p, i) => (
              <p key={i}>
                <Rich
                  tokens={p}
                  hrefs={{ experience: "#experience", cv: `${base}/cv`, github: profile.links.github }}
                />
              </p>
            ))}
          </div>
        </section>

        <div className="dim">
          {/* ---------------------------- PROJETOS ---------------------------- */}
          <section className="block" id="projects" aria-labelledby="proj-title">
            <div className="block-head">
              <h2 id="proj-title">{t.projects.title}</h2>
              <a className="see-all" href={profile.links.github} target="_blank" rel="noopener noreferrer">
                {t.projects.seeAll}
              </a>
            </div>

            <div className="projects">
              {projects.map((p, i) => {
                const item = t.projects.items[i];
                return (
                  <article className="project" key={p.href + i} data-reveal="">
                    <a
                      className="project-card"
                      href={p.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${item.name} — ${t.projects.viewRepo}`}
                      style={{ "--bg": palette[i].bg, "--bg2": palette[i].bg2 } as CSSProperties}
                    >
                      <span className="project-pill">
                        GitHub <Arrow />
                      </span>
                      <span className="project-num">0{i + 1}</span>
                      <div className="project-shot" aria-hidden="true">
                        {visuals[i]}
                      </div>
                    </a>
                    <div className="project-meta">
                      <h3>{item.name}</h3>
                      <p>{item.description}</p>
                      <ul className="tags" aria-label={t.projects.tech}>
                        {p.tags.map((tag) => (
                          <li key={tag}>
                            <TechIcon name={tag} size={11} />
                            {tag}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>

          {/* --------------------------- EXPERIÊNCIA --------------------------- */}
          <section className="block" id="experience" aria-labelledby="exp-title">
            <div className="block-head" data-reveal="">
              <h2 id="exp-title">{t.experience.title}</h2>
            </div>
            <ul className="timeline" data-reveal="">
              <li>
                <details>
                  <summary>
                    <span className="tl-logo" aria-hidden="true">
                      <img src="/logos/onr.png" alt="" width={16} height={16} />
                    </span>
                    <span className="tl-name">ONR</span>
                    <span className="tl-role">{t.role}</span>
                    <span className="tl-date">2024 – 2026</span>
                    <span className="tl-plus" aria-hidden="true" />
                  </summary>
                  <div className="tl-body">
                    <p>{t.experience.summary}</p>
                    <ul>
                      {t.experience.highlights.map((h) => (
                        <li key={h}>{h}</li>
                      ))}
                    </ul>
                  </div>
                </details>
              </li>
            </ul>
          </section>

          {/* ----------------------- FORMAÇÃO ACADÊMICA ----------------------- */}
          <section className="block" id="education" aria-labelledby="edu-title">
            <div className="block-head" data-reveal="">
              <h2 id="edu-title">{t.education.title}</h2>
            </div>
            <EducationList titles={t.education.items} />
          </section>

          {/* ------------------------------ STACK ------------------------------ */}
          <section className="block" id="stack" aria-labelledby="stack-title">
            <div className="block-head" data-reveal="">
              <h2 id="stack-title">{t.stack.title}</h2>
              <span className="block-note">
                <Hand>{t.stack.note}</Hand>
              </span>
            </div>
            <div className="stack">
              {stack.map((g, i) => (
                <div className="stack-row" key={g.group} data-reveal="">
                  <div className="stack-label">
                    <h3>{t.stack.groups[i].group}</h3>
                    <p>{t.stack.groups[i].tagline}</p>
                  </div>
                  <div className="stack-chips">
                    {g.items.map((it) => (
                      <Chip key={it} name={it} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ----------------------------- CONTATO ----------------------------- */}
          <section className="block contact" id="contact" aria-labelledby="contact-title" data-reveal="">
            <h2 id="contact-title">
              {t.contact.before && <>{t.contact.before} </>}
              <Hand>{t.contact.hand}</Hand>
            </h2>
            <p>{t.contact.text}</p>
            <div className="contact-links">
              <a className="btn" href={profile.links.linkedin} target="_blank" rel="noopener noreferrer">
                LinkedIn <Arrow />
              </a>
              <a className="btn" href="https://wa.me/5511936184114" target="_blank" rel="noopener noreferrer">
                WhatsApp <Arrow />
              </a>
              <a className="btn ghost" href="/gustavo-gomes-cv.pdf" download="Gustavo-Gomes-Curriculo.pdf">
                {t.contact.download} <Down />
              </a>
            </div>
          </section>

          <div className="foot-line" data-reveal="">
            <svg viewBox="0 0 600 8" preserveAspectRatio="none" aria-hidden="true">
              <path pathLength={1} d="M0 5 C 120 2, 260 7, 380 4 S 540 3, 600 5" />
            </svg>
            <div>
              <Signature text="gustavo" width={110} height={40} fontSize={26} label={t.footer.signature} />
              <a className="u" href={profile.links.github} target="_blank" rel="noopener noreferrer">
                github.com/ggds12
              </a>
            </div>
          </div>
        </div>
      </main>

      {/* ------------------------- RODAPÉ COM O TREM ------------------------- */}
      <footer className="scene dim">
        <TrainScene className="scene-canvas" label={t.footer.train} />
        <div className="scene-fade" aria-hidden="true" />
        <div className="scene-bar">
          <span>
            {profile.name} © {year}
          </span>
          <Signature text="Gustavo Gomes" width={210} height={48} fontSize={28} className="scene-sig" />
          <nav aria-label={t.footer.socials}>
            <a href={profile.links.linkedin} target="_blank" rel="noopener noreferrer">
              LinkedIn
            </a>
            <a href={profile.links.github} target="_blank" rel="noopener noreferrer">
              GitHub
            </a>
            <a href={profile.links.instagram} target="_blank" rel="noopener noreferrer">
              Instagram
            </a>
          </nav>
        </div>
      </footer>
    </div>
  );
}

/** Lista de formação (usada na home e no currículo). */
export function EducationList({ titles }: { titles: string[] }) {
  return (
    <ul className="timeline" data-reveal="">
      {education.map((e, i) => (
        <li key={e.name}>
          <div className="tl-row">
            <span className="tl-logo" aria-hidden="true">
              <img src={e.logo} alt="" width={16} height={16} />
            </span>
            <span className="tl-name">{e.name}</span>
            <span className="tl-role">{titles[i]}</span>
            <span className="tl-date">{e.years}</span>
          </div>
        </li>
      ))}
    </ul>
  );
}

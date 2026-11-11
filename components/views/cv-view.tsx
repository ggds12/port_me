import { profile } from "@/lib/data";
import { cv } from "@/lib/cv-data";
import { getDict, prefix, LOCALES, type Locale } from "@/lib/i18n";
import { Nav } from "@/components/site/nav";
import { Petals } from "@/components/site/petals";
import { Reveal } from "@/components/site/reveal";
import { Signature } from "@/components/site/signature";
import { Chip, Hand } from "@/components/site/inline";
import { Arrow, Down, EducationList } from "./home-view";

export function CvView({ locale }: { locale: Locale }) {
  const t = getDict(locale);
  const home = prefix(locale) || "/";
  const langHrefs = Object.fromEntries(LOCALES.map((l) => [l, `${prefix(l)}/cv`])) as Record<Locale, string>;

  return (
    <div className="site cv">
      <a href="#main" className="skip-link">
        {t.skip}
      </a>
      <Petals />
      <div className="rays dim" aria-hidden="true">
        <div className="rays-beams" />
        <div className="rays-glow" />
      </div>

      <Nav
        locale={locale}
        langHrefs={langHrefs}
        labels={t.nav}
        logoHref={home}
        links={[
          { href: home, label: t.nav.home },
          { href: `${prefix(locale)}/#projects`, label: t.nav.projects },
          { href: cv.pdfHref, label: t.nav.downloadPdf, download: "Gustavo-Gomes-Curriculo.pdf" },
        ]}
      />
      <Reveal />

      <main id="main" className="col">
        {/* ----------------------------- TOPO ----------------------------- */}
        <header className="hero cv-hero">
          <p className="cv-kicker">{t.cv.kicker}</p>
          <h1 className="sr-only">{profile.name}</h1>
          <Signature text="Gustavo Gomes" width={330} height={80} fontSize={46} drawn className="hero-sig" />
          <p className="cv-role">
            {t.role} · {t.location}
            <span className="open">
              <i />
              {t.cv.open}
            </span>
          </p>
          <p className="cv-summary">{t.cv.summary}</p>
          <div className="contact-links">
            <a className="btn" href={cv.pdfHref} download="Gustavo-Gomes-Curriculo.pdf">
              {t.cv.downloadPdf} <Down />
            </a>
            <a className="btn ghost" href={profile.links.linkedin} target="_blank" rel="noopener noreferrer">
              LinkedIn <Arrow />
            </a>
            <a className="btn ghost" href={profile.links.github} target="_blank" rel="noopener noreferrer">
              GitHub <Arrow />
            </a>
          </div>
        </header>

        {/* -------------------------- EXPERIÊNCIA -------------------------- */}
        <section className="block" aria-labelledby="cv-exp">
          <div className="block-head" data-reveal="">
            <h2 id="cv-exp">{t.experience.title}</h2>
          </div>
          <article className="cv-job" data-reveal="">
            <div className="tl-row cv-job-head">
              <span className="tl-logo" aria-hidden="true">
                <img src="/logos/onr.png" alt="" width={16} height={16} />
              </span>
              <span className="tl-name">ONR</span>
              <span className="tl-role">{t.role}</span>
              <span className="tl-date">2024 – 2026</span>
            </div>
            <div className="cv-job-body">
              <p>{t.cv.jobSummary}</p>
              <ul>
                {t.cv.highlights.map((h) => (
                  <li key={h}>{h}</li>
                ))}
              </ul>
            </div>
          </article>
        </section>

        {/* ----------------------- FORMAÇÃO ACADÊMICA ----------------------- */}
        <section className="block" aria-labelledby="cv-edu">
          <div className="block-head" data-reveal="">
            <h2 id="cv-edu">{t.education.title}</h2>
          </div>
          <EducationList titles={t.education.items} />
        </section>

        {/* -------------------------- COMPETÊNCIAS -------------------------- */}
        <section className="block" aria-labelledby="cv-skills">
          <div className="block-head" data-reveal="">
            <h2 id="cv-skills">{t.cv.skillsTitle}</h2>
            <span className="block-note">
              <Hand>{t.cv.skillsNote}</Hand>
            </span>
          </div>
          <div className="stack">
            {cv.stack.map((g, i) => (
              <div className="stack-row" key={g.label} data-reveal="">
                <div className="stack-label">
                  <h3>{t.cv.skillGroups[i]}</h3>
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

        <div className="foot-line cv-foot" data-reveal="">
          <svg viewBox="0 0 600 8" preserveAspectRatio="none" aria-hidden="true">
            <path pathLength={1} d="M0 5 C 120 2, 260 7, 380 4 S 540 3, 600 5" />
          </svg>
          <div>
            <Signature text="gustavo" width={110} height={40} fontSize={26} label={t.footer.signature} />
            <a className="u" href={home}>
              {t.cv.back}
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}

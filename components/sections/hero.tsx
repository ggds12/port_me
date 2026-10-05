import { ArchitectureScene } from "@/components/ui/architecture-scene";
import { SectionNumber } from "@/components/ui/section-number";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { profile } from "@/lib/data";

export function Hero() {
  return (
    <section id="top" className="portfolio-hero numbered-section" aria-labelledby="hero-title">
      <SectionNumber value="00" />
      <Container className="relative py-16 sm:py-24">
        <div className="hero-layout">
          <div>
            <p className="availability"><span aria-hidden />Aberto a novas oportunidades</p>
            <p className="hero-identity">{profile.name} / {profile.role}</p>
            <h1 id="hero-title" className="hero-headline">Transformo dados<br />em <em>possibilidades.</em></h1>
            <p className="hero-description">Construo pipelines e plataformas que conectam fontes, organizam informação e entregam dados confiáveis para decisões de negócio.</p>
            <div className="hero-cta">
              <Link href="#projetos" className="btn btn--primary">Explorar projetos <span aria-hidden className="btn__arrow">↗</span></Link>
              <Link href="/cv" className="btn btn--ghost">Ver currículo <span aria-hidden>↓</span></Link>
            </div>
            <a className="hero-link link-underline" href={profile.links.linkedin} target="_blank" rel="noopener noreferrer">Vamos conversar no LinkedIn ↗</a>
          </div>
          <ArchitectureScene />
        </div>
        <div className="hero-specialties" aria-label="Especialidades em engenharia de dados">
          <a href="#projetos" className="hero-specialty">
            <span className="specialty-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 4v5c0 2 2 3 4 3h6c2 0 4 1 4 3v5M19 4v5c0 2-2 3-4 3H9c-2 0-4 1-4 3v5" /><circle cx="5" cy="3" r="2" /><circle cx="19" cy="3" r="2" /><circle cx="5" cy="21" r="2" /><circle cx="19" cy="21" r="2" /></svg></span>
            <div><h2>Conectar.</h2><p>Da fonte ao pipeline.</p></div><span className="specialty-arrow" aria-hidden="true">↗</span>
          </a>
          <a href="#stack" className="hero-specialty">
            <span className="specialty-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3 9 5-9 5-9-5 9-5Zm-9 9 9 5 9-5M3 16l9 5 9-5" /></svg></span>
            <div><h2>Transformar.</h2><p>Dados com estrutura e propósito.</p></div><span className="specialty-arrow" aria-hidden="true">↗</span>
          </a>
          <a href="#experiencia" className="hero-specialty">
            <span className="specialty-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18M7 15l5-5 4 3 5-8M17 5h4v4" /></svg></span>
            <div><h2>Dar significado.</h2><p>Informação pronta para decidir.</p></div><span className="specialty-arrow" aria-hidden="true">↗</span>
          </a>
        </div>
      </Container>
    </section>
  );
}

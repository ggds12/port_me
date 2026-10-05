import { SectionNumber } from "@/components/ui/section-number";
import type { CSSProperties } from "react";
import { Container } from "@/components/ui/container";
import { projects, profile } from "@/lib/data";

const categories = ["ORQUESTRAÇÃO", "INGESTÃO", "PROCESSAMENTO", "GOVERNANÇA", "DESCOBERTA"];
const captions = ["BRONZE → SILVER → GOLD", "SOURCE → WORKERS → LAKE", "EXTRACT / TRANSFORM / LOAD", "TRACE EVERY CONNECTION", "FIND THE SIGNAL"];

function ProjectGroup({ duplicate = false }: { duplicate?: boolean }) {
  return (
    <ul className="work-belt-group" aria-hidden={duplicate || undefined}>
      {projects.map((project, index) => (
        <li key={project.title} className="work-slide">
          <a href={project.href} target="_blank" rel="noopener noreferrer" tabIndex={duplicate ? -1 : undefined} className="work-card" data-tone={index}>
            <div className="work-card-label"><span>{categories[index]}</span><span>0{index + 1}</span></div>
            <div className={`work-art work-art--${index}`} aria-hidden="true">
              <div className="art-grid" /><div className="art-core"><span>DATA</span><b>{project.tags[1]}</b></div>
              {Array.from({ length: 6 }, (_, n) => <i key={n} style={{ "--i": n } as CSSProperties} />)}
              <span className="art-caption">{captions[index]}</span>
            </div>
            <div className="work-card-content">
              <h3>{project.title}</h3><p>{project.description}</p>
              <ul>{project.tags.map(tag => <li key={tag}>{tag}</li>)}</ul>
              <div className="work-card-cta"><span>Conheça o projeto</span><span aria-hidden>↗</span></div>
            </div>
          </a>
        </li>
      ))}
    </ul>
  );
}

export function Projects() {
  return (
    <section id="projetos" className="work-section numbered-section" aria-labelledby="projects-title">
      <SectionNumber value="04" />
      <Container><div className="work-heading"><div><p className="work-eyebrow">04 / PROJETOS SELECIONADOS</p><h2 id="projects-title">Engenharia em <em>movimento.</em></h2></div><p>Da ingestão à descoberta.<br />Explore os projetos e suas arquiteturas.</p></div></Container>
      <div className="work-belt" role="region" aria-label="Projetos selecionados">
        <div className="work-belt-track"><ProjectGroup /><ProjectGroup duplicate /></div>
      </div>
      <Container><a href={profile.links.github} target="_blank" rel="noopener noreferrer" className="work-all link-underline">Todos os projetos no GitHub ↗</a></Container>
    </section>
  );
}

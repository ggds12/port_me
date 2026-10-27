import Link from "next/link";
import { StackExplorer } from "@/components/stack-explorer";
import { profile, projects, experience } from "@/lib/data";

const Arrow = () => <span aria-hidden="true">↗</span>;
const flows = [["DAGs", "Airflow", "BigQuery"], ["Fontes", "Workers", "Parquet"], ["APIs / JDBC", "Beam", "Dataflow"], ["Metadados", "Dataplex", "Linhagem"], ["Datasets", "Catálogo", "Consulta"]];
const titles = ["Orquestração em escala", "Ingestão paralela em Go", "Pipelines no Dataflow", "Governança & linhagem", "Catálogo de dados"];

export default function HomePage() {
  return (
    <div className="portfolio" id="top">
      <header className="navigation wrap">
        <a className="wordmark" href="#top" aria-label="Gustavo Gomes, início">gg</a>
        <nav aria-label="Navegação principal"><a href="#sobre">Sobre</a><a href="#projetos">Projetos</a><a href="#stack">Stack</a><a className="nav-cv" href="/gustavo-gomes-cv.pdf" download="Gustavo-Gomes-Curriculo.pdf">Currículo <span aria-hidden="true">↓</span></a></nav>
        <a className="nav-contact" href="#contato">Contato <Arrow /></a>
      </header>
      <main id="main">
        <section className="hero hero-dark" aria-labelledby="hero-title">
          <div className="hero-art" aria-hidden="true">
            <div className="hero-mesh" />
            <div className="hero-sphere">{Array.from({length: 16}, (_, i) => <div className="sphere-ring" key={i} style={{transform: `rotateY(${i * 11.25}deg)`}} />)}<div className="sphere-equator" /><div className="sphere-equator equator-two" /></div>
            <div className="hero-streams">{Array.from({length: 9}, (_, i) => <i key={i} style={{top: `${8 + i * 10}%`, animationDelay: `${i * -1.7}s`, animationDuration: `${9 + i % 4}s`}} />)}</div>
            <div className="hero-shade" />
          </div>
          <div className="wrap hero-content">
          <div className="eyebrow hero-kicker"><span><i /> GUSTAVO GOMES</span><span>ENGENHEIRO DE DADOS / BRASIL</span></div>
          <h1 id="hero-title">Gustavo Gomes.<br /><span>Engenheiro de dados.</span></h1>
          <div className="hero-bottom"><p>Desenvolvo pipelines de ingestão e transformação<br className="desktop-break" /> de dados com Go, Python e SQL.<br />Trabalho com Airflow, Dataflow e Google Cloud.</p><a className="button" href="#projetos">Ver projetos <span>↓</span></a><span className="hero-note eyebrow">INGESTÃO / TRANSFORMAÇÃO<br />ORQUESTRAÇÃO / OBSERVABILIDADE</span></div>
          <div className="hero-foot eyebrow"><span>PORTFÓLIO PROFISSIONAL</span><a href="#sobre">SOBRE MIM ↓</a></div>
          </div>
        </section>
        <section className="about experience section wrap" id="sobre">
          <div className="section-label eyebrow">01 / SOBRE MIM E EXPERIÊNCIA</div>
          <div className="about-content"><h2>Sobre mim e<br /><em>experiência profissional.</em></h2><p className="about-intro">{profile.bio}</p>
            {experience.map(job => <article key={job.company}><div className="job-title"><h3>{job.company} <span>/ {job.role}</span></h3><span className="eyebrow">{job.period}</span></div><p>{job.summary}</p><details><summary>Ver detalhes da atuação <span>+</span></summary><ul>{job.highlights.map(item => <li key={item}>{item}</li>)}</ul></details></article>)}
            <Link className="text-link" href="/cv">Ver currículo completo <Arrow /></Link>
          </div>
        </section>
        <section className="work-section" id="projetos"><div className="wrap section"><div className="section-heading"><div><p className="eyebrow">02 / PROJETOS SELECIONADOS</p><h2>Projetos de<br /><em>engenharia de dados.</em></h2></div><p>Implementações de ingestão, processamento,<br />orquestração e governança de dados.</p></div>
          <div className="project-grid">{projects.map((project, i) => <article className={`project-card ${i === 0 ? "project-featured" : ""}`} key={project.title}>
            <div className="project-visual" aria-hidden="true"><span className="project-index">0{i + 1}</span><div className="project-flow">{flows[i].map((stage, j) => <div className="project-stage" key={stage}><span>{String(j + 1).padStart(2, "0")}</span><strong>{stage}</strong></div>)}</div><span className="visual-caption">{project.tags.slice(0, 3).join(" / ")}</span></div>
            <div className="project-body"><p className="eyebrow">PROJETO / 0{i + 1}</p><h3>{titles[i]}</h3><p className="project-description">{project.description}</p><div className="tags">{project.tags.map(tag => <span key={tag}>{tag}</span>)}</div><a className="project-action" href={project.href} target="_blank" rel="noopener noreferrer" aria-label={`Ver repositório: ${titles[i]}`}>Ver repositório <Arrow /></a></div>
          </article>)}</div>
          <a className="text-link" href={profile.links.github} target="_blank" rel="noopener noreferrer">Perfil no GitHub <Arrow /></a>
        </div></section>
        <section className="section wrap stack-section" id="stack"><div className="section-heading"><div><p className="eyebrow">03 / FERRAMENTAS</p><h2>Tecnologias e<br /><em>ferramentas.</em></h2></div><p>Linguagens, serviços e ferramentas<br />que utilizo no trabalho.</p></div><StackExplorer /></section>

        <section className="contact-section" id="contato"><div className="contact-motion" aria-hidden="true"><div className="motion-grid" /><div className="motion-orbit orbit-one" /><div className="motion-orbit orbit-two" /><div className="motion-orbit orbit-three" /><div className="motion-particles">{Array.from({ length: 8 }, (_, i) => <i key={i} style={{ left: `${12 + i * 11}%`, animationDelay: `${i * -2}s` }} />)}</div></div><div className="wrap"><p className="eyebrow">04 / CONTATO</p><h2>Contato <em>profissional.</em><span aria-hidden="true">↗</span></h2><div className="contact-bottom"><p>Entre em contato pelo LinkedIn ou WhatsApp.<br />Meus repositórios estão no GitHub.</p><div className="contact-buttons"><a className="button light" href={profile.links.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn <Arrow /></a><a className="button light" href={profile.links.github} target="_blank" rel="noopener noreferrer">GitHub <Arrow /></a><a className="button light" href="https://wa.me/5511936184114" target="_blank" rel="noopener noreferrer">WhatsApp <Arrow /></a></div></div><footer><span>© {new Date().getFullYear()} Gustavo Gomes</span><div><a href={profile.links.github} target="_blank" rel="noopener noreferrer">GitHub ↗</a><a href="/gustavo-gomes-cv.pdf" download>Currículo ↓</a><a href="#top">Voltar ao topo ↑</a></div></footer></div></section>
      </main>
    </div>
  );
}

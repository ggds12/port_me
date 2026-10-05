import type { Metadata } from "next";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { profile } from "@/lib/data";
import { cv } from "@/lib/cv-data";
import "./cv.css";

export const metadata: Metadata = { title: "Currículo", description: `Experiência, formação e competências de ${profile.name}, ${profile.role}.` };

export default function CVPage() {
  return (
    <div className="cv-page">
      <header className="cv-navigation"><div className="cv-width"><Link href="/">← Voltar ao portfólio</Link><div><a href={cv.pdfHref} download>Baixar PDF ↓</a><ThemeToggle /></div></div></header>
      <main id="main" className="cv-width">
        <header className="cv-intro"><p className="cv-eyebrow">CURRÍCULO / GUSTAVO GOMES</p><div className="cv-intro-heading"><div><h1>{profile.name}</h1><p className="cv-role">{profile.role}</p></div><span className="cv-open"><i aria-hidden />Aberto a oportunidades</span></div><p className="cv-summary">{profile.bio}</p><div className="cv-intro-links"><span>{profile.location}</span><a href={profile.links.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn ↗</a><a href={profile.links.github} target="_blank" rel="noopener noreferrer">GitHub ↗</a></div></header>
        <div className="cv-columns">
          <aside className="cv-sidebar"><section aria-labelledby="skills-title"><p className="cv-eyebrow">01 / COMPETÊNCIAS</p><h2 id="skills-title">Minha caixa<br /><em>de ferramentas.</em></h2><div className="cv-skills">{cv.stack.map(group => <div key={group.label}><h3>{group.label}</h3><ul>{group.items.map(item => <li key={item}>{item}</li>)}</ul></div>)}</div></section><a className="cv-download" href={cv.pdfHref} download><span>Leve o currículo com você</span><strong>Baixar versão em PDF <span aria-hidden>↓</span></strong></a></aside>
          <div className="cv-history"><section aria-labelledby="experience-title"><p className="cv-eyebrow">02 / EXPERIÊNCIA</p><h2 id="experience-title">Onde gerei <em>impacto.</em></h2>{cv.roles.map(role => <article key={role.company} className="cv-position"><div className="cv-position-top"><span className="cv-company">{role.company}</span><span className="cv-date">{role.period}</span></div><h3>{role.title}</h3><p>{role.summary}</p><ul>{role.highlights.map(highlight => <li key={highlight}>{highlight}</li>)}</ul></article>)}</section><section className="cv-education" aria-labelledby="education-title"><p className="cv-eyebrow">03 / FORMAÇÃO</p><h2 id="education-title">Aprendizado <em>contínuo.</em></h2>{cv.education.map(education => <article key={education.title}><span className="cv-date">{education.period}</span><h3>{education.title}</h3><p>{education.institution}</p></article>)}</section></div>
        </div>
        <footer className="cv-footer"><span>{profile.name} · {profile.role}</span><a href={profile.links.linkedin} target="_blank" rel="noopener noreferrer">Vamos conversar ↗</a></footer>
      </main>
    </div>
  );
}

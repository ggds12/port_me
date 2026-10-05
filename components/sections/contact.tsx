import { Container } from "@/components/ui/container";
import { profile } from "@/lib/data";

type IconName = "linkedin" | "github" | "instagram" | "resume";
function ContactIcon({ name }: { name: IconName }) {
  return (
    <svg className="contact-brand-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill={name === "linkedin" || name === "github" ? "currentColor" : "none"}>
      {name === "linkedin" && <path d="M20.45 2H3.55C2.69 2 2 2.68 2 3.52v16.96c0 .84.69 1.52 1.55 1.52h16.9c.86 0 1.55-.68 1.55-1.52V3.52c0-.84-.69-1.52-1.55-1.52ZM7.93 18.75H4.98V9.2h2.95v9.55ZM6.45 7.89a1.71 1.71 0 1 1 0-3.42 1.71 1.71 0 0 1 0 3.42Zm12.3 10.86H15.8V14.1c0-1.11-.02-2.54-1.55-2.54-1.55 0-1.79 1.21-1.79 2.46v4.73H9.51V9.2h2.83v1.3h.04c.39-.74 1.36-1.52 2.8-1.52 3 0 3.57 1.97 3.57 4.53v5.24Z" />}
      {name === "github" && <path d="M12 .8a11.2 11.2 0 0 0-3.54 21.83c.56.1.76-.24.76-.54v-2.1c-3.12.68-3.78-1.32-3.78-1.32-.51-1.3-1.24-1.65-1.24-1.65-1.02-.7.08-.68.08-.68 1.13.08 1.73 1.16 1.73 1.16 1 .1.75 1.2 3.26.89.1-.73.39-1.23.71-1.51-2.49-.29-5.11-1.25-5.11-5.54 0-1.22.43-2.22 1.15-3-.12-.28-.5-1.42.11-2.96 0 0 .94-.3 3.08 1.15a10.7 10.7 0 0 1 5.6 0c2.14-1.45 3.08-1.15 3.08-1.15.61 1.54.23 2.68.11 2.96.72.78 1.15 1.78 1.15 3 0 4.3-2.63 5.25-5.13 5.53.4.35.76 1.03.76 2.08v3.14c0 .3.2.65.77.54A11.2 11.2 0 0 0 12 .8Z" />}
      {name === "instagram" && <g stroke="currentColor" strokeWidth="1.7"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r=".9" fill="currentColor" stroke="none" /></g>}
      {name === "resume" && <g stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9l-6-6Z" /><path d="M14 3v6h6M8 13h8M8 17h5" /></g>}
    </svg>
  );
}

export function Contact() {
  return (
    <section id="contato" className="contact-minimal numbered-section" aria-labelledby="contact-title">
      <Container>
        <div className="contact-topline"><span>CONTATO</span><span className="contact-availability"><i aria-hidden="true" />Aberto a oportunidades</span></div>
        <div className="contact-invitation">
          <div><h2 id="contact-title">Vamos criar o<br /><em>próximo capítulo.</em></h2><p>Uma oportunidade, uma ideia ou uma boa conversa.</p></div>
          <a href={profile.links.linkedin} target="_blank" rel="noopener noreferrer" className="contact-main-link"><ContactIcon name="linkedin" /><span className="contact-main-label">Conversar no LinkedIn</span><span className="contact-arrow" aria-hidden="true">↗</span></a>
        </div>
        <div className="contact-socials">
          <a href={profile.links.github} target="_blank" rel="noopener noreferrer"><ContactIcon name="github" />GitHub <span aria-hidden="true">↗</span></a>
          <a href="/cv"><ContactIcon name="resume" />Currículo <span aria-hidden="true">↗</span></a>
          <a href={profile.links.instagram} target="_blank" rel="noopener noreferrer"><ContactIcon name="instagram" />Instagram <span aria-hidden="true">↗</span></a>
        </div>
        <p className="contact-signature">{profile.name} · Engenharia de Dados</p>
      </Container>
    </section>
  );
}

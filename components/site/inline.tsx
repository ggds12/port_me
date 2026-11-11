import type { CSSProperties, ReactNode } from "react";
import { tech } from "@/lib/tech";

/**
 * Quebra um texto em palavras <span class="w"> para a intro com digitação.
 * Sem JS (ou depois da intro) as palavras ficam visíveis normalmente.
 */
export function W({ children }: { children: string }) {
  const parts = children.split(/(\s+)/);
  return (
    <>
      {parts.map((p, i) =>
        /^\s+$/.test(p) || p === "" ? (
          p
        ) : (
          <span className="w" key={i}>
            {p}
          </span>
        ),
      )}
    </>
  );
}

/** Ícone monocromático do Simple Icons pintado com a cor da marca. */
export function TechIcon({ name, size = 14 }: { name: string; size?: number }) {
  const t = tech[name];
  if (!t) return null;
  return (
    <span
      className="tech-icon"
      aria-hidden="true"
      style={
        {
          "--c": t.color,
          "--s": `${size}px`,
          WebkitMaskImage: `url(/icons/${t.icon}.svg)`,
          maskImage: `url(/icons/${t.icon}.svg)`,
        } as CSSProperties
      }
    />
  );
}

/** Chip inline com ícone, no estilo dos "pills" do texto. */
export function Chip({ name, label }: { name: string; label?: string }) {
  const t = tech[name];
  return (
    <span className="chip w" style={{ "--c": t?.color ?? "#999" } as CSSProperties}>
      {t && (
        <span className="chip-tile">
          <TechIcon name={name} size={11} />
        </span>
      )}
      {label ?? name}
    </span>
  );
}

/** Marca-texto animado (desenha quando a palavra aparece). */
export function Mark({ children, tone = "amber" }: { children: string; tone?: "amber" | "blue" | "pink" }) {
  return (
    <span className={`mark mark-${tone}`}>
      <W>{children}</W>
    </span>
  );
}

/** Anotação manuscrita colorida. */
export function Hand({ children }: { children: string }) {
  return (
    <span className="hand">
      <W>{children}</W>
    </span>
  );
}

/** Link sublinhado com traço que se completa no hover. */
export function U({ href, children, external }: { href: string; children: ReactNode; external?: boolean }) {
  return (
    <a
      className="u"
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {children}
    </a>
  );
}

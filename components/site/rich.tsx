import { Fragment } from "react";
import type { Token } from "@/lib/i18n";
import { W, Chip, Mark, Hand } from "./inline";

/** Monta um parágrafo da bio a partir dos tokens do dicionário. */
export function Rich({ tokens, hrefs }: { tokens: Token[]; hrefs: Record<"experience" | "cv" | "github", string> }) {
  return (
    <>
      {tokens.map((t, i) => {
        // pontuação colada no item anterior; o resto separado por espaço
        const glue = typeof t === "string" && /^[,.;:!?]/.test(t);
        const sep = i > 0 && !glue ? " " : "";
        let node: React.ReactNode;
        if (typeof t === "string") node = <W>{t}</W>;
        else if ("chip" in t) node = <Chip name={t.chip} />;
        else if ("mark" in t) node = <Mark tone={t.tone}>{t.mark}</Mark>;
        else if ("hand" in t) node = <Hand>{t.hand}</Hand>;
        else if ("open" in t)
          node = (
            <span className="open w">
              <i />
              {t.open}
            </span>
          );
        else {
          const external = t.to === "github";
          node = (
            <a
              className="u w"
              href={hrefs[t.to]}
              {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            >
              {t.link}
            </a>
          );
        }
        return (
          <Fragment key={i}>
            {sep}
            {node}
          </Fragment>
        );
      })}
    </>
  );
}

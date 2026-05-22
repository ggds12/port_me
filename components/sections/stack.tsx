import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { stack } from "@/lib/data";

export function Stack() {
  return (
    <Container
      as="section"
      id="stack"
      className="border-t border-(--color-border) py-20 sm:py-28"
    >
      <Reveal>
        <SectionHeading
          index="02"
          eyebrow="Stack"
          title="Ferramentas do ofício."
        />
      </Reveal>

      <dl className="mt-12 divide-y divide-(--color-border) border-t border-(--color-border)">
        {stack.map((group, idx) => (
          <Reveal
            key={group.group}
            delay={idx * 80}
            className="grid grid-cols-1 gap-4 py-6 sm:grid-cols-[160px_1fr] sm:gap-8"
          >
            <dt className="section-index pt-1">{group.group}</dt>
            <dd>
              <ul className="flex flex-wrap gap-x-5 gap-y-2 font-mono text-sm tracking-(--tracking-mono)">
                {group.items.map((item) => (
                  <li
                    key={item}
                    className="text-(--color-foreground)"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </dd>
          </Reveal>
        ))}
      </dl>
    </Container>
  );
}

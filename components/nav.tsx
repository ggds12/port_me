import Link from "next/link";
import { Container } from "@/components/ui/container";
import { ThemeToggle } from "@/components/theme-toggle";
import { profile } from "@/lib/data";

const items = [
  { href: "#sobre", label: "Sobre" },
  { href: "#stack", label: "Stack" },
  { href: "#experiencia", label: "Experiência" },
  { href: "#projetos", label: "Projetos" },
  { href: "#contato", label: "Contato" },
];

export function Nav() {
  return (
    <header
      className="sticky top-0 z-30 border-b border-(--color-border)/60 bg-(--color-background)/80 backdrop-blur-md"
      role="banner"
    >
      <Container as="div" className="flex h-14 items-center justify-between">
        <Link
          href="#top"
          className="font-mono text-sm tracking-(--tracking-mono) text-(--color-foreground)"
          aria-label={`Voltar ao topo, ${profile.name}`}
        >
          gg<span className="text-(--color-accent)">.</span>
        </Link>

        <nav aria-label="Seções" className="hidden sm:block">
          <ul className="flex items-center gap-7 text-sm text-(--color-muted-foreground)">
            {items.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="transition-colors hover:text-(--color-foreground)"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <ThemeToggle />
      </Container>
    </header>
  );
}

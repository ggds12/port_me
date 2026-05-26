import { Container } from "@/components/ui/container";
import { profile } from "@/lib/data";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer
      role="contentinfo"
      className="border-t border-(--color-border) py-10"
    >
      <Container className="flex flex-col items-start justify-between gap-3 text-xs text-(--color-muted-foreground) sm:flex-row sm:items-center">
        <span className="font-mono tracking-(--tracking-mono)">
          © {year} · {profile.name}
        </span>
        <span className="font-mono tracking-(--tracking-mono)">
          gg<span className="text-(--color-accent)">.</span>
        </span>
      </Container>
    </footer>
  );
}

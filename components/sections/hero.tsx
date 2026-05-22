import { Container } from "@/components/ui/container";
import { profile } from "@/lib/data";

export function Hero() {
  return (
    <Container
      as="section"
      id="top"
      className="pt-16 pb-24 sm:pt-24 sm:pb-32"
      aria-labelledby="hero-title"
    >
      <div className="stagger flex flex-col gap-8">
        <div className="flex items-center gap-3 text-(--color-muted-foreground)">
          <span
            aria-hidden
            className="size-1.5 rounded-full bg-(--color-accent)"
          />
          <span className="section-index">
            disponível para conversas técnicas
          </span>
        </div>

        <h1
          id="hero-title"
          className="font-serif text-5xl leading-[1.05] tracking-(--tracking-tightest) text-(--color-foreground) sm:text-6xl md:text-7xl"
        >
          {profile.name}
          <span className="block text-(--color-muted-foreground)">
            <em className="italic">{profile.role.toLowerCase()}</em>
          </span>
        </h1>

        <p className="max-w-xl text-balance text-lg leading-relaxed text-(--color-muted-foreground) sm:text-xl">
          {profile.bio}
        </p>

        <div className="flex flex-wrap items-center gap-x-6 gap-y-3 pt-2 text-sm text-(--color-muted-foreground)">
          <span className="font-mono tracking-(--tracking-mono)">
            Go · Python · Docker · Kubernetes · GCP
          </span>
        </div>
      </div>
    </Container>
  );
}

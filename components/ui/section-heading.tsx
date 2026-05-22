import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  index: string;
  eyebrow: string;
  title: React.ReactNode;
  className?: string;
};

export function SectionHeading({
  index,
  eyebrow,
  title,
  className,
}: SectionHeadingProps) {
  return (
    <header className={cn("flex flex-col gap-3", className)}>
      <div className="flex items-center gap-3 text-(--color-muted-foreground)">
        <span className="section-index">{index}</span>
        <span aria-hidden className="h-px w-8 bg-(--color-border)" />
        <span className="section-index">{eyebrow}</span>
      </div>
      <h2 className="font-serif text-3xl tracking-(--tracking-tighter) sm:text-4xl">
        {title}
      </h2>
    </header>
  );
}

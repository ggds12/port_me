"use client";

import { useRef } from "react";
import { cn } from "@/lib/utils";

type StackCardProps = {
  group: string;
  items: readonly string[];
  icon: React.ReactNode;
  className?: string;
};

/**
 * StackCard — card de categoria da stack com:
 * - borda de luz que gira (conic-gradient animado) no hover
 * - glow radial que segue o cursor
 * - ícone que rotaciona/escala
 * - chips de tecnologia com hover individual
 */
export function StackCard({ group, items, icon, className }: StackCardProps) {
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--px", `${e.clientX - rect.left}px`);
    el.style.setProperty("--py", `${e.clientY - rect.top}px`);
  };

  return (
    <div ref={ref} onMouseMove={onMove} className={cn("stack-card", className)}>
      <span className="stack-card__glow" aria-hidden />
      <div className="stack-card__head">
        <span className="stack-card__icon" aria-hidden>
          {icon}
        </span>
        <h3 className="font-mono text-xs tracking-(--tracking-mono) text-(--color-foreground)">
          {group}
        </h3>
      </div>
      <ul className="flex flex-wrap gap-2">
        {items.map((item) => (
          <li key={item}>
            <span className="stack-chip">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

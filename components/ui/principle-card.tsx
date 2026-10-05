"use client";

import { useRef } from "react";
import { cn } from "@/lib/utils";

type PrincipleCardProps = {
  num: string;
  title: string;
  body: string;
  className?: string;
};

/**
 * PrincipleCard — card com tilt 3D que segue o cursor e um glow radial
 * que acompanha a posição do mouse dentro do card.
 */
export function PrincipleCard({
  num,
  title,
  body,
  className,
}: PrincipleCardProps) {
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const px = x / rect.width;
    const py = y / rect.height;

    el.style.setProperty("--px", `${x}px`);
    el.style.setProperty("--py", `${y}px`);

    const rotX = (0.5 - py) * 10;
    const rotY = (px - 0.5) * 10;
    el.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-4px)`;
  };

  const onLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = "";
  };

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={cn("principle", className)}
    >
      <span className="principle__num">{num}</span>
      <h3 className="mt-3 font-serif text-xl tracking-(--tracking-tighter)">
        {title}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-(--color-muted-foreground)">
        {body}
      </p>
    </div>
  );
}

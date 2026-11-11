import { MASCOT } from "@/lib/mascot";

/** Mascote do site em SVG inline; a cor vem de `currentColor`. */
export function Logo({ size = 30, className = "" }: { size?: number; className?: string }) {
  const { lid, eyes } = MASCOT;
  return (
    <svg className={className} width={size} height={size} viewBox="4 8 56 56" aria-hidden="true">
      <g fill="currentColor">
        <path fillRule="evenodd" d={MASCOT.body} />
        <ellipse
          cx={lid.cx}
          cy={lid.cy}
          rx={lid.rx}
          ry={lid.ry}
          transform={`rotate(${lid.rotate} ${lid.pivotX} ${lid.pivotY})`}
        />
        {eyes.map((e, i) => (
          <ellipse key={i} cx={e.cx} cy={e.cy} rx={e.rx} ry={e.ry} />
        ))}
      </g>
    </svg>
  );
}

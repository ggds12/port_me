/**
 * Assinatura manuscrita que se "desenha" da esquerda para a direita:
 * o contorno do texto é traçado enquanto uma máscara revela o nome.
 * A animação começa quando o elemento recebe a classe `in`
 * (adicionada pelo <Reveal />, ou já presente com `drawn`).
 */
export function Signature({
  text,
  className = "",
  width = 260,
  height = 70,
  fontSize = 46,
  drawn = false,
  label,
}: {
  text: string;
  className?: string;
  width?: number;
  height?: number;
  fontSize?: number;
  drawn?: boolean;
  label?: string;
}) {
  const id = `sig-${text.replace(/\W+/g, "-").toLowerCase()}-${width}`;
  return (
    <svg
      className={`signature ${drawn ? "in" : ""} ${className}`}
      data-reveal={drawn ? undefined : ""}
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      height={height}
      role="img"
      aria-label={label ?? text}
    >
      <defs>
        <clipPath id={id}>
          <rect className="signature-wipe" x="0" y="0" width={width} height={height} />
        </clipPath>
      </defs>
      <g clipPath={`url(#${id})`}>
        <text x="4" y={height * 0.68} fontSize={fontSize}>
          {text}
        </text>
      </g>
    </svg>
  );
}

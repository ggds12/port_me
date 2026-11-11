/**
 * Mascote do site: um banco de dados (cilindro) curioso que levanta a
 * própria tampa para espiar. Os olhos aparecem no vão entre tampa e corpo.
 * Geometria num grid 64×64, reutilizada no logo, no favicon e nos ícones
 * que caem pela página.
 */
export const MASCOT = {
  viewBox: "0 0 64 64",
  /** corpo com a faixa de "database" vazada (usar fill-rule evenodd) */
  body:
    "M10 35C10 39.7 19.8 43.5 32 43.5S54 39.7 54 35V53C54 57.7 44.2 61.5 32 61.5S10 57.7 10 53Z" +
    "M10 46.5C10 51.2 19.8 55 32 55S54 51.2 54 46.5V49.5C54 54.2 44.2 58 32 58S10 54.2 10 49.5Z",
  /** tampa: elipse inclinada, articulada no lado direito */
  lid: { cx: 31, cy: 29, rx: 24, ry: 8.2, rotate: 24, pivotX: 55, pivotY: 32 },
  /** olhos espiando pelo vão */
  eyes: [
    { cx: 19.5, cy: 31.5, rx: 3.2, ry: 4.4 },
    { cx: 29, cy: 34.2, rx: 3.2, ry: 4.4 },
  ],
} as const;

/** SVG completo do mascote (string), para favicon e arquivos estáticos. */
export function mascotSvg(fill = "currentColor", bg?: string) {
  const { lid, eyes } = MASCOT;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">${
    bg ? `<rect width="64" height="64" rx="14" fill="${bg}"/>` : ""
  }<g fill="${fill}"${
    // com fundo (favicon), reduz e centraliza para dar respiro na borda
    bg ? ' transform="translate(32 32) scale(.8) translate(-32 -36)"' : ""
  }><path fill-rule="evenodd" d="${MASCOT.body}"/><ellipse cx="${lid.cx}" cy="${lid.cy}" rx="${lid.rx}" ry="${lid.ry}" transform="rotate(${lid.rotate} ${lid.pivotX} ${lid.pivotY})"/>${eyes
    .map((e) => `<ellipse cx="${e.cx}" cy="${e.cy}" rx="${e.rx}" ry="${e.ry}"/>`)
    .join("")}</g></svg>`;
}

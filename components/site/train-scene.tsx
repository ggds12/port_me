"use client";

import { useEffect, useRef } from "react";

/* ------------------------------------------------------------------ */
/*  Cena do rodapé: um vale ao entardecer, um viaduto de pedra em      */
/*  curva e um trem a vapor atravessando.                              */
/*                                                                    */
/*  Tudo é desenhado em canvas, sem imagens. A paisagem é pintada uma  */
/*  vez em quatro camadas (céu+serras, vale, viaduto, primeiro plano)  */
/*  que se deslocam com o ponteiro (paralaxe); por cima animam o trem, */
/*  o vapor, a névoa, o brilho do lago, estrelas e vaga-lumes.         */
/* ------------------------------------------------------------------ */

type Pt = { x: number; y: number };
type RGB = [number, number, number];
type Range = { top: string; base: string; lit: string; haze: string };

type Palette = {
  dusk: boolean;
  sky: [number, string][];
  sun: RGB;
  sunGlow: number;
  cloudLit: string;
  cloudDark: string;
  ranges: [Range, Range, Range]; // da mais distante à mais próxima
  lake: [string, string];
  shimmer: RGB;
  hill: [string, string];
  hillFar: [string, string];
  meadow: string;
  tree: string;
  treeRim: string;
  stone: [string, string];
  stoneLit: string;
  soffit: string;
  ground: [string, string];
  groundRim: string;
  heather: string[];
  fgTree: string;
  fgRim: string;
  fog: RGB;
  fogAlpha: number;
  loco: string;
  locoHi: string;
  brass: string;
  coach: string;
  coachHi: string;
  roof: string;
  window: string;
  steam: [RGB, RGB];
  steamAlpha: number;
};

const DUSK: Palette = {
  dusk: true,
  sky: [
    [0, "#0b1022"],
    [0.3, "#1c2144"],
    [0.52, "#4b365a"],
    [0.7, "#a9566a"],
    [0.84, "#f0945e"],
    [1, "#ffd28c"],
  ],
  sun: [255, 198, 130],
  sunGlow: 0.62,
  cloudLit: "255,150,118",
  cloudDark: "58,44,92",
  ranges: [
    { top: "#5d4b74", base: "#93667a", lit: "255,178,140", haze: "rgba(244,166,132,0.42)" },
    { top: "#34304f", base: "#4d3d5e", lit: "236,146,130", haze: "rgba(158,104,122,0.4)" },
    { top: "#1b2030", base: "#27283c", lit: "196,122,118", haze: "rgba(86,72,104,0.45)" },
  ],
  lake: ["#ffcb8c", "#4b3b5c"],
  shimmer: [255, 226, 180],
  hill: ["#1c272a", "#10181b"],
  hillFar: ["#2a3438", "#1b2428"],
  meadow: "rgba(104,128,84,0.5)",
  tree: "#0d1518",
  treeRim: "rgba(255,172,122,0.17)",
  stone: ["#74676d", "#2b272f"],
  stoneLit: "255,200,156",
  soffit: "#15131a",
  ground: ["#1b2421", "#0b0f11"],
  groundRim: "rgba(255,180,130,0.28)",
  heather: ["rgba(156,94,146,0.5)", "rgba(92,122,82,0.42)", "rgba(206,144,112,0.3)"],
  fgTree: "#06090c",
  fgRim: "rgba(255,164,112,0.2)",
  fog: [196, 164, 184],
  fogAlpha: 0.34,
  loco: "#0f1015",
  locoHi: "#3d404b",
  brass: "#dcae5e",
  coach: "#5a1b21",
  coachHi: "#8b3039",
  roof: "#2a2b33",
  window: "#ffdc90",
  steam: [
    [255, 216, 184],
    [156, 146, 176],
  ],
  steamAlpha: 0.5,
};

const DAY: Palette = {
  dusk: false,
  sky: [
    [0, "#4f8fd6"],
    [0.45, "#8cbae6"],
    [0.78, "#cee2f0"],
    [1, "#f5eeda"],
  ],
  sun: [255, 249, 228],
  sunGlow: 0.42,
  cloudLit: "255,255,255",
  cloudDark: "168,188,214",
  ranges: [
    { top: "#8ea6c1", base: "#b4c5d5", lit: "255,255,255", haze: "rgba(232,240,246,0.55)" },
    { top: "#60809a", base: "#88a2b4", lit: "236,246,252", haze: "rgba(212,226,236,0.5)" },
    { top: "#45664e", base: "#5e7e5d", lit: "222,238,190", haze: "rgba(204,222,212,0.4)" },
  ],
  lake: ["#e4f1f9", "#6e97b6"],
  shimmer: [255, 255, 255],
  hill: ["#57793f", "#3d5b32"],
  hillFar: ["#6a8c52", "#4f7040"],
  meadow: "rgba(176,206,112,0.6)",
  tree: "#264027",
  treeRim: "rgba(224,242,160,0.4)",
  stone: ["#bdb5a8", "#7a7369"],
  stoneLit: "255,255,246",
  soffit: "#565049",
  ground: ["#4b6b38", "#2b4325"],
  groundRim: "rgba(226,244,170,0.35)",
  heather: ["rgba(172,112,162,0.5)", "rgba(142,182,92,0.45)", "rgba(232,212,142,0.35)"],
  fgTree: "#162719",
  fgRim: "rgba(204,232,152,0.22)",
  fog: [255, 255, 255],
  fogAlpha: 0.22,
  loco: "#1a1c21",
  locoHi: "#50545f",
  brass: "#e2b264",
  coach: "#7b2329",
  coachHi: "#a53c43",
  roof: "#4b4d56",
  window: "#f4e8c4",
  steam: [
    [255, 255, 255],
    [228, 232, 238],
  ],
  steamAlpha: 0.72,
};

/** PRNG determinístico para a paisagem não mudar a cada resize. */
function rng(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Ruído 1D suave: fbm (ondulado) e ridged (cristas pontudas). */
function makeNoise(seed: number) {
  const r = rng(seed);
  const tab = Array.from({ length: 512 }, () => r());
  const n1 = (x: number) => {
    const i = Math.floor(x);
    const f = x - i;
    const u = f * f * (3 - 2 * f);
    const a = tab[i & 511];
    const b = tab[(i + 1) & 511];
    return a + (b - a) * u;
  };
  const sum = (x: number, oct: number, shape: (v: number) => number) => {
    let s = 0;
    let a = 1;
    let t = 0;
    let f = 1;
    for (let o = 0; o < oct; o++) {
      s += shape(n1(x * f + o * 37.7)) * a;
      t += a;
      a *= 0.5;
      f *= 2.03;
    }
    return s / t;
  };
  return {
    fbm: (x: number, oct = 4) => sum(x, oct, (v) => v),
    ridged: (x: number, oct = 4) => sum(x, oct, (v) => (1 - Math.abs(2 * v - 1)) ** 1.6),
  };
}

function bezier(p0: Pt, p1: Pt, p2: Pt, p3: Pt, t: number): Pt {
  const u = 1 - t;
  return {
    x: u * u * u * p0.x + 3 * u * u * t * p1.x + 3 * u * t * t * p2.x + t * t * t * p3.x,
    y: u * u * u * p0.y + 3 * u * u * t * p1.y + 3 * u * t * t * p2.y + t * t * t * p3.y,
  };
}

const rgba = (c: RGB | string, a: number) => `rgba(${typeof c === "string" ? c : c.join(",")},${a})`;

type Puff = { x: number; y: number; vx: number; vy: number; r: number; life: number; max: number };
type Car = { spr: HTMLCanvasElement; L: number; kind: 0 | 1 | 2 };

/** margem extra (px) pintada de cada lado para a paralaxe não revelar bordas */
const M = 32;
const PAD = 12; // folga, em unidades do trem, em volta de cada sprite
const SPR_H = 132;
const SPR_TOP = 124;

export function TrainScene({ className = "", label }: { className?: string; label: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext("2d")!;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let W = 0;
    let H = 0;
    let dpr = 1;
    let pal = DUSK;
    let sunX = 0;
    let horizon = 0;

    let layers: HTMLCanvasElement[] = [];
    let softWarm: HTMLCanvasElement;
    let softCool: HTMLCanvasElement;
    let glow: HTMLCanvasElement;
    let fogTex: HTMLCanvasElement;
    let cars: Car[] = [];
    let stars: { x: number; y: number; p: number; s: number }[] = [];
    let glints: { x: number; y: number; w: number; p: number }[] = [];
    let flies: { x: number; y: number; p: number; s: number }[] = [];
    let lakeBox = { x0: 0, x1: 0, y0: 0, y1: 0 };

    // curva do viaduto (amostrada por comprimento de arco)
    let samples: { p: Pt; s: number; len: number }[] = [];
    let total = 0;

    const at = (d: number) => {
      if (d <= 0 || d >= total) {
        const end = d <= 0 ? 0 : samples.length - 1;
        const a = samples[end];
        const b = samples[d <= 0 ? 1 : end - 1];
        const ang = d <= 0 ? Math.atan2(b.p.y - a.p.y, b.p.x - a.p.x) : Math.atan2(a.p.y - b.p.y, a.p.x - b.p.x);
        const over = d <= 0 ? d : d - total;
        return { x: a.p.x + Math.cos(ang) * over, y: a.p.y + Math.sin(ang) * over, ang, s: a.s };
      }
      let lo = 0;
      let hi = samples.length - 1;
      while (hi - lo > 1) {
        const mid = (lo + hi) >> 1;
        if (samples[mid].len < d) lo = mid;
        else hi = mid;
      }
      const a = samples[lo];
      const b = samples[hi];
      const f = (d - a.len) / Math.max(0.0001, b.len - a.len);
      return {
        x: a.p.x + (b.p.x - a.p.x) * f,
        y: a.p.y + (b.p.y - a.p.y) * f,
        ang: Math.atan2(b.p.y - a.p.y, b.p.x - a.p.x),
        s: a.s + (b.s - a.s) * f,
      };
    };

    const soft = (c: RGB, mid = 0.45) => {
      const cv = document.createElement("canvas");
      cv.width = cv.height = 96;
      const g = cv.getContext("2d")!;
      const gr = g.createRadialGradient(48, 48, 0, 48, 48, 48);
      gr.addColorStop(0, rgba(c, 1));
      gr.addColorStop(0.5, rgba(c, mid));
      gr.addColorStop(1, rgba(c, 0));
      g.fillStyle = gr;
      g.fillRect(0, 0, 96, 96);
      return cv;
    };

    /** Camada do tamanho da cena + margem, já em coordenadas da cena. */
    const makeLayer = (q: number) => {
      const c = document.createElement("canvas");
      c.width = Math.ceil((W + M * 2) * q);
      c.height = Math.ceil(H * q);
      const g = c.getContext("2d")!;
      g.scale(q, q);
      g.translate(M, 0);
      return [c, g] as const;
    };

    /* ---------------------------- pincéis ---------------------------- */

    const mountain = (
      g: CanvasRenderingContext2D,
      o: { base: number; amp: number; seed: number; freq: number; valley: number; vw: number; vx: number; range: Range },
    ) => {
      const nz = makeNoise(o.seed);
      const n = Math.ceil((W + M * 2) / 2) + 2;
      const ys = new Float32Array(n);
      for (let i = 0; i < n; i++) {
        const nx = (-M + i * 2) / W;
        const v = 1 - o.valley * Math.exp(-(((nx - o.vx) / o.vw) ** 2));
        ys[i] = o.base - o.amp * (0.1 + 0.9 * nz.ridged(nx * o.freq)) * v;
      }
      g.beginPath();
      g.moveTo(-M, H);
      for (let i = 0; i < n; i++) g.lineTo(-M + i * 2, ys[i]);
      g.lineTo(W + M, H);
      g.closePath();
      const gr = g.createLinearGradient(0, o.base - o.amp, 0, o.base);
      gr.addColorStop(0, o.range.top);
      gr.addColorStop(1, o.range.base);
      g.fillStyle = gr;
      g.fill();
      // encostas voltadas para o sol recebem luz; as opostas, sombra
      for (let i = 9; i < n - 9; i++) {
        const x = -M + i * 2;
        const f = ((ys[i + 9] - ys[i - 9]) / 36) * (x < sunX ? 1 : -1);
        const k = Math.min(1, Math.abs(f) * 1.9);
        if (k < 0.06) continue;
        const len = o.amp * (0.1 + 0.2 * k);
        const sg = g.createLinearGradient(0, ys[i], 0, ys[i] + len);
        if (f > 0) {
          sg.addColorStop(0, rgba(o.range.lit, 0.36 * k));
          sg.addColorStop(1, rgba(o.range.lit, 0));
        } else {
          sg.addColorStop(0, `rgba(8,8,26,${0.2 * k})`);
          sg.addColorStop(1, "rgba(8,8,26,0)");
        }
        g.fillStyle = sg;
        g.fillRect(x - 1, ys[i], 2.4, len);
      }
      // bruma no pé da serra separa os planos
      const hz = g.createLinearGradient(0, o.base - o.amp * 0.34, 0, o.base + 2);
      hz.addColorStop(0, "rgba(0,0,0,0)");
      hz.addColorStop(1, o.range.haze);
      g.fillStyle = hz;
      g.fillRect(-M, o.base - o.amp * 0.34, W + M * 2, o.amp * 0.34 + 2);
    };

    const pinePath = (g: CanvasRenderingContext2D, x: number, y: number, h: number, r: () => number) => {
      const w = h * 0.34;
      const tiers = 6;
      g.beginPath();
      g.moveTo(x, y - h);
      const pts: [number, number][] = [];
      for (let i = 1; i <= tiers; i++) {
        const ty = y - h + (h * 0.94 * i) / tiers;
        const tw = ((w * i) / tiers) * (0.85 + r() * 0.3);
        pts.push([tw, ty]);
      }
      for (const [tw, ty] of pts) {
        g.lineTo(x + tw, ty + h * 0.02);
        g.lineTo(x + tw * 0.4, ty - h * 0.02);
      }
      g.lineTo(x + w * 0.07, y - h * 0.06);
      g.lineTo(x + w * 0.07, y);
      g.lineTo(x - w * 0.07, y);
      g.lineTo(x - w * 0.07, y - h * 0.06);
      for (let i = pts.length - 1; i >= 0; i--) {
        const [tw, ty] = pts[i];
        g.lineTo(x - tw * 0.4, ty - h * 0.02);
        g.lineTo(x - tw, ty + h * 0.02);
      }
      g.closePath();
    };

    /** Pinheiro em contraluz: silhueta escura com um fio de luz do lado do sol. */
    const pine = (g: CanvasRenderingContext2D, x: number, y: number, h: number, col: string, rim: string, seed: number) => {
      const dir = x < sunX ? 1 : -1;
      g.fillStyle = rim;
      pinePath(g, x + dir * Math.max(0.8, h * 0.022), y - h * 0.012, h, rng(seed));
      g.fill();
      g.fillStyle = col;
      pinePath(g, x, y, h, rng(seed));
      g.fill();
    };

    /** Copa arredondada (árvore de folha larga), também em contraluz. */
    const blob = (g: CanvasRenderingContext2D, x: number, y: number, r: number, col: string, rim: string, rnd: () => number) => {
      const dir = x < sunX ? 1 : -1;
      const j = () => (rnd() - 0.5) * r * 0.3;
      const cs: [number, number, number][] = [
        [-r * 0.85 + j(), -r * 0.4, r * 0.58],
        [j(), -r * 0.45, r * 0.66],
        [r * 0.85 + j(), -r * 0.42, r * 0.56],
        [-r * 0.42 + j(), -r * 0.98, r * 0.54],
        [r * 0.44 + j(), -r * 0.94, r * 0.52],
        [j(), -r * 1.36, r * 0.42],
      ];
      const pass = (dx: number, dy: number) => {
        g.beginPath();
        for (const [cx, cy, cr] of cs) {
          g.moveTo(x + cx + dx + cr, y + cy + dy);
          g.arc(x + cx + dx, y + cy + dy, cr, 0, Math.PI * 2);
        }
        g.fill();
      };
      g.fillStyle = rim;
      pass(dir * Math.max(0.5, r * 0.05), -Math.max(0.6, r * 0.07));
      g.fillStyle = col;
      pass(0, 0);
    };

    /* --------------------------- o trem --------------------------- */

    const sprite = (L: number, ps: number, paint: (g: CanvasRenderingContext2D) => void) => {
      const c = document.createElement("canvas");
      c.width = Math.ceil((L + PAD * 2) * ps);
      c.height = Math.ceil(SPR_H * ps);
      const g = c.getContext("2d")!;
      g.scale(ps, ps);
      g.translate(PAD, SPR_TOP); // origem: trilho, traseira do vagão; y negativo = para cima
      paint(g);
      return c;
    };

    const buildTrain = () => {
      const ps = Math.max(0.35, ((H * 0.056) / 100) * dpr);
      const p = pal;
      const rr = (g: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number, fill: string | CanvasGradient) => {
        g.beginPath();
        g.roundRect(x, y, w, h, r);
        g.fillStyle = fill;
        g.fill();
      };
      const vgrad = (g: CanvasRenderingContext2D, y0: number, y1: number, stops: [number, string][]) => {
        const gr = g.createLinearGradient(0, y0, 0, y1);
        stops.forEach(([o, c]) => gr.addColorStop(o, c));
        return gr;
      };
      const wheel = (g: CanvasRenderingContext2D, x: number, r: number) => {
        g.fillStyle = "#08080b";
        g.beginPath();
        g.arc(x, -r, r, 0, Math.PI * 2);
        g.fill();
        g.strokeStyle = p.locoHi;
        g.lineWidth = Math.max(1.2, r * 0.14);
        g.beginPath();
        g.arc(x, -r, r * 0.8, 0, Math.PI * 2);
        g.stroke();
        g.fillStyle = p.locoHi;
        g.beginPath();
        g.arc(x, -r, r * 0.22, 0, Math.PI * 2);
        g.fill();
      };

      const loco = sprite(310, ps, (g) => {
        [118, 160, 202].forEach((x) => wheel(g, x, 19));
        [252, 282].forEach((x) => wheel(g, x, 10));
        wheel(g, 62, 12);
        g.fillStyle = p.loco;
        g.fillRect(22, -33, 278, 8); // chassi
        g.fillRect(8, -24, 16, 4); // engate
        rr(g, 238, -42, 42, 17, 3, p.locoHi); // cilindro
        rr(g, 96, -80, 196, 48, 17, vgrad(g, -80, -32, [[0, p.locoHi], [0.42, p.loco], [1, "#000"]])); // caldeira
        rr(g, 280, -82, 17, 52, 7, "#07070a"); // caixa de fumaça
        g.fillStyle = p.brass;
        g.globalAlpha = 0.75;
        [128, 168, 214, 256].forEach((x) => g.fillRect(x, -80, 2.2, 46)); // cintas
        g.globalAlpha = 1;
        g.fillStyle = p.loco;
        g.fillRect(266, -100, 13, 22); // chaminé
        rr(g, 262, -104, 21, 6, 2.5, p.brass);
        g.fillStyle = p.brass;
        g.beginPath();
        g.ellipse(196, -80, 11, 10, 0, Math.PI, 0); // domo
        g.fill();
        g.fillRect(228, -87, 5, 8); // válvula
        rr(g, 34, -90, 66, 62, 3, vgrad(g, -90, -28, [[0, p.locoHi], [0.35, p.loco], [1, "#050507"]])); // cabine
        rr(g, 26, -96, 82, 8, 4, p.locoHi); // teto
        rr(g, 52, -80, 30, 23, 2.5, p.window); // janela
        g.strokeStyle = p.brass;
        g.globalAlpha = 0.55;
        g.lineWidth = 1.2;
        g.strokeRect(41, -52, 52, 19);
        g.globalAlpha = 1;
        g.fillStyle = p.locoHi;
        g.fillRect(98, -34, 198, 1.8); // friso do estribo
        g.fillStyle = "#a8281f";
        g.fillRect(296, -36, 6, 13); // viga dos para-choques
        g.fillStyle = "#1c1c20";
        g.fillRect(302, -33, 6, 5);
        g.fillStyle = p.brass;
        g.beginPath();
        g.arc(300, -46, 3.4, 0, Math.PI * 2); // lanterna
        g.fill();
      });

      const tender = sprite(170, ps, (g) => {
        [34, 84, 134].forEach((x) => wheel(g, x, 11));
        g.fillStyle = p.loco;
        g.fillRect(4, -28, 162, 7);
        g.fillRect(160, -24, 12, 4);
        // carvão
        g.fillStyle = "#050506";
        g.beginPath();
        g.moveTo(16, -70);
        const r = rng(5);
        for (let x = 16; x <= 152; x += 8) g.lineTo(x, -76 - r() * 9);
        g.lineTo(152, -70);
        g.closePath();
        g.fill();
        rr(g, 8, -72, 154, 46, 3, vgrad(g, -72, -26, [[0, p.locoHi], [0.3, p.loco], [1, "#050507"]]));
        g.fillStyle = p.locoHi;
        g.fillRect(8, -74, 154, 3);
        g.strokeStyle = p.brass;
        g.globalAlpha = 0.55;
        g.lineWidth = 1.2;
        g.strokeRect(17, -63, 136, 29);
        g.globalAlpha = 1;
      });

      const coach = sprite(410, ps, (g) => {
        [46, 74, 336, 364].forEach((x) => wheel(g, x, 10));
        g.fillStyle = "#0b0b0f";
        g.fillRect(34, -17, 52, 5);
        g.fillRect(324, -17, 52, 5);
        g.fillRect(6, -26, 398, 7);
        g.fillRect(160, -21, 92, 11);
        g.fillRect(-5, -76, 9, 52); // sanfonas
        g.fillRect(406, -76, 9, 52);
        rr(g, 4, -82, 402, 58, 4, vgrad(g, -82, -24, [[0, p.coachHi], [0.45, p.coach], [1, "#1c090b"]]));
        rr(g, 1, -91, 408, 12, 6, vgrad(g, -91, -79, [[0, p.locoHi], [1, p.roof]]));
        g.fillStyle = p.brass;
        g.globalAlpha = 0.8;
        g.fillRect(4, -50, 402, 1.3);
        g.globalAlpha = 0.45;
        g.fillRect(4, -34, 402, 1);
        g.globalAlpha = 1;
        const r = rng(9);
        for (let i = 0; i < 10; i++) {
          const x = 31 + i * 35.5;
          rr(g, x, -76, 27, 21, 2.2, p.window);
          if (r() < 0.55) {
            // passageiro
            g.fillStyle = "rgba(40,16,10,0.6)";
            g.beginPath();
            g.arc(x + 7 + r() * 13, -58, 4.2, Math.PI, 0);
            g.fill();
          }
        }
        // portas
        g.fillStyle = "rgba(0,0,0,0.35)";
        [9, 388].forEach((x) => {
          g.fillRect(x, -78, 1.2, 52);
          g.fillRect(x + 13, -78, 1.2, 52);
        });
        g.fillStyle = p.window;
        g.globalAlpha = 0.8;
        [11.5, 390.5].forEach((x) => g.fillRect(x, -74, 9, 16));
        g.globalAlpha = 1;
      });

      const coaches = W / H > 1.9 ? 5 : 4;
      cars = [
        { spr: loco, L: 310, kind: 0 },
        { spr: tender, L: 170, kind: 1 },
        ...Array.from({ length: coaches }, () => ({ spr: coach, L: 410, kind: 2 as const })),
      ];
    };

    /* ------------------------- a paisagem ------------------------- */

    const build = () => {
      pal = document.documentElement.classList.contains("dark") ? DUSK : DAY;
      const p = pal;
      softWarm = soft(p.steam[0]);
      softCool = soft(p.steam[1]);
      glow = soft([255, 196, 110], 0.3);
      horizon = H * 0.5;
      sunX = W * 0.53;
      // qualidade das camadas: limita o total de pixels em telas muito grandes
      const q = Math.max(1, Math.min(dpr, Math.sqrt(3.4e6 / (W * H))));

      // ---- curva do viaduto: um arco que se aproxima de quem olha ----
      const p0 = { x: -W * 0.1, y: H * 0.585 };
      const p1 = { x: W * 0.2, y: H * 0.752 };
      const p2 = { x: W * 0.8, y: H * 0.746 };
      const p3 = { x: W * 1.1, y: H * 0.565 };
      samples = [];
      total = 0;
      let prev = bezier(p0, p1, p2, p3, 0);
      for (let i = 0; i <= 600; i++) {
        const pt = bezier(p0, p1, p2, p3, i / 600);
        total += Math.hypot(pt.x - prev.x, pt.y - prev.y);
        samples.push({ p: pt, s: 0, len: total });
        prev = pt;
      }
      const topY = Math.min(p0.y, p3.y);
      const lowY = Math.max(...samples.map((s) => s.p.y));
      // mais baixo na tela = mais perto = maior
      samples.forEach((s) => (s.s = 0.5 + Math.max(0, Math.min(1, (s.p.y - topY) / (lowY - topY))) * 0.5));

      /* ================= 1. céu, serras distantes e lago ================= */
      const [back, g] = makeLayer(q);
      const sky = g.createLinearGradient(0, H * 0.08, 0, horizon + H * 0.03);
      p.sky.forEach(([o, c]) => sky.addColorStop(o, c));
      g.fillStyle = sky;
      g.fillRect(-M, 0, W + M * 2, H);

      const r = rng(7);
      stars = [];
      if (p.dusk) {
        for (let i = 0; i < 170; i++) {
          const x = -M + r() * (W + M * 2);
          const y = H * 0.1 + r() ** 1.6 * horizon * 0.62;
          const a = (0.2 + r() * 0.65) * (1 - (y - H * 0.1) / (horizon * 0.7));
          const s = r() < 0.1 ? 1.7 : 1;
          if (i < 36) stars.push({ x, y, p: r() * 6.28, s: s + 0.3 });
          else {
            g.fillStyle = `rgba(255,255,255,${a})`;
            g.fillRect(x, y, s, s);
          }
        }
      }

      // clarão do sol atrás das serras
      for (const [rad, a] of [
        [W * 0.6, 0.55],
        [W * 0.22, 0.8],
      ]) {
        const sun = g.createRadialGradient(sunX, horizon, 0, sunX, horizon, rad);
        sun.addColorStop(0, rgba(p.sun, p.sunGlow * a));
        sun.addColorStop(0.35, rgba(p.sun, p.sunGlow * a * 0.3));
        sun.addColorStop(1, rgba(p.sun, 0));
        g.fillStyle = sun;
        g.fillRect(-M, 0, W + M * 2, H);
      }

      // nuvens: fiapos alongados, sombra em cima e luz por baixo
      for (let i = 0; i < 11; i++) {
        const cx = r() * W;
        const cy = horizon * (0.42 + r() * 0.48);
        const rw = W * (0.07 + r() * 0.15);
        const rh = H * (0.007 + r() * 0.014);
        const near = 1 - Math.min(1, Math.abs(cx - sunX) / (W * 0.6));
        const puffs = 3 + Math.floor(r() * 3);
        for (let j = 0; j < puffs; j++) {
          const ox = (r() - 0.5) * rw * 1.2;
          const oy = (r() - 0.5) * rh * 1.4;
          const w = rw * (0.45 + r() * 0.55);
          for (const [col, dy, a] of [
            [p.cloudDark, -rh * 0.5, 0.34],
            [p.cloudLit, rh * 0.45, 0.26 + near * 0.34],
          ] as [string, number, number][]) {
            g.save();
            g.translate(cx + ox, cy + oy + dy);
            g.scale(1, rh / w);
            const cg = g.createRadialGradient(0, 0, 0, 0, 0, w);
            cg.addColorStop(0, rgba(col, a));
            cg.addColorStop(1, rgba(col, 0));
            g.fillStyle = cg;
            g.beginPath();
            g.arc(0, 0, w, 0, Math.PI * 2);
            g.fill();
            g.restore();
          }
        }
      }

      mountain(g, { base: horizon + H * 0.02, amp: H * 0.24, seed: 11, freq: 2.6, valley: 0.72, vw: 0.2, vx: 0.53, range: p.ranges[0] });
      mountain(g, { base: horizon + H * 0.04, amp: H * 0.34, seed: 23, freq: 2.1, valley: 0.9, vw: 0.26, vx: 0.5, range: p.ranges[1] });

      // lago no fundo do vale: reflete o céu e some nas margens
      const lakeTop = horizon + H * 0.022;
      const lakeH = H * 0.13;
      {
        const lc = document.createElement("canvas");
        lc.width = Math.ceil(W);
        lc.height = Math.ceil(lakeH);
        const l = lc.getContext("2d")!;
        const lg = l.createLinearGradient(0, 0, 0, lakeH);
        lg.addColorStop(0, p.lake[0]);
        lg.addColorStop(0.75, p.lake[1]);
        l.fillStyle = lg;
        l.fillRect(0, 0, W, lakeH);
        const streak = l.createLinearGradient(sunX - W * 0.07, 0, sunX + W * 0.07, 0);
        streak.addColorStop(0, rgba(p.sun, 0));
        streak.addColorStop(0.5, rgba(p.sun, 0.7));
        streak.addColorStop(1, rgba(p.sun, 0));
        l.fillStyle = streak;
        l.fillRect(sunX - W * 0.07, 0, W * 0.14, lakeH);
        l.strokeStyle = rgba(p.shimmer, 0.5);
        l.lineWidth = 1;
        for (let i = 0; i < 46; i++) {
          const y = 2 + r() ** 1.4 * lakeH * 0.75;
          const x = W * (0.24 + r() * 0.52);
          l.globalAlpha = 0.2 + r() * 0.6;
          l.beginPath();
          l.moveTo(x, y);
          l.lineTo(x + W * (0.005 + r() * 0.035), y);
          l.stroke();
        }
        l.globalAlpha = 1;
        l.globalCompositeOperation = "destination-in";
        const fade = l.createLinearGradient(0, 0, W, 0);
        fade.addColorStop(0.14, "rgba(0,0,0,0)");
        fade.addColorStop(0.33, "rgba(0,0,0,1)");
        fade.addColorStop(0.7, "rgba(0,0,0,1)");
        fade.addColorStop(0.88, "rgba(0,0,0,0)");
        l.fillStyle = fade;
        l.fillRect(0, 0, W, lakeH);
        g.drawImage(lc, 0, lakeTop, W, lakeH);
      }
      lakeBox = { x0: W * 0.3, x1: W * 0.72, y0: lakeTop + 2, y1: lakeTop + lakeH * 0.55 };
      glints = Array.from({ length: 26 }, () => ({
        x: lakeBox.x0 + r() * (lakeBox.x1 - lakeBox.x0),
        y: lakeBox.y0 + r() ** 1.5 * (lakeBox.y1 - lakeBox.y0),
        w: W * (0.004 + r() * 0.018),
        p: r() * 6.28,
      }));

      /* ================= 2. o vale: encostas, campos e bosques ================= */
      const [mid, m] = makeLayer(q);
      mountain(m, { base: H * 0.66, amp: H * 0.4, seed: 57, freq: 1.5, valley: 0.97, vw: 0.3, vx: 0.52, range: p.ranges[2] });

      const hn = makeNoise(41);
      const hillY = (x: number, k: number) =>
        H * (0.6 + k * 0.075) + (hn.fbm((x / W) * 3.2 + k * 9, 3) - 0.5) * H * 0.05 - Math.abs((x / W) * 2 - 1) ** 2 * H * 0.03;
      const r2 = rng(31);
      for (let k = 0; k < 3; k++) {
        const cols = k === 0 ? p.hillFar : p.hill;
        m.beginPath();
        m.moveTo(-M, H);
        for (let x = -M; x <= W + M; x += 4) m.lineTo(x, hillY(x, k));
        m.lineTo(W + M, H);
        m.closePath();
        const hg = m.createLinearGradient(0, H * (0.58 + k * 0.075), 0, H * (0.74 + k * 0.08));
        hg.addColorStop(0, cols[0]);
        hg.addColorStop(1, cols[1]);
        m.fillStyle = hg;
        m.fill();
        // luz rasante na crista
        m.strokeStyle = p.groundRim;
        m.lineWidth = 1;
        m.beginPath();
        for (let x = -M; x <= W + M; x += 4) m.lineTo(x, hillY(x, k) + 0.5);
        m.stroke();
        // campos claros
        for (let i = 0; i < 5; i++) {
          const cx = W * (0.12 + r2() * 0.76);
          const cy = hillY(cx, k) + H * (0.022 + r2() * 0.035);
          const rw = W * (0.04 + r2() * 0.07);
          m.save();
          m.translate(cx, cy);
          m.rotate((r2() - 0.5) * 0.1);
          m.scale(1, (H * (0.008 + r2() * 0.012)) / rw);
          const mg = m.createRadialGradient(0, 0, rw * 0.35, 0, 0, rw);
          mg.addColorStop(0, p.meadow);
          mg.addColorStop(1, "rgba(0,0,0,0)");
          m.fillStyle = mg;
          m.beginPath();
          m.arc(0, 0, rw, 0, Math.PI * 2);
          m.fill();
          m.restore();
        }
        // bosques: árvores agrupadas, maiores quanto mais perto
        const tn = makeNoise(70 + k);
        const trees: [number, number, number, boolean][] = [];
        for (let i = 0; i < 150; i++) {
          const x = -M + r2() * (W + M * 2);
          if (tn.fbm((x / W) * 7, 2) < 0.46) continue;
          const y = hillY(x, k) + r2() * H * 0.07;
          trees.push([x, y, H * (0.011 + k * 0.006) * (0.7 + r2() * 0.7), r2() < 0.35]);
        }
        trees.sort((a, b) => a[1] - b[1]);
        trees.forEach(([x, y, s, isPine], i) => {
          if (isPine) pine(m, x, y, s * 3.4, p.tree, p.treeRim, i + k * 500);
          else blob(m, x, y, s, p.tree, p.treeRim, r2);
        });
      }

      /* ================= 3. o viaduto e o chão do vale ================= */
      const [via, v] = makeLayer(q);
      const spans = Math.max(13, Math.min(21, Math.round(W / 60)));
      const piers = Array.from({ length: spans + 1 }, (_, i) => at((total * i) / spans));

      // paredão: do leito dos trilhos até o chão
      v.beginPath();
      for (let i = 0; i <= 160; i++) {
        const pt = at((total * i) / 160);
        v.lineTo(pt.x, pt.y);
      }
      v.lineTo(W * 1.1, H + 4);
      v.lineTo(-W * 0.1, H + 4);
      v.closePath();
      const sg = v.createLinearGradient(0, topY, 0, H * 0.96);
      sg.addColorStop(0, p.stone[0]);
      sg.addColorStop(1, p.stone[1]);
      v.fillStyle = sg;
      v.fill();

      // textura de alvenaria
      v.globalCompositeOperation = "source-atop";
      const r3 = rng(19);
      for (let i = 0; i < 2600; i++) {
        const x = -M + r3() * (W + M * 2);
        const y = topY + r3() * (H - topY);
        v.fillStyle = r3() < 0.5 ? `rgba(0,0,0,${0.03 + r3() * 0.07})` : `rgba(255,255,255,${0.02 + r3() * 0.05})`;
        v.fillRect(x, y, 2 + r3() * 5, 1 + r3() * 1.6);
      }
      // sombra debaixo da cornija e escurecimento junto ao chão
      for (let i = 0; i < 160; i++) {
        const a = at((total * i) / 160);
        const b = at((total * (i + 1)) / 160);
        const d = H * 0.012 * a.s;
        v.fillStyle = "rgba(0,0,0,0.3)";
        v.fillRect(a.x, a.y + d, b.x - a.x + 0.6, Math.max(1, d * 0.55));
      }
      v.globalCompositeOperation = "source-over";

      // arcos vazados, com a espessura da abóbada visível
      piers.slice(0, -1).forEach((A, i) => {
        const B = piers[i + 1];
        const s = (A.s + B.s) / 2;
        const span = B.x - A.x;
        const pw = span * 0.2;
        const x0 = A.x + pw / 2;
        const x1 = B.x - pw / 2;
        const rad = (x1 - x0) / 2;
        const cx = (x0 + x1) / 2;
        const spring = (A.y + B.y) / 2 + H * 0.03 * s + rad;
        const open = (dx: number) => {
          v.beginPath();
          v.moveTo(x0 + dx, H + 6);
          v.lineTo(x0 + dx, spring);
          v.arc(cx + dx, spring, rad, Math.PI, 0);
          v.lineTo(x1 + dx, H + 6);
          v.closePath();
        };
        v.globalCompositeOperation = "destination-out";
        open(0);
        v.fill();
        v.globalCompositeOperation = "source-over";
        // intradorso: a face interna que se vê é a do lado mais distante de quem olha
        const dx = -((cx / W) * 2 - 1) * pw * 0.75;
        v.save();
        open(0);
        v.clip();
        const ig = v.createLinearGradient(0, spring - rad, 0, H);
        ig.addColorStop(0, p.soffit);
        ig.addColorStop(1, p.stone[1]);
        v.fillStyle = ig;
        v.fillRect(x0 - 2, spring - rad - 2, x1 - x0 + 4, H);
        v.globalCompositeOperation = "destination-out";
        open(dx);
        v.fill();
        v.restore();
        v.globalCompositeOperation = "source-over";
        // imposta (a pedra saliente onde o arco nasce) e aresta iluminada do pilar
        v.fillStyle = rgba(p.stoneLit, 0.2);
        v.fillRect(A.x - pw / 2 - 0.8, spring, pw + 1.6, Math.max(1, H * 0.0035 * s));
        v.fillStyle = rgba(p.stoneLit, 0.16);
        const lit = cx < sunX ? x1 : x0 - 1.2;
        v.fillRect(lit, spring, 1.2, H);
      });

      // bruma: as pontas do viaduto estão mais longe
      v.globalCompositeOperation = "source-atop";
      const hz = v.createLinearGradient(-M, 0, W + M, 0);
      hz.addColorStop(0, rgba(p.fog, p.dusk ? 0.3 : 0.4));
      hz.addColorStop(0.3, rgba(p.fog, 0));
      hz.addColorStop(0.7, rgba(p.fog, 0));
      hz.addColorStop(1, rgba(p.fog, p.dusk ? 0.3 : 0.4));
      v.fillStyle = hz;
      v.fillRect(-M, 0, W + M * 2, H);
      v.globalCompositeOperation = "source-over";

      // chão do vale à frente dos pilares
      const gn = makeNoise(88);
      const groundY = (x: number) =>
        H * (0.935 - 0.3 * Math.abs((x / W) * 2 - 1) ** 1.7) + (gn.fbm((x / W) * 5, 3) - 0.5) * H * 0.035;
      v.beginPath();
      v.moveTo(-M, H + 4);
      for (let x = -M; x <= W + M; x += 4) v.lineTo(x, groundY(x));
      v.lineTo(W + M, H + 4);
      v.closePath();
      const gg = v.createLinearGradient(0, H * 0.66, 0, H);
      gg.addColorStop(0, p.ground[0]);
      gg.addColorStop(1, p.ground[1]);
      v.fillStyle = gg;
      v.fill();
      v.strokeStyle = p.groundRim;
      v.lineWidth = 1.2;
      v.beginPath();
      for (let x = -M; x <= W + M; x += 4) v.lineTo(x, groundY(x) + 0.6);
      v.stroke();
      // urze e capim
      const r4 = rng(64);
      for (let i = 0; i < 1100; i++) {
        const x = -M + r4() * (W + M * 2);
        const gy = groundY(x);
        const t = r4() ** 1.3;
        const y = gy + 3 + t * (H - gy);
        v.fillStyle = p.heather[Math.floor(r4() * p.heather.length)];
        v.beginPath();
        v.ellipse(x, y, (2 + r4() * 6) * (0.6 + t), (0.8 + r4() * 1.6) * (0.6 + t), 0, 0, Math.PI * 2);
        v.fill();
      }
      // riacho que passa sob o arco central
      const rx = W * 0.585;
      const ry = groundY(rx) + 2;
      v.beginPath();
      v.moveTo(rx - 2, ry);
      v.bezierCurveTo(rx - W * 0.01, ry + (H - ry) * 0.4, rx + W * 0.02, ry + (H - ry) * 0.55, rx + W * 0.015, H + 2);
      v.lineTo(rx + W * 0.06, H + 2);
      v.bezierCurveTo(rx + W * 0.045, ry + (H - ry) * 0.55, rx + W * 0.012, ry + (H - ry) * 0.4, rx + 3, ry);
      v.closePath();
      const rg = v.createLinearGradient(0, ry, 0, H);
      rg.addColorStop(0, p.lake[0]);
      rg.addColorStop(1, rgba(p.dusk ? [120, 110, 150] : [150, 190, 215], 0.75));
      v.fillStyle = rg;
      v.globalAlpha = p.dusk ? 0.75 : 0.85;
      v.fill();
      v.globalAlpha = 1;
      // árvores ao pé do viaduto
      const near: [number, number, number, boolean][] = [];
      for (let i = 0; i < 46; i++) {
        const x = -M + r4() * (W + M * 2);
        if (Math.abs(x / W - 0.6) < 0.05) continue;
        const y = groundY(x) + H * (0.01 + r4() * 0.06);
        near.push([x, y, H * (0.016 + r4() * 0.02) * (0.6 + (y / H - 0.6) * 1.6), r4() < 0.5]);
      }
      near.sort((a, b) => a[1] - b[1]);
      near.forEach(([x, y, s, isPine], i) => {
        if (isPine) pine(v, x, y, s * 3.6, p.tree, p.treeRim, 900 + i);
        else blob(v, x, y, s, p.tree, p.treeRim, r4);
      });

      /* ================= 4. primeiro plano ================= */
      const [fg, f] = makeLayer(q);
      const mist = f.createLinearGradient(0, H * 0.8, 0, H);
      mist.addColorStop(0, "rgba(0,0,0,0)");
      mist.addColorStop(1, p.dusk ? "rgba(8,10,16,0.9)" : "rgba(30,52,34,0.7)");
      f.fillStyle = mist;
      f.fillRect(-M, H * 0.8, W + M * 2, H * 0.2);
      const fn = makeNoise(120);
      const bankY = (x: number) =>
        H * (1.01 - 0.11 * Math.abs((x / W) * 2 - 1) ** 2.2) + (fn.fbm((x / W) * 4, 3) - 0.5) * H * 0.03;
      const r5 = rng(99);
      const big: [number, number, number][] = [];
      for (let i = 0; i < 70; i++) {
        const side = r5() < 0.5 ? -1 : 1;
        const e = r5() ** 0.6; // mais árvores nas bordas
        const x = W * (0.5 + side * e * 0.56);
        big.push([x, bankY(x) + H * 0.02, H * (0.07 + r5() * 0.1) * (0.45 + e * 1.1)]);
      }
      big.sort((a, b) => a[1] - b[1]);
      big.forEach(([x, y, h], i) => pine(f, x, y, h, p.fgTree, p.fgRim, 2000 + i));
      f.fillStyle = p.fgTree;
      f.beginPath();
      f.moveTo(-M, H + 2);
      for (let x = -M; x <= W + M; x += 6) f.lineTo(x, bankY(x) + H * 0.012);
      f.lineTo(W + M, H + 2);
      f.closePath();
      f.fill();

      layers = [back, mid, via, fg];

      // névoa em faixas, repetível na horizontal
      fogTex = document.createElement("canvas");
      fogTex.width = 900;
      fogTex.height = 160;
      const fgx = fogTex.getContext("2d")!;
      const r6 = rng(3);
      for (let i = 0; i < 46; i++) {
        const x = r6() * 900;
        const y = 40 + r6() * 80;
        const rw = 90 + r6() * 170;
        const rh = 14 + r6() * 26;
        for (const ox of [-900, 0, 900]) {
          fgx.save();
          fgx.translate(x + ox, y);
          fgx.scale(1, rh / rw);
          const cg = fgx.createRadialGradient(0, 0, 0, 0, 0, rw);
          cg.addColorStop(0, rgba(p.fog, 0.2));
          cg.addColorStop(1, rgba(p.fog, 0));
          fgx.fillStyle = cg;
          fgx.beginPath();
          fgx.arc(0, 0, rw, 0, Math.PI * 2);
          fgx.fill();
          fgx.restore();
        }
      }

      flies = p.dusk
        ? Array.from({ length: 16 }, () => ({ x: r6() * W, y: H * (0.78 + r6() * 0.18), p: r6() * 6.28, s: 0.5 + r6() }))
        : [];

      buildTrain();
    };

    /* ---------------------------- animação ---------------------------- */

    const unit = () => (H * 0.056) / 100; // px por unidade do trem, com escala 1
    const speed = () => Math.max(58, W * 0.05);
    let head = 0;
    let wait = 0;
    let puffs: Puff[] = [];
    let chuff = 0;
    let clock = 0;
    let shooting: { x: number; y: number; vx: number; vy: number; life: number } | null = null;
    let mx = 0; // ponteiro suavizado, -1..1
    let targetMx = 0;

    const fogBand = (y: number, h: number, shift: number, alpha: number) => {
      const w = h * (900 / 160) * 1.6;
      let x = -(((shift % w) + w) % w) - M;
      ctx.globalAlpha = alpha;
      for (; x < W + M; x += w) ctx.drawImage(fogTex, x, y, w + 1, h);
      ctx.globalAlpha = 1;
    };

    let raf = 0;
    let last = performance.now();
    let visible = false;

    const frame = (t: number) => {
      const dt = Math.min(0.05, (t - last) / 1000);
      last = t;
      clock += dt;
      mx += (targetMx - mx) * Math.min(1, dt * 2.5);
      const ox = [-mx * 5, -mx * 11, -mx * 17, -mx * 28];
      const p = pal;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);

      // 1. céu
      ctx.drawImage(layers[0], ox[0] - M, 0, W + M * 2, H);
      if (p.dusk) {
        for (const s of stars) {
          ctx.globalAlpha = 0.25 + 0.6 * (0.5 + 0.5 * Math.sin(clock * (0.8 + s.s) + s.p));
          ctx.fillStyle = "#fff";
          ctx.fillRect(s.x + ox[0], s.y, s.s, s.s);
        }
        ctx.globalAlpha = 1;
        if (!reduce) {
          if (!shooting && Math.random() < dt * 0.07) {
            shooting = { x: W * (0.1 + Math.random() * 0.6), y: H * (0.12 + Math.random() * 0.12), vx: W * 0.36, vy: H * 0.1, life: 0.9 };
          }
          if (shooting) {
            const tx = shooting.x - shooting.vx * 0.16;
            const ty = shooting.y - shooting.vy * 0.16;
            const sgr = ctx.createLinearGradient(shooting.x, shooting.y, tx, ty);
            sgr.addColorStop(0, `rgba(255,255,255,${Math.min(1, shooting.life)})`);
            sgr.addColorStop(1, "rgba(255,255,255,0)");
            ctx.strokeStyle = sgr;
            ctx.lineWidth = 1.3;
            ctx.beginPath();
            ctx.moveTo(shooting.x, shooting.y);
            ctx.lineTo(tx, ty);
            ctx.stroke();
            shooting.x += shooting.vx * dt;
            shooting.y += shooting.vy * dt;
            shooting.life -= dt;
            if (shooting.life <= 0) shooting = null;
          }
        }
      }
      // brilho vivo na água
      ctx.strokeStyle = rgba(p.shimmer, 1);
      ctx.lineWidth = 1;
      for (const s of glints) {
        const a = Math.max(0, Math.sin(clock * 1.6 + s.p));
        if (a < 0.05) continue;
        ctx.globalAlpha = a * 0.75;
        ctx.beginPath();
        ctx.moveTo(s.x + ox[0], s.y);
        ctx.lineTo(s.x + ox[0] + s.w, s.y);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;

      // 2. vale + névoa que corre por trás do viaduto
      ctx.drawImage(layers[1], ox[1] - M, 0, W + M * 2, H);
      fogBand(H * 0.56, H * 0.24, clock * 7 + ox[1] * -1, p.fogAlpha);

      // 3. viaduto
      ctx.drawImage(layers[2], ox[2] - M, 0, W + M * 2, H);

      // ---- trem ----
      if (wait > 0) wait -= dt;
      else if (!reduce) head += speed() * dt;
      ctx.save();
      ctx.translate(ox[2], 0);
      let chimney: { x: number; y: number; s: number; ang: number } | null = null;
      let front = head;
      let tail = head;
      const u0 = unit();
      for (const car of cars) {
        const s = at(front - car.L * u0 * at(front).s * 0.5).s;
        const len = car.L * u0 * s;
        const back = front - len;
        tail = back;
        const a = at(back);
        const b = at(front);
        if (b.x > -M - 60 && a.x < W + M + 60) {
          const chord = Math.hypot(b.x - a.x, b.y - a.y);
          const u = chord / car.L;
          const ang = Math.atan2(b.y - a.y, b.x - a.x);
          ctx.save();
          ctx.translate(a.x, a.y);
          ctx.rotate(ang);
          ctx.scale(u, u);
          ctx.drawImage(car.spr, -PAD, -SPR_TOP, car.L + PAD * 2, SPR_H);
          if (car.kind === 0) {
            // biela acoplada às rodas motrizes
            const th = head / (19 * u);
            const bx = Math.cos(th) * 8;
            const by = Math.sin(th) * 8;
            ctx.strokeStyle = p.locoHi;
            ctx.lineWidth = 3.2;
            ctx.lineCap = "round";
            ctx.beginPath();
            ctx.moveTo(118 + bx, -19 + by);
            ctx.lineTo(202 + bx, -19 + by);
            ctx.moveTo(202 + bx, -19 + by);
            ctx.lineTo(256, -33);
            ctx.stroke();
            if (p.dusk) {
              ctx.globalCompositeOperation = "lighter";
              // fornalha
              ctx.globalAlpha = 0.5 + 0.12 * Math.sin(clock * 9);
              ctx.drawImage(glow, 67 - 60, -68 - 60, 120, 120);
              // farol e seu facho
              ctx.globalAlpha = 0.95;
              ctx.drawImage(glow, 302 - 40, -46 - 40, 80, 80);
              const beam = ctx.createLinearGradient(302, 0, 520, 0);
              beam.addColorStop(0, "rgba(255,220,150,0.34)");
              beam.addColorStop(1, "rgba(255,220,150,0)");
              ctx.fillStyle = beam;
              ctx.globalAlpha = 1;
              ctx.beginPath();
              ctx.moveTo(302, -48);
              ctx.lineTo(520, -78);
              ctx.lineTo(520, -6);
              ctx.lineTo(302, -43);
              ctx.closePath();
              ctx.fill();
              ctx.globalCompositeOperation = "source-over";
            }
            const cos = Math.cos(ang);
            const sin = Math.sin(ang);
            chimney = { x: a.x + (272 * cos + 104 * sin) * u, y: a.y + (272 * sin - 104 * cos) * u, s, ang };
          } else if (car.kind === 2 && p.dusk) {
            // luz das janelas vazando para fora
            ctx.globalCompositeOperation = "lighter";
            ctx.globalAlpha = 0.3;
            for (let k = 0; k < 5; k++) ctx.drawImage(glow, 62 + k * 71 - 55, -66 - 55, 110, 110);
            ctx.globalAlpha = 1;
            ctx.globalCompositeOperation = "source-over";
          }
          ctx.restore();
        }
        front = back - 5 * u0 * s;
      }
      if (wait <= 0 && !reduce && tail > total + W * 0.04) {
        head = -W * 0.04;
        wait = 3;
        puffs = puffs.slice();
      }

      // parapeito da frente: esconde a base das rodas
      const segs = 70;
      ctx.fillStyle = p.stone[0];
      ctx.beginPath();
      for (let i = 0; i <= segs; i++) {
        const a = at((total * i) / segs);
        ctx.lineTo(a.x, a.y - Math.max(1.6, H * 0.0075 * a.s));
      }
      for (let i = segs; i >= 0; i--) {
        const a = at((total * i) / segs);
        ctx.lineTo(a.x, a.y + 1);
      }
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = rgba(p.stoneLit, p.dusk ? 0.55 : 0.75);
      ctx.lineWidth = 1.1;
      ctx.lineCap = "butt";
      ctx.beginPath();
      for (let i = 0; i <= segs; i++) {
        const a = at((total * i) / segs);
        ctx.lineTo(a.x, a.y - Math.max(1.6, H * 0.0075 * a.s) + 0.4);
      }
      ctx.stroke();

      // vapor: sai em baforadas ritmadas e se desfaz no vento
      if (chimney && !reduce && wait <= 0) {
        chuff -= dt;
        if (chuff <= 0) {
          chuff = 0.075;
          const beat = 0.6 + 0.4 * Math.abs(Math.sin(clock * 5.2));
          for (let k = 0; k < 2; k++) {
            puffs.push({
              x: chimney.x + (Math.random() - 0.5) * 2,
              y: chimney.y,
              vx: -speed() * 0.2 + (Math.random() - 0.5) * 12,
              vy: -H * (0.055 + Math.random() * 0.04) * beat,
              r: H * (0.008 + Math.random() * 0.004) * chimney.s,
              life: 0,
              max: 3.4 + Math.random() * 2.2,
            });
          }
        }
      }
      for (const q of puffs) {
        q.life += dt;
        q.vx += (-W * 0.012 - q.vx) * dt * 0.5;
        q.vy *= 1 - dt * 0.55;
        q.x += q.vx * dt + Math.sin(q.life * 2.3 + q.max * 9) * H * 0.004 * dt * 6;
        q.y += q.vy * dt;
        q.r += H * 0.021 * dt * (1 - (q.life / q.max) * 0.5);
      }
      puffs = puffs.filter((q) => q.life < q.max);
      for (const q of puffs) {
        const k = q.life / q.max;
        const a = (1 - k) ** 1.4 * Math.min(1, k / 0.05) * p.steamAlpha;
        const s = q.r * 2.6;
        ctx.globalAlpha = a;
        ctx.drawImage(softCool, q.x - s / 2, q.y - s / 2, s, s);
        const warm = Math.max(0, 1 - k * 2.6);
        if (warm > 0) {
          ctx.globalAlpha = a * warm;
          ctx.drawImage(softWarm, q.x - s / 2, q.y - s / 2 + s * 0.06, s, s);
        }
      }
      ctx.globalAlpha = 1;
      ctx.restore();

      // névoa baixa à frente dos pilares
      fogBand(H * 0.78, H * 0.26, -clock * 11 + ox[2] * -1, p.fogAlpha * 1.15);

      // 4. primeiro plano
      ctx.drawImage(layers[3], ox[3] - M, 0, W + M * 2, H);

      // vaga-lumes
      if (flies.length) {
        ctx.globalCompositeOperation = "lighter";
        for (const fl of flies) {
          const a = Math.max(0, Math.sin(clock * (0.7 + fl.s * 0.5) + fl.p));
          if (a < 0.05) continue;
          const x = fl.x + Math.sin(clock * 0.31 * fl.s + fl.p) * W * 0.025 + ox[3];
          const y = fl.y + Math.cos(clock * 0.43 * fl.s + fl.p * 2) * H * 0.02;
          const s = 9 + fl.s * 7;
          ctx.globalAlpha = a * 0.85;
          ctx.drawImage(glow, x - s / 2, y - s / 2, s, s);
        }
        ctx.globalAlpha = 1;
        ctx.globalCompositeOperation = "source-over";
      }

      if (visible && !reduce) raf = requestAnimationFrame(frame);
    };

    const restart = () => {
      cancelAnimationFrame(raf);
      last = performance.now();
      raf = requestAnimationFrame(frame);
    };

    let first = true;
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      const keep = total ? head / total : 0.3;
      W = Math.max(320, rect.width);
      H = Math.max(240, rect.height);
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      build();
      head = total * (reduce ? 0.7 : first ? 0.3 : keep);
      puffs = [];
      if (first && !reduce) {
        // adianta dois segundos de simulação: o trem já aparece soltando vapor
        const was = visible;
        visible = false;
        const now = performance.now();
        for (let i = 0; i < 40; i++) {
          last = now - 50;
          frame(now);
        }
        visible = was;
      }
      first = false;
      restart();
    };

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const io = new IntersectionObserver(
      ([e]) => {
        visible = e.isIntersecting;
        cancelAnimationFrame(raf);
        if (visible) restart();
      },
      { rootMargin: "100px" },
    );
    io.observe(canvas);

    // dia / entardecer acompanham o tema
    const mo = new MutationObserver(() => {
      const next = document.documentElement.classList.contains("dark") ? DUSK : DAY;
      if (W && next !== pal) {
        build();
        puffs = [];
        restart();
      }
    });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    const onMove = (e: PointerEvent) => {
      if (!reduce) targetMx = Math.max(-1, Math.min(1, (e.clientX / window.innerWidth) * 2 - 1));
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      mo.disconnect();
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return <canvas ref={ref} className={className} role="img" aria-label={label} />;
}

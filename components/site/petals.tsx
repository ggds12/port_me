"use client";

import { useEffect, useRef } from "react";

/* ------------------------------------------------------------------ */
/*  Sólidos de dados caindo: cubos (data cube), bancos (cilindros     */
/*  empilhados) e tabelas (folhas que planam), em bronze, prata e     */
/*  ouro — as camadas da arquitetura medalhão.                         */
/*                                                                    */
/*  Cada peça é um objeto 3D de verdade: gira em três eixos, tem      */
/*  faces iluminadas por uma luz fixa, gradiente e grão. A            */
/*  profundidade vem de três camadas com foco diferente (longe,       */
/*  meio nítido, perto desfocado).                                    */
/* ------------------------------------------------------------------ */

type V3 = [number, number, number];
type Tex = { base: HTMLCanvasElement; dark: HTMLCanvasElement; light: HTMLCanvasElement };
type Skin = { face: Tex; cap: Tex; body: Tex; card: Tex; back: Tex };

type Piece = {
  kind: 0 | 1 | 2; // cubo, banco, tabela
  skin: number;
  layer: 0 | 1 | 2;
  x: number;
  y: number;
  z: number;
  s: number; // meia-aresta em px
  ax: number;
  ay: number;
  az: number;
  wx: number;
  wy: number;
  wz: number;
  vy: number;
  sway: number;
  phase: number;
};

/** [claro, escuro, sulco] */
const METALS: [string, string, string][] = [
  ["#f0a868", "#b4571c", "rgba(70,24,0,0.34)"], // bronze
  ["#fbf3e6", "#b3a797", "rgba(60,44,30,0.30)"], // prata
  ["#ffd978", "#ea8f12", "rgba(96,44,0,0.32)"], // ouro
];
const SKIN_WEIGHTS = [0.36, 0.22, 0.42];

const T = 192;
const LIGHT: V3 = [-0.447, -0.744, 0.496]; // de cima, à esquerda, vindo da tela

function mk(w: number, h: number) {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  return [c, c.getContext("2d")!] as const;
}

function makeNoiseTile() {
  const [c, g] = mk(128, 128);
  const img = g.createImageData(128, 128);
  for (let i = 0; i < img.data.length; i += 4) {
    const white = Math.random() < 0.5;
    const v = white ? 255 : 0;
    img.data[i] = img.data[i + 1] = img.data[i + 2] = v;
    img.data[i + 3] = Math.random() ** 2 * (white ? 70 : 56);
  }
  g.putImageData(img, 0, 0);
  return c;
}

/** Uma textura + suas silhuetas preta e branca (para sombrear por face). */
function tex(w: number, h: number, noise: HTMLCanvasElement, paint: (g: CanvasRenderingContext2D) => void): Tex {
  const [base, g] = mk(w, h);
  paint(g);
  // grão só onde há tinta
  g.globalCompositeOperation = "source-atop";
  g.fillStyle = g.createPattern(noise, "repeat")!;
  g.fillRect(0, 0, w, h);
  const solid = (color: string) => {
    const [c, s] = mk(w, h);
    s.drawImage(base, 0, 0);
    s.globalCompositeOperation = "source-in";
    s.fillStyle = color;
    s.fillRect(0, 0, w, h);
    return c;
  };
  return { base, dark: solid("#120a04"), light: solid("#fff8ec") };
}

function makeSkin([hi, lo, groove]: [string, string, string], noise: HTMLCanvasElement): Skin {
  const lin = (g: CanvasRenderingContext2D, x0: number, y0: number, x1: number, y1: number, a = hi, b = lo) => {
    const gr = g.createLinearGradient(x0, y0, x1, y1);
    gr.addColorStop(0, a);
    gr.addColorStop(1, b);
    return gr;
  };
  const edge = "rgba(255,255,255,0.42)";

  // face do cubo: quadrado com sulcos 2×2
  const face = tex(T, T, noise, (g) => {
    g.beginPath();
    g.roundRect(0, 0, T, T, T * 0.09);
    g.fillStyle = lin(g, 0, 0, T, T);
    g.fill();
    g.strokeStyle = groove;
    g.lineWidth = T * 0.03;
    g.beginPath();
    g.moveTo(T / 2, T * 0.05);
    g.lineTo(T / 2, T * 0.95);
    g.moveTo(T * 0.05, T / 2);
    g.lineTo(T * 0.95, T / 2);
    g.stroke();
    g.strokeStyle = edge;
    g.lineWidth = T * 0.022;
    g.beginPath();
    g.roundRect(T * 0.02, T * 0.02, T * 0.96, T * 0.96, T * 0.075);
    g.stroke();
  });

  // tampa do cilindro
  const cap = tex(T, T, noise, (g) => {
    const gr = g.createRadialGradient(T * 0.36, T * 0.32, T * 0.04, T / 2, T / 2, T / 2);
    gr.addColorStop(0, hi);
    gr.addColorStop(1, lo);
    g.fillStyle = gr;
    g.beginPath();
    g.arc(T / 2, T / 2, T / 2, 0, Math.PI * 2);
    g.fill();
    g.strokeStyle = groove;
    g.lineWidth = T * 0.028;
    g.beginPath();
    g.arc(T / 2, T / 2, T * 0.3, 0, Math.PI * 2);
    g.stroke();
    g.strokeStyle = edge;
    g.lineWidth = T * 0.024;
    g.beginPath();
    g.arc(T / 2, T / 2, T * 0.475, 0, Math.PI * 2);
    g.stroke();
  });

  // lateral do cilindro: sombreamento cilíndrico no eixo y da textura
  const body = tex(T, T, noise, (g) => {
    g.fillStyle = lin(g, 0, 0, 0, T);
    g.fillRect(0, 0, T, T);
    const sh = g.createLinearGradient(0, 0, 0, T);
    sh.addColorStop(0, "rgba(0,0,0,0.22)");
    sh.addColorStop(0.22, "rgba(255,255,255,0.3)");
    sh.addColorStop(0.42, "rgba(0,0,0,0)");
    sh.addColorStop(0.72, "rgba(0,0,0,0.16)");
    sh.addColorStop(1, "rgba(0,0,0,0.5)");
    g.fillStyle = sh;
    g.fillRect(0, 0, T, T);
  });

  // tabela: folha com cabeçalho, linhas e colunas
  const CW = Math.round(T * 1.34);
  const sheet = (g: CanvasRenderingContext2D, rows: boolean) => {
    g.beginPath();
    g.roundRect(0, 0, CW, T, T * 0.1);
    g.fillStyle = rows ? lin(g, 0, 0, CW, T) : lin(g, 0, 0, CW, T, lo, hi);
    g.fill();
    g.save();
    g.clip();
    if (rows) {
      g.fillStyle = groove;
      g.fillRect(0, 0, CW, T * 0.25);
      g.fillRect(0, T * 0.25 + T * 0.245, CW, T * 0.022);
      g.fillRect(0, T * 0.25 + T * 0.495, CW, T * 0.022);
      g.fillRect(CW * 0.34, T * 0.25, T * 0.022, T);
      g.fillRect(CW * 0.67, T * 0.25, T * 0.022, T);
    } else {
      g.fillStyle = "rgba(0,0,0,0.12)";
      g.fillRect(0, 0, CW, T);
    }
    g.restore();
    g.strokeStyle = edge;
    g.lineWidth = T * 0.022;
    g.beginPath();
    g.roundRect(T * 0.02, T * 0.02, CW - T * 0.04, T * 0.96, T * 0.085);
    g.stroke();
  };
  const card = tex(CW, T, noise, (g) => sheet(g, true));
  const back = tex(CW, T, noise, (g) => sheet(g, false));

  return { face, cap, body, card, back };
}

export function Petals() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current!;
    const canvases = Array.from(root.querySelectorAll("canvas"));
    const ctxs = canvases.map((c) => c.getContext("2d")!);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const noise = makeNoiseTile();
    const skins = METALS.map((m) => makeSkin(m, noise));

    let W = 0;
    let H = 0;
    let dpr = 1;
    // a camada "perto" é renderizada em meia resolução: ela é desfocada de qualquer forma
    const res = [1, 1, 0.5];
    let pieces: Piece[] = [];
    let raf = 0;
    let last = performance.now();
    let scrollY = window.scrollY;

    const pickSkin = () => {
      let r = Math.random();
      for (let i = 0; i < SKIN_WEIGHTS.length; i++) {
        r -= SKIN_WEIGHTS[i];
        if (r <= 0) return i;
      }
      return 0;
    };

    /** As peças maiores preferem as margens, para não disputar com o texto. */
    const spawnX = (layer: number) => {
      const side = (W - 680) / 2;
      if (layer === 0 || side < 90 || Math.random() < 0.18) return Math.random() * W;
      const x = Math.random() * side;
      return Math.random() < 0.5 ? x : W - x;
    };

    const spawn = (layer: 0 | 1 | 2, anywhere: boolean): Piece => {
      const t = Math.random();
      const z = layer === 0 ? 0.1 + t * 0.25 : layer === 1 ? 0.4 + t * 0.35 : 0.85 + t * 0.15;
      const s = layer === 0 ? 7 + t * 6 : layer === 1 ? 15 + t * 13 : 40 + t * 22;
      const kind = Math.floor(Math.random() * 3) as 0 | 1 | 2;
      const spin = (kind === 2 ? 1.5 : 1) * (0.25 + Math.random() * 0.5);
      const w = () => (Math.random() - 0.5) * 2 * spin;
      return {
        kind,
        skin: pickSkin(),
        layer,
        x: spawnX(layer),
        y: anywhere ? Math.random() * H : -s * 3 - Math.random() * 160,
        z,
        s,
        ax: Math.random() * 6.28,
        ay: Math.random() * 6.28,
        az: Math.random() * 6.28,
        wx: w(),
        wy: w(),
        wz: w() * 0.5,
        vy: (9 + z * 30 + Math.random() * 8) * (kind === 2 ? 0.75 : 1),
        sway: (10 + Math.random() * 22) * (kind === 2 ? 1.8 : 1),
        phase: Math.random() * 6.28,
      };
    };

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = window.innerWidth;
      H = window.innerHeight;
      canvases.forEach((c, i) => {
        c.width = Math.round(W * dpr * res[i]);
        c.height = Math.round(H * dpr * res[i]);
      });
      const k = Math.min(1, Math.max(0.4, W / 1280));
      const counts = [Math.round(12 * k), Math.round(10 * k), Math.max(2, Math.round(3 * k))];
      pieces = [];
      counts.forEach((n, layer) => {
        for (let i = 0; i < n; i++) pieces.push(spawn(layer as 0 | 1 | 2, true));
      });
      pieces.sort((a, b) => a.z - b.z);
    };

    /** Desenha a textura no paralelogramo de origem P e arestas U, V. */
    let g: CanvasRenderingContext2D;
    let k = 1;
    const quad = (t: Tex, b: number, px: number, py: number, ux: number, uy: number, vx: number, vy: number) => {
      const w = t.base.width;
      const h = t.base.height;
      g.setTransform((k * ux) / w, (k * uy) / w, (k * vx) / h, (k * vy) / h, k * px, k * py);
      g.globalAlpha = 1;
      g.drawImage(t.base, 0, 0);
      if (b < 1) {
        g.globalAlpha = Math.min(0.85, (1 - b) * 1.15);
        g.drawImage(t.dark, 0, 0);
      } else if (b > 1) {
        g.globalAlpha = Math.min(0.55, (b - 1) * 1.3);
        g.drawImage(t.light, 0, 0);
      }
    };
    const lit = (nx: number, ny: number, nz: number) =>
      0.5 + 0.8 * Math.max(0, nx * LIGHT[0] + ny * LIGHT[1] + nz * LIGHT[2]);

    const drawPiece = (p: Piece) => {
      const cx = Math.cos(p.ax), sx = Math.sin(p.ax);
      const cy = Math.cos(p.ay), sy = Math.sin(p.ay);
      const cz = Math.cos(p.az), sz = Math.sin(p.az);
      // colunas da matriz de rotação = eixos locais no espaço da tela
      const X: V3 = [cz * cy, sz * cy, -sy];
      const Y: V3 = [cz * sy * sx - sz * cx, sz * sy * sx + cz * cx, cy * sx];
      const Z: V3 = [cz * sy * cx + sz * sx, sz * sy * cx - cz * sx, cy * cx];
      const skin = skins[p.skin];
      const s = p.s;

      if (p.kind === 0) {
        const axes = [X, Y, Z];
        for (let i = 0; i < 3; i++) {
          const n = axes[i];
          if (Math.abs(n[2]) < 0.02) continue;
          const sg = n[2] > 0 ? 1 : -1;
          const u = axes[(i + 1) % 3];
          const v = axes[(i + 2) % 3];
          const fx = p.x + n[0] * sg * s;
          const fy = p.y + n[1] * sg * s;
          quad(
            skin.face,
            lit(n[0] * sg, n[1] * sg, n[2] * sg),
            fx - (u[0] + v[0]) * s,
            fy - (u[1] + v[1]) * s,
            u[0] * 2 * s,
            u[1] * 2 * s,
            v[0] * 2 * s,
            v[1] * 2 * s,
          );
        }
      } else if (p.kind === 1) {
        const r = s * 1.05;
        const hd = s * 0.5;
        const step = hd + s * 0.2;
        const sg = Y[2] >= 0 ? 1 : -1;
        const lightSide = (px: number, py: number) => (px * LIGHT[0] + py * LIGHT[1] > 0 ? 1 : -1);
        for (let j = -1; j <= 1; j++) {
          const off = j * sg * step; // de trás para a frente
          const mx = p.x + Y[0] * off;
          const my = p.y + Y[1] * off;
          const hx = Y[0] * sg * hd * 0.5;
          const hy = Y[1] * sg * hd * 0.5;
          const capAt = (qx: number, qy: number, b: number) =>
            quad(
              skin.cap,
              b,
              qx - (X[0] + Z[0]) * r,
              qy - (X[1] + Z[1]) * r,
              X[0] * 2 * r,
              X[1] * 2 * r,
              Z[0] * 2 * r,
              Z[1] * 2 * r,
            );
          capAt(mx - hx, my - hy, 0.52);
          const dx = hx * 2;
          const dy = hy * 2;
          const len = Math.hypot(dx, dy);
          if (len > 0.4) {
            let px = (-dy / len) * r;
            let py = (dx / len) * r;
            const side = lightSide(px, py);
            px *= side;
            py *= side;
            quad(skin.body, 0.96, mx - hx + px, my - hy + py, dx, dy, -2 * px, -2 * py);
          }
          capAt(mx + hx, my + hy, lit(Y[0] * sg, Y[1] * sg, Y[2] * sg));
        }
      } else {
        const front = Z[2] >= 0;
        const sg = front ? 1 : -1;
        const w = s * 1.34;
        quad(
          front ? skin.card : skin.back,
          lit(Z[0] * sg, Z[1] * sg, Z[2] * sg),
          p.x - X[0] * w - Y[0] * s,
          p.y - X[1] * w - Y[1] * s,
          X[0] * 2 * w,
          X[1] * 2 * w,
          Y[0] * 2 * s,
          Y[1] * 2 * s,
        );
      }
    };

    const draw = (t: number) => {
      const dt = Math.min(0.05, (t - last) / 1000);
      last = t;
      const sy = window.scrollY;
      const dScroll = sy - scrollY;
      scrollY = sy;
      ctxs.forEach((c, i) => {
        c.setTransform(1, 0, 0, 1, 0, 0);
        c.clearRect(0, 0, canvases[i].width, canvases[i].height);
      });
      for (const p of pieces) {
        if (!reduce) {
          p.phase += dt * 0.7;
          p.y += p.vy * dt - dScroll * (0.04 + p.z * 0.22); // paralaxe com o scroll
          p.x += Math.sin(p.phase) * p.sway * dt + 5 * dt;
          const flutter = p.kind === 2 ? 1 + 0.6 * Math.sin(p.phase * 2) : 1;
          p.ax += p.wx * dt * flutter;
          p.ay += p.wy * dt * flutter;
          p.az += p.wz * dt;
          const m = p.s * 3;
          if (p.y > H + m || p.x > W + m) Object.assign(p, spawn(p.layer, false));
          else if (p.y < -m - 200) p.y += H + m * 2 + 200;
        }
        g = ctxs[p.layer];
        k = dpr * res[p.layer];
        drawPiece(p);
      }
      if (!reduce) raf = requestAnimationFrame(draw);
    };

    resize();
    raf = requestAnimationFrame(draw);

    const onVis = () => {
      cancelAnimationFrame(raf);
      if (!document.hidden) {
        last = performance.now();
        raf = requestAnimationFrame(draw);
      }
    };
    const onResize = () => {
      resize();
      if (reduce) {
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(draw);
      }
    };
    window.addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", onVis);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  return (
    <div ref={ref} className="petals" aria-hidden="true">
      <canvas className="petals-far" />
      <canvas className="petals-mid" />
      <canvas className="petals-near" />
    </div>
  );
}

"use client";

import { useEffect, useRef } from "react";

type Node = { x: number; y: number; r: number };
type Packet = { from: number; to: number; t: number; speed: number };

/**
 * Cena de fluxo de dados — um grafo de nós conectados por arestas, com
 * "pacotes" de dados viajando de nó em nó. É a metáfora visual do
 * trabalho: dados fluindo da fonte bruta até a camada analítica.
 *
 * Canvas 2D puro, sem dependências. Reage ao mouse (os nós próximos ao
 * cursor se iluminam) e pausa fora da viewport. Respeita reduced-motion.
 */
export function Scene({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let width = 0;
    let height = 0;
    let dpr = 1;

    const nodes: Node[] = [];
    const packets: Packet[] = [];
    const NODE_COUNT = 14;

    const rand = (min: number, max: number) => min + Math.random() * (max - min);

    const build = () => {
      nodes.length = 0;
      packets.length = 0;
      for (let i = 0; i < NODE_COUNT; i++) {
        nodes.push({
          x: rand(0.08, 0.92) * width,
          y: rand(0.1, 0.9) * height,
          r: rand(2, 4),
        });
      }
      // Cria pacotes viajando entre nós próximos
      for (let i = 0; i < 26; i++) {
        const from = Math.floor(rand(0, NODE_COUNT));
        let to = Math.floor(rand(0, NODE_COUNT));
        if (to === from) to = (to + 1) % NODE_COUNT;
        packets.push({ from, to, t: Math.random(), speed: rand(0.002, 0.006) });
      }
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      build();
    };

    const accent = () =>
      getComputedStyle(document.documentElement)
        .getPropertyValue("--color-accent")
        .trim() || "oklch(62% 0.19 258)";
    const border = () =>
      getComputedStyle(document.documentElement)
        .getPropertyValue("--color-border")
        .trim() || "oklch(87% 0.01 250)";

    let mouseX = -9999;
    let mouseY = -9999;
    let raf = 0;
    let running = true;

    const onMouse = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    };
    const onLeave = () => {
      mouseX = -9999;
      mouseY = -9999;
    };

    const draw = () => {
      if (!running) return;
      ctx.clearRect(0, 0, width, height);

      const cAccent = accent();
      const cBorder = border();

      // Arestas
      ctx.lineWidth = 1;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i];
          const b = nodes[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < 260) {
            ctx.strokeStyle = cBorder;
            ctx.globalAlpha = (1 - d / 260) * 0.5;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }
      ctx.globalAlpha = 1;

      // Pacotes viajando
      for (const p of packets) {
        if (!reduced) {
          p.t += p.speed;
          if (p.t > 1) {
            p.t = 0;
            p.from = p.to;
            let next = Math.floor(rand(0, NODE_COUNT));
            if (next === p.from) next = (next + 1) % NODE_COUNT;
            p.to = next;
          }
        }
        const a = nodes[p.from];
        const b = nodes[p.to];
        const x = a.x + (b.x - a.x) * p.t;
        const y = a.y + (b.y - a.y) * p.t;
        ctx.fillStyle = cAccent;
        ctx.globalAlpha = 0.9;
        ctx.beginPath();
        ctx.arc(x, y, 2.2, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      // Nós (brilham perto do mouse)
      for (const n of nodes) {
        const d = Math.hypot(n.x - mouseX, n.y - mouseY);
        const near = d < 140;
        ctx.fillStyle = near ? cAccent : cBorder;
        ctx.globalAlpha = near ? 1 : 0.7;
        ctx.beginPath();
        ctx.arc(n.x, n.y, near ? n.r + 2 : n.r, 0, Math.PI * 2);
        ctx.fill();

        if (near) {
          ctx.globalAlpha = 0.25;
          ctx.beginPath();
          ctx.arc(n.x, n.y, n.r + 10, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1;

      raf = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMouse, { passive: true });
    window.addEventListener("mouseout", onLeave, { passive: true });

    const io = new IntersectionObserver(
      ([entry]) => {
        running = entry.isIntersecting;
        if (running) raf = requestAnimationFrame(draw);
        else cancelAnimationFrame(raf);
      },
      { threshold: 0 },
    );
    io.observe(canvas);

    raf = requestAnimationFrame(draw);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouse);
      window.removeEventListener("mouseout", onLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={`absolute inset-0 h-full w-full ${className ?? ""}`}
    />
  );
}

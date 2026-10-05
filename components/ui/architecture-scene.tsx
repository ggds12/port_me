"use client";

import { useEffect, useRef } from "react";
import type { CSSProperties, PointerEvent } from "react";
import "./architecture-scene.css";

function Connector({ split = false, phase = 0 }: { split?: boolean; phase?: number }) {
  const paths = split ? ["M50 0V15H17V38", "M50 0V38", "M50 0V15H83V38"] : ["M17 0V17H50V38", "M50 0V38", "M83 0V17H50V38"];
  return <svg className="data-wires" viewBox="0 0 100 38" preserveAspectRatio="none" aria-hidden="true">{paths.map((d, i) => <g key={d}><path className="data-wire" d={d} pathLength="100" /><path className="data-packet" d={d} pathLength="100" style={{ "--packet-delay": `${phase + i * .18}s` } as CSSProperties} /></g>)}</svg>;
}

function NodeIcon({ type }: { type: "database" | "api" | "events" }) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{type === "database" ? <><ellipse cx="12" cy="5" rx="7" ry="3" /><path d="M5 5v14c0 4 14 4 14 0V5M5 12c0 4 14 4 14 0" /></> : type === "api" ? <><path d="m8 6-6 6 6 6m8-12 6 6-6 6m-3-15-2 18" /></> : <><path d="m13 2-9 12h7l-1 8 10-12h-7l1-8Z" /></>}</svg>;
}

export function ArchitectureScene() {
  const root = useRef<HTMLDivElement>(null);
  const frame = useRef(0);
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    let visible = true;
    const update = () => el.setAttribute("data-paused", String(!visible || document.hidden));
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; update(); });
    observer.observe(el);
    document.addEventListener("visibilitychange", update);
    update();
    return () => { observer.disconnect(); document.removeEventListener("visibilitychange", update); cancelAnimationFrame(frame.current); };
  }, []);
  const move = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = root.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      el.style.setProperty("--scene-rx", `${(y - .5) * -5}deg`);
      el.style.setProperty("--scene-ry", `${(x - .5) * 6}deg`);
      el.style.setProperty("--scene-x", `${x * 100}%`);
      el.style.setProperty("--scene-y", `${y * 100}%`);
    });
  };
  const reset = () => {
    cancelAnimationFrame(frame.current);
    root.current?.style.setProperty("--scene-rx", "0deg");
    root.current?.style.setProperty("--scene-ry", "0deg");
  };
  return (
    <div ref={root} className="data-scene" onPointerMove={move} onPointerLeave={reset}>
      <div className="data-scene-aura" aria-hidden="true" />
      <figure className="data-console" aria-labelledby="architecture-caption">
        <div className="data-console-grid" aria-hidden="true" />
        <header className="data-console-header"><span className="data-console-label"><i aria-hidden="true" />DATA / FLOW</span><span className="data-console-version">PIPELINE .01</span></header>
        <div className="data-console-body">
          <div className="data-sources">{(["database", "api", "events"] as const).map((type, i) => <div className="data-source" key={type} style={{ "--node-delay": `${i * .18}s` } as CSSProperties}><NodeIcon type={type} /><span>{["SQL", "APIs", "EVENTOS"][i]}</span><i className="data-source-dot" aria-hidden="true" /></div>)}</div>
          <Connector />
          <div className="data-engine"><div className="data-engine-symbol" aria-hidden="true"><svg viewBox="0 0 40 40"><rect x="8" y="8" width="24" height="24" rx="6" /><path d="M16 1v6m8-6v6M16 33v6m8-6v6M1 16h6m-6 8h6m26-8h6m-6 8h6" /><path className="data-engine-glyph" d="m17 15-4 5 4 5m6-10 4 5-4 5" /></svg></div><div><strong>Ingestão & orquestração</strong><span>Go · Python · Apache Airflow</span></div><div className="data-engine-bars" aria-hidden="true"><i /><i /><i /><i /></div></div>
          <Connector split phase={1.7} />
          <div className="data-layers">{[{ name: "Bronze", detail: "Dados brutos", code: "RAW", tone: "bronze" }, { name: "Silver", detail: "Transformação", code: "CLEAN", tone: "silver" }, { name: "Gold", detail: "Valor de negócio", code: "READY", tone: "gold" }].map((layer, i) => <div className={`data-layer data-layer--${layer.tone}`} key={layer.name} style={{ "--layer-delay": `${2.8 + i * .4}s` } as CSSProperties}><div className="data-layer-head"><span>0{i + 1}</span><span className="data-layer-code">{layer.code}</span></div><div className="data-layer-stack" aria-hidden="true"><i /><i /><i /></div><strong>{layer.name}</strong><small>{layer.detail}</small><div className="data-layer-meter" aria-hidden="true"><i /></div></div>)}</div>
          <Connector phase={4.3} />
          <div className="data-destination"><div className="data-destination-icon" aria-hidden="true">◈</div><div><strong>Prontos para decidir.</strong><span>BigQuery / Analytics</span></div><svg className="data-chart" viewBox="0 0 64 30" aria-hidden="true"><path className="data-chart-grid" d="M0 29H64M0 15H64" /><path className="data-chart-line" d="m2 25 10-4 8 3 10-12 9 3 9-8 14-4" pathLength="100" /></svg></div>
        </div>
        <figcaption id="architecture-caption" className="data-console-footer"><span>ARQUITETURA ILUSTRATIVA</span><span className="data-cycle" aria-hidden="true"><i />SOURCE → INSIGHT</span></figcaption>
        <span className="visually-hidden">Fontes SQL, APIs e eventos passam por ingestão em Go, Python e Airflow, pelo data lake Bronze, Silver e Gold e chegam ao BigQuery. Animação demonstrativa.</span>
      </figure>
    </div>
  );
}

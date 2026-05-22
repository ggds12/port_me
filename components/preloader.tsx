"use client";

import { useEffect, useState } from "react";
import { profile } from "@/lib/data";

type Phase = "intro" | "exiting" | "done";

export function Preloader() {
  const [phase, setPhase] = useState<Phase>("intro");

  useEffect(() => {
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const prevOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";

    const exitAt = reduced ? 400 : 2200;
    const doneAt = reduced ? 700 : 3400;

    const exitTimer = window.setTimeout(() => setPhase("exiting"), exitAt);
    const doneTimer = window.setTimeout(() => {
      setPhase("done");
      document.documentElement.style.overflow = prevOverflow;
    }, doneAt);

    return () => {
      window.clearTimeout(exitTimer);
      window.clearTimeout(doneTimer);
      document.documentElement.style.overflow = prevOverflow;
    };
  }, []);

  if (phase === "done") return null;

  const isExit = phase === "exiting";

  return (
    <div
      aria-hidden={isExit ? "true" : "false"}
      role="status"
      aria-live="polite"
      className={`preloader fixed inset-0 z-50 overflow-hidden ${
        isExit ? "preloader--exiting" : ""
      }`}
    >
      {/* Top half — slides up on exit, carrying the name */}
      <div className="preloader__half preloader__half--top">
        <h1 className="preloader-name font-serif text-5xl italic leading-none tracking-(--tracking-tightest) text-(--color-foreground) sm:text-7xl">
          {profile.name}
        </h1>
      </div>

      {/* Bottom half — slides down on exit, carrying the welcome + mark */}
      <div className="preloader__half preloader__half--bottom">
        <p className="preloader-welcome font-serif text-lg italic text-(--color-muted-foreground) sm:text-xl">
          bem-vindo ao meu portfólio
        </p>
        <span className="preloader-mark font-mono text-xs tracking-(--tracking-mono) text-(--color-muted-foreground)">
          gg<span className="text-(--color-accent)">.</span>
        </span>
      </div>

      {/* Seam — the amber rule that becomes the axis of the split */}
      <span aria-hidden className="preloader-seam" />
    </div>
  );
}

"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Container } from "@/components/ui/container";
import { ThemeToggle } from "@/components/theme-toggle";
import { profile } from "@/lib/data";

const items = [
  { href: "#sobre", label: "Sobre" },
  { href: "#stack", label: "Stack" },
  { href: "#experiencia", label: "Experiência" },
  { href: "#projetos", label: "Projetos" },
  { href: "#contato", label: "Contato" },
];

export function Nav() {
  const [active, setActive] = useState<string>("");
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const sections = items
      .map((i) => document.querySelector(i.href))
      .filter(Boolean) as Element[];

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActive(`#${entry.target.id}`);
          }
        }
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 },
    );
    sections.forEach((s) => observer.observe(s));

    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  // Fecha o menu ao sair do layout mobile e libera a rolagem.
  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 640px)");
    const closeOnDesktop = () => {
      if (desktop.matches) setOpen(false);
    };
    closeOnDesktop();
    desktop.addEventListener("change", closeOnDesktop);
    return () => desktop.removeEventListener("change", closeOnDesktop);
  }, []);

  // Trava o scroll do body enquanto o menu mobile está aberto
  useEffect(() => {
    if (!open) return;
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.documentElement.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <header
        className={`sticky top-0 z-30 border-b bg-(--color-background)/80 backdrop-blur-md transition-[border-color,box-shadow] duration-300 ${
          scrolled
            ? "border-(--color-border) shadow-[0_1px_0_0_var(--color-border)]"
            : "border-transparent"
        }`}
        role="banner"
      >
        <Container as="div" className="flex h-14 items-center justify-between">
          <Link
            href="#top"
            className="font-mono text-sm tracking-(--tracking-mono) text-(--color-foreground)"
            aria-label={`Voltar ao topo, ${profile.name}`}
            onClick={() => setOpen(false)}
          >
            gg<span className="text-(--color-accent)">.</span>
          </Link>

          <nav aria-label="Seções" className="hidden sm:block">
            <ul className="flex items-center gap-7 text-sm text-(--color-muted-foreground)">
              {items.map((item) => {
                const isActive = active === item.href;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={isActive ? "true" : undefined}
                      className={`link-underline transition-colors ${
                        isActive
                          ? "text-(--color-foreground)"
                          : "hover:text-(--color-foreground)"
                      }`}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button
              type="button"
              className="nav-toggle sm:hidden"
              aria-label={open ? "Fechar menu" : "Abrir menu"}
              aria-expanded={open}
              aria-controls="mobile-menu"
              data-open={open ? "true" : "false"}
              onClick={() => setOpen((v) => !v)}
            >
              <span className="nav-toggle__bars" aria-hidden>
                <span />
                <span />
                <span />
              </span>
            </button>
          </div>
        </Container>
      </header>

      {/* Painel de navegação mobile */}
      <div
        id="mobile-menu"
        className="nav-panel sm:hidden"
        data-open={open ? "true" : "false"}
        aria-hidden={!open}
      >
        <nav aria-label="Seções (mobile)">
          <ul className="nav-panel__list">
            {items.map((item, i) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="nav-panel__link"
                  style={{ animationDelay: `${0.08 + i * 0.06}s` }}
                  onClick={() => setOpen(false)}
                  tabIndex={open ? 0 : -1}
                >
                  <span className="nav-panel__index">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </>
  );
}

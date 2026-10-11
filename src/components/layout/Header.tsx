"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { navLinks } from "@/config/site";
import { cn } from "@/lib/cn";
import { WhatsAppCta } from "@/components/ui/CtaLink";
import { Logo } from "@/components/ui/Logo";
import { scrollToHash, useLenis } from "./SmoothScroll";

export function Header() {
  const pathname = usePathname();
  const lenis = useLenis();
  const reduce = useReducedMotion();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string>("#inicio");
  const menuButton = useRef<HTMLButtonElement>(null);
  // Na home, os elementos do cabeçalho participam da animação de abertura.
  const heroFade = pathname === "/" ? { "data-hero-fade": "" } : {};

  // Barra com blur após o início da página.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Destaque do link da seção visível (apenas na home).
  useEffect(() => {
    if (pathname !== "/") return;
    const sections = navLinks
      .map((l) => document.querySelector<HTMLElement>(l.href.replace("/", "")))
      .filter((el): el is HTMLElement => Boolean(el));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(`#${entry.target.id}`);
        });
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [pathname]);

  // Menu mobile: trava o scroll e fecha com Esc.
  useEffect(() => {
    if (!open) return;
    lenis?.stop();
    document.documentElement.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        menuButton.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      lenis?.start();
      document.documentElement.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, lenis]);

  const handleNav = (event: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    setOpen(false);
    if (pathname !== "/" || !href.startsWith("/#")) return;
    const hash = href.slice(1);
    if (scrollToHash(hash, lenis)) event.preventDefault();
  };

  return (
    <>
      <a
        href="#conteudo"
        className="fixed top-3 left-3 z-[100] -translate-y-24 rounded-full bg-ink px-5 py-3 text-sm text-offwhite transition-transform focus:translate-y-0"
      >
        Pular para o conteúdo
      </a>

      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-[background-color,backdrop-filter,box-shadow,padding] duration-700 ease-[var(--ease-luxe)]",
          scrolled || open
            ? "bg-offwhite/75 py-2.5 shadow-[0_1px_0_rgba(37,37,37,0.06)] backdrop-blur-xl backdrop-saturate-150"
            : "bg-transparent py-4 md:py-6",
        )}
      >
        <div className="container-lux flex items-center justify-between gap-6">
          <Link
            href="/#inicio"
            onClick={(e) => handleNav(e, "/#inicio")}
            className="relative z-10 rounded-full"
            {...heroFade}
            aria-label="J.A Odontologia Estética — início"
          >
            <Logo />
          </Link>

          <nav aria-label="Navegação principal" className="hidden lg:block" {...heroFade}>
            <ul className="flex items-center gap-8 xl:gap-10">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={(e) => handleNav(e, link.href)}
                    aria-current={pathname === "/" && active === link.href.slice(1) ? "true" : undefined}
                    className="link-underline text-[0.8rem] tracking-[0.04em] text-ink/80 transition-colors hover:text-ink"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="relative z-10 flex items-center gap-3" {...heroFade}>
            <WhatsAppCta location="menu" className="hidden min-h-11 px-5 sm:inline-flex">
              Agendar avaliação
            </WhatsAppCta>

            <button
              ref={menuButton}
              type="button"
              className="grid size-11 place-items-center rounded-full border border-ink/15 lg:hidden"
              aria-expanded={open}
              aria-controls="menu-mobile"
              aria-label={open ? "Fechar menu" : "Abrir menu"}
              onClick={() => setOpen((v) => !v)}
            >
              <span aria-hidden className="relative block h-3 w-5">
                <span
                  className={cn(
                    "absolute left-0 h-px w-5 bg-ink transition-transform duration-500 ease-[var(--ease-luxe)]",
                    open ? "top-1.5 rotate-45" : "top-0",
                  )}
                />
                <span
                  className={cn(
                    "absolute left-0 h-px bg-ink transition-all duration-500 ease-[var(--ease-luxe)]",
                    open ? "top-1.5 w-5 -rotate-45" : "top-3 w-3",
                  )}
                />
              </span>
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="menu-mobile"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            className="fixed inset-0 z-40 flex flex-col bg-offwhite px-6 pt-28 pb-10 lg:hidden"
            initial={reduce ? { opacity: 0 } : { clipPath: "inset(0 0 100% 0)" }}
            animate={reduce ? { opacity: 1 } : { clipPath: "inset(0 0 0% 0)" }}
            exit={reduce ? { opacity: 0 } : { clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
          >
            <nav aria-label="Navegação mobile" className="flex-1">
              <ul className="flex flex-col">
                {navLinks.map((link, i) => (
                  <li key={link.href} className="overflow-hidden border-b border-ink/10">
                    <motion.div
                      initial={reduce ? false : { y: "100%" }}
                      animate={{ y: 0 }}
                      transition={{ delay: 0.25 + i * 0.06, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <Link
                        href={link.href}
                        onClick={(e) => handleNav(e, link.href)}
                        className="flex items-baseline justify-between py-4 font-display text-[2rem] font-light"
                      >
                        {link.label}
                        <span className="eyebrow text-taupe-deep">0{i + 1}</span>
                      </Link>
                    </motion.div>
                  </li>
                ))}
              </ul>
            </nav>
            <motion.div
              initial={reduce ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              <WhatsAppCta location="menu-mobile" className="w-full">
                Agendar avaliação
              </WhatsAppCta>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

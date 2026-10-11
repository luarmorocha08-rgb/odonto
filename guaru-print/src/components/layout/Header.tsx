"use client";

import { ClipboardList, Menu, Search, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { InstagramIcon, WhatsAppIcon } from "@/components/ui/BrandIcons";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Logo";
import { mainNav, siteConfig } from "@/config/site";
import { trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/cn";
import { useQuoteList } from "@/lib/quote/list-store";
import { openUi } from "@/lib/ui-events";
import { whatsappUrl } from "@/lib/whatsapp";
import { useLenis } from "./SmoothScroll";

const ACCENTS = ["#00AEEF", "#E52B91", "#F7E500"];

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const list = useQuoteList();
  const lenis = useLenis();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Fecha o menu ao navegar.
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    if (open) lenis?.stop();
    else lenis?.start();
    document.documentElement.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, lenis]);

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <>
      <a
        href="#conteudo"
        className="fixed top-3 left-3 z-[100] -translate-y-20 rounded-full bg-paper px-4 py-2 text-sm font-semibold text-ink transition focus:translate-y-0"
      >
        Pular para o conteúdo
      </a>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-[background,border-color,backdrop-filter] duration-500",
          scrolled || open ? "border-b border-white/[0.06] bg-ink/75 backdrop-blur-xl" : "border-b border-transparent",
        )}
      >
        <div className="container-x flex h-[var(--header-h)] items-center gap-4">
          <Link href="/" className="relative z-10 mr-auto text-[1.05rem]" aria-label="Guaru Print — página inicial">
            <Logo withTag />
          </Link>

          <nav aria-label="Principal" className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {mainNav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={isActive(item.href) ? "page" : undefined}
                    className={cn(
                      "relative inline-flex min-h-10 items-center rounded-full px-3.5 font-sub text-[0.85rem] font-semibold transition-colors",
                      isActive(item.href) ? "text-paper" : "text-white/60 hover:text-paper",
                    )}
                  >
                    {item.label}
                    {isActive(item.href) && (
                      <motion.span layoutId="nav-dot" className="absolute bottom-1 left-1/2 size-1 -translate-x-1/2 rounded-full bg-magenta" />
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="relative z-10 flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => openUi("search")}
              className="grid size-11 place-items-center rounded-full text-white/80 transition hover:bg-white/10 hover:text-paper"
              aria-label="Buscar serviços (Ctrl + K)"
            >
              <Search className="size-5" />
            </button>
            <Link
              href="/orcamento#lista"
              className="relative grid size-11 place-items-center rounded-full text-white/80 transition hover:bg-white/10 hover:text-paper"
              aria-label={`Lista de orçamento${list.length ? ` (${list.length} ${list.length === 1 ? "item" : "itens"})` : ""}`}
            >
              <ClipboardList className="size-5" />
              <AnimatePresence>
                {list.length > 0 && (
                  <motion.span
                    key={list.length}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute top-1 right-1 grid size-[1.15rem] place-items-center rounded-full bg-magenta text-[0.65rem] font-bold text-paper"
                    aria-hidden
                  >
                    {list.length}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
            <Button href="/orcamento" size="sm" className="ml-1 hidden sm:inline-flex" track={{ name: "quote_start", params: { location: "header" } }}>
              Solicitar orçamento
            </Button>
            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              className="grid size-11 place-items-center rounded-full bg-white/[0.06] lg:hidden"
              aria-expanded={open}
              aria-controls="menu-mobile"
              aria-label={open ? "Fechar menu" : "Abrir menu"}
            >
              {open ? <X className="size-5" /> : <Menu className="size-5" />}
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
            className="fixed inset-0 z-40 flex flex-col overflow-y-auto bg-ink pt-[var(--header-h)] lg:hidden"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
          >
            <div className="flex h-1.5" aria-hidden>
              {ACCENTS.map((c) => (
                <span key={c} className="flex-1" style={{ background: c }} />
              ))}
            </div>
            <nav aria-label="Menu mobile" className="container-x flex-1 py-8">
              <ul className="space-y-1">
                {[{ href: "/", label: "Início" }, ...mainNav, { href: "/orcamento", label: "Orçamento" }].map((item, i) => (
                  <motion.li
                    key={item.href}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 + i * 0.04, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <Link
                      href={item.href}
                      aria-current={pathname === item.href ? "page" : undefined}
                      className="flex min-h-14 items-center justify-between border-b border-white/[0.06] font-display text-[clamp(1.75rem,8vw,2.6rem)] font-extrabold tracking-[-0.04em] uppercase"
                    >
                      {item.label}
                      <span className="size-2.5 rounded-full" style={{ background: ACCENTS[i % 3] }} aria-hidden />
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </nav>
            <div className="container-x grid gap-3 pb-10 sm:grid-cols-2">
              <a
                href={whatsappUrl()}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackEvent("whatsapp_click", { location: "mobile-menu" })}
                className="flex min-h-14 items-center justify-center gap-3 rounded-full bg-[#25D366] font-sub font-semibold text-ink"
              >
                <WhatsAppIcon className="size-5" /> {siteConfig.whatsapp.display}
              </a>
              <a
                href={siteConfig.instagram.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex min-h-14 items-center justify-center gap-3 rounded-full border border-white/15 font-sub font-semibold"
              >
                <InstagramIcon className="size-5" /> {siteConfig.instagram.handle}
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

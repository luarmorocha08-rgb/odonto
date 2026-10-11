"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { X } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { siteConfig } from "@/config/site";
import { gallery, type GalleryItem } from "@/content/gallery";
import { publishedTreatments } from "@/content/treatments";
import { WhatsAppCta } from "@/components/ui/CtaLink";
import { useLenis } from "@/components/layout/SmoothScroll";
import { cn } from "@/lib/cn";

const ALL = "todos";

export function Gallery() {
  return (
    <section
      id="resultados"
      aria-labelledby="resultados-title"
      data-tone="offwhite"
      className="relative py-28 md:py-40"
    >
      <div className="container-lux">
        <div className="grid gap-8 lg:grid-cols-12">
          <p data-reveal="fade" className="eyebrow flex items-center gap-3 text-taupe-deep lg:col-span-12">
            <span className="h-px w-10 bg-current" />
            Resultados
          </p>
          <h2
            id="resultados-title"
            data-reveal="lines"
            className="font-display text-headline font-extralight tracking-[-0.03em] text-balance lg:col-span-8"
          >
            Cada resultado, <em className="font-light text-taupe-deep italic">uma história única.</em>
          </h2>
          <p data-reveal="fade" className="max-w-md text-sm leading-relaxed text-ink/70 lg:col-span-4 lg:self-end">
            Imagens publicadas com autorização dos pacientes. Resultados variam de pessoa para pessoa e dependem de
            avaliação individual.
          </p>
        </div>

        {gallery.length > 0 ? <GalleryGrid items={gallery} /> : <GalleryEmpty />}
      </div>
    </section>
  );
}

/** Estado exibido enquanto a clínica não publica imagens autorizadas. */
function GalleryEmpty() {
  return (
    <div data-reveal="fade" className="mt-16 grid gap-6 rounded-[32px] border border-ink/10 bg-white/50 p-8 md:grid-cols-12 md:p-14">
      <div className="md:col-span-7">
        <p className="font-display text-title font-extralight text-balance">
          Nossa galeria está em curadoria — com o cuidado ético que cada imagem merece.
        </p>
        <p className="mt-4 max-w-lg text-sm leading-relaxed text-ink/70">
          Enquanto isso, acompanhe o dia a dia da clínica no Instagram ou converse com a equipe para conhecer melhor
          cada tratamento.
        </p>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row md:col-span-5 md:items-end md:justify-end">
        <a
          href={siteConfig.instagram.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-12 items-center justify-center rounded-full border border-ink/25 px-6 text-[0.82rem] font-medium transition-colors hover:border-ink"
        >
          {siteConfig.instagram.handle}
        </a>
        <WhatsAppCta location="gallery">Agendar avaliação</WhatsAppCta>
      </div>
    </div>
  );
}

function GalleryGrid({ items }: { items: GalleryItem[] }) {
  const [filter, setFilter] = useState<string>(ALL);
  const [open, setOpen] = useState<GalleryItem | null>(null);
  const close = useCallback(() => setOpen(null), []);

  const categories = useMemo(
    () => publishedTreatments.filter((t) => items.some((i) => i.treatment === t.slug)),
    [items],
  );
  const visible = filter === ALL ? items : items.filter((i) => i.treatment === filter);

  return (
    <>
      <div role="group" aria-label="Filtrar por tratamento" className="mt-14 flex flex-wrap gap-2">
        {[{ slug: ALL, name: "Todos" }, ...categories].map((c) => (
          <button
            key={c.slug}
            type="button"
            aria-pressed={filter === c.slug}
            onClick={() => setFilter(c.slug)}
            className={cn(
              "min-h-10 rounded-full border px-4 text-[0.75rem] font-medium transition-colors duration-500",
              filter === c.slug ? "border-ink bg-ink text-offwhite" : "border-ink/15 hover:border-ink/50",
            )}
          >
            {c.name}
          </button>
        ))}
      </div>

      <motion.ul layout className="mt-10 columns-1 gap-5 sm:columns-2 lg:columns-3">
        <AnimatePresence mode="popLayout">
          {visible.map((item, i) => (
            <motion.li
              key={item.id}
              layout
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.8, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
              className="mb-5 break-inside-avoid"
            >
              <button
                type="button"
                onClick={() => setOpen(item)}
                className="group relative block w-full overflow-hidden rounded-[24px] text-left"
              >
                <Image
                  src={item.src}
                  alt={item.alt}
                  width={item.width ?? 900}
                  height={item.height ?? 1100}
                  sizes="(min-width: 1024px) 30vw, (min-width: 640px) 50vw, 100vw"
                  className="h-auto w-full transition-transform duration-[1.4s] ease-[var(--ease-luxe)] group-hover:scale-105"
                />
                <span className="absolute inset-x-3 bottom-3 rounded-2xl bg-offwhite/85 p-3 text-xs opacity-0 backdrop-blur transition-opacity duration-500 group-hover:opacity-100 group-focus-visible:opacity-100">
                  {publishedTreatments.find((t) => t.slug === item.treatment)?.name}
                  <span className="sr-only"> — ampliar imagem</span>
                </span>
              </button>
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>

      <div className="mt-12 flex justify-center">
        <WhatsAppCta location="gallery">Agendar minha avaliação</WhatsAppCta>
      </div>

      <Lightbox item={open} onClose={close} />
    </>
  );
}

function Lightbox({ item, onClose }: { item: GalleryItem | null; onClose: () => void }) {
  const lenis = useLenis();
  const closeRef = useRef<HTMLButtonElement>(null);
  const treatment = item && publishedTreatments.find((t) => t.slug === item.treatment);

  useEffect(() => {
    if (!item) return;
    const previous = document.activeElement as HTMLElement | null;
    lenis?.stop();
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      lenis?.start();
      window.removeEventListener("keydown", onKey);
      previous?.focus();
    };
  }, [item, lenis, onClose]);

  return (
    <AnimatePresence>
      {item && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={item.alt}
          className="fixed inset-0 z-[70] grid place-items-center bg-ink/80 p-4 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.figure
            className="relative grid max-h-[90svh] w-full max-w-5xl overflow-hidden rounded-[28px] bg-offwhite md:grid-cols-[1.4fr_1fr]"
            initial={{ y: 40, scale: 0.97 }}
            animate={{ y: 0, scale: 1 }}
            exit={{ y: 20, scale: 0.98 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative min-h-[50svh] bg-blush">
              <Image src={item.src} alt={item.alt} fill sizes="60vw" className="object-contain" />
            </div>
            <figcaption className="flex flex-col gap-4 p-8">
              <p className="eyebrow text-taupe-deep">{treatment?.name}</p>
              {item.caption && <p className="text-sm leading-relaxed text-ink/80">{item.caption}</p>}
              <p className="text-xs leading-relaxed text-ink/60">
                Imagem publicada com autorização. Resultados variam de pessoa para pessoa.
              </p>
              <div className="mt-auto flex flex-wrap gap-3">
                {treatment && (
                  <>
                    <WhatsAppCta location="lightbox" treatment={{ slug: treatment.slug, name: treatment.name }}>
                      Agendar avaliação
                    </WhatsAppCta>
                    <Link href={`/tratamentos/${treatment.slug}`} className="link-underline self-center text-sm">
                      Sobre o tratamento
                    </Link>
                  </>
                )}
              </div>
            </figcaption>
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              aria-label="Fechar"
              className="absolute top-4 right-4 grid size-11 place-items-center rounded-full bg-offwhite/90"
            >
              <X strokeWidth={1.5} className="size-5" />
            </button>
          </motion.figure>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

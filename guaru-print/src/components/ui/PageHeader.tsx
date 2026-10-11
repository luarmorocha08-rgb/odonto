import { ChevronRight } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { breadcrumbJsonLd, JsonLd } from "@/lib/seo";

/** Cabeçalho das páginas internas com breadcrumb (visual + dados estruturados). */
export function PageHeader({
  eyebrow,
  title,
  description,
  crumbs,
  children,
}: {
  eyebrow: string;
  title: ReactNode;
  description?: ReactNode;
  crumbs: { name: string; path: string }[];
  children?: ReactNode;
}) {
  const all = [{ name: "Início", path: "/" }, ...crumbs];
  return (
    <header className="relative overflow-hidden pt-[calc(var(--header-h)+3.5rem)] pb-14 md:pb-20">
      <JsonLd data={breadcrumbJsonLd(all)} />
      <div aria-hidden className="absolute inset-0 -z-10">
        <div className="halftone absolute inset-0 [mask-image:linear-gradient(to_bottom,black,transparent)]" />
        <div className="absolute -top-1/2 right-0 size-[50vmax] rounded-full bg-cyan/10 blur-[120px]" />
        <div className="absolute -top-1/3 left-1/4 size-[30vmax] rounded-full bg-magenta/10 blur-[120px]" />
      </div>
      <div className="container-x">
        <nav aria-label="Você está em">
          <ol className="flex flex-wrap items-center gap-1 text-xs text-mute">
            {all.map((c, i) => (
              <li key={c.path} className="flex items-center gap-1">
                {i < all.length - 1 ? (
                  <>
                    <Link href={c.path} className="hover:text-paper">
                      {c.name}
                    </Link>
                    <ChevronRight className="size-3" aria-hidden />
                  </>
                ) : (
                  <span aria-current="page" className="text-white/80">
                    {c.name}
                  </span>
                )}
              </li>
            ))}
          </ol>
        </nav>
        <p className="eyebrow mt-8">{eyebrow}</p>
        <h1 data-split="lines" className="display-lg mt-5 max-w-5xl">
          {title}
        </h1>
        {description && <p className="mt-6 max-w-2xl font-sub text-lg text-white/70">{description}</p>}
        {children}
      </div>
    </header>
  );
}

import { about } from "@/content/about";
import { images } from "@/content/images";
import { Media } from "@/components/ui/Media";

export function About() {
  return (
    <section id="sobre" aria-labelledby="sobre-title" data-tone="offwhite" className="relative py-28 md:py-40">
      <div aria-hidden data-parallax="0.6" className="pointer-events-none absolute top-24 right-[6%] size-48 rounded-full border border-taupe/40 md:size-72" />

      <div className="container-lux">
        <div className="grid gap-8 lg:grid-cols-12">
          <p data-reveal="fade" className="eyebrow flex items-center gap-3 text-taupe-deep lg:col-span-12">
            <span className="h-px w-10 bg-current" />
            {about.eyebrow}
          </p>
          <h2
            id="sobre-title"
            data-reveal="lines"
            className="font-display text-headline font-extralight tracking-[-0.03em] text-balance lg:col-span-8"
          >
            Beleza natural começa com <em className="font-light text-taupe-deep italic">cuidado.</em>
          </h2>
          <p
            data-reveal="fade"
            className="max-w-md text-[0.95rem] leading-relaxed text-ink/75 md:text-base lg:col-span-4 lg:self-end"
          >
            {about.lead}
          </p>
        </div>

        <div className="mt-16 grid gap-14 md:mt-24 lg:grid-cols-12 lg:gap-8">
          {/* Composição assimétrica de imagens */}
          <div className="relative lg:col-span-5">
            <div data-mask className="relative aspect-[3/4] overflow-hidden rounded-t-full rounded-b-[28px]">
              <div data-mask-inner className="absolute inset-0">
                <div data-parallax="0.12" className="absolute -inset-y-[10%] inset-x-0">
                  <Media asset={images.about} sizes="(min-width: 1024px) 38vw, 100vw" />
                </div>
              </div>
            </div>
            <div
              data-mask
              className="absolute -right-4 -bottom-10 aspect-square w-[42%] overflow-hidden rounded-full border-[6px] border-offwhite md:-right-10"
            >
              <div data-mask-inner className="absolute inset-0">
                <Media asset={images.aboutDetail} sizes="20vw" />
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 lg:col-start-7 lg:pt-20">
            <ol data-stagger className="grid gap-x-10 sm:grid-cols-2">
              {about.pillars.map((pillar, i) => (
                <li key={pillar.title} className="group border-t border-ink/15 py-7">
                  <span className="eyebrow text-taupe-deep">0{i + 1}</span>
                  <h3 className="mt-4 font-sans text-[1.02rem] font-medium tracking-[-0.005em]">{pillar.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink/70">{pillar.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}

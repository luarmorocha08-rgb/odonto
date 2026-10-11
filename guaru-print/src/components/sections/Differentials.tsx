import { Clock3, MapPin, PackageCheck, Truck } from "lucide-react";
import { siteConfig } from "@/config/site";

/** Diferenciais — somente informações confirmadas pelo perfil oficial. */
const ITEMS = [
  { icon: PackageCheck, value: siteConfig.highlights.ordersDelivered, label: "pedidos entregues com sucesso", color: "#00AEEF" },
  { icon: Clock3, value: `${siteConfig.yearsActive} anos`, label: "de experiência em impressão", color: "#E52B91" },
  { icon: Truck, value: "Todo o Brasil", label: "enviamos para qualquer estado", color: "#F7E500" },
  { icon: MapPin, value: "Guarujá - SP", label: "produção local no litoral paulista", color: "#ffffff" },
];

export function Differentials() {
  return (
    <section className="relative py-24 md:py-32" aria-labelledby="dif-title">
      <div className="container-x">
        <h2 id="dif-title" className="sr-only">
          Diferenciais da Guaru Print
        </h2>
        <ul data-stagger className="grid gap-px overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
          {ITEMS.map(({ icon: Icon, value, label, color }) => (
            <li key={label} className="group relative bg-ink p-8 transition-colors hover:bg-ink-2">
              <Icon className="size-6" style={{ color }} aria-hidden />
              <p className="mt-10 font-display text-4xl font-extrabold tracking-[-0.04em]">{value}</p>
              <p className="mt-2 text-white/60">{label}</p>
              <span aria-hidden className="absolute inset-x-0 bottom-0 h-[3px] origin-left scale-x-0 transition-transform duration-500 group-hover:scale-x-100" style={{ background: color }} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

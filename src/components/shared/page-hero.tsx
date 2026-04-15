import { ShieldCheck, Sparkles, Truck } from "lucide-react";

import { Container } from "@/components/shared/container";

const heroSignals = [
  { icon: ShieldCheck, label: "Autenticidade verificada" },
  { icon: Truck, label: "Envio com rastreio" },
  { icon: Sparkles, label: "Curadoria premium" },
];

export function PageHero({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description: string;
}) {
  return (
    <section className="store-section-band relative overflow-hidden border-b border-brand-black/8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(85,13,26,0.14),transparent_26%),linear-gradient(180deg,rgba(255,255,255,0.18),rgba(255,255,255,0))]" />
      <Container className="relative grid gap-8 py-16 sm:py-20 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-end">
        <div className="max-w-4xl space-y-5">
          {eyebrow ? <span className="eyebrow-chip">{eyebrow}</span> : null}
          <h1 className="max-w-[12ch] font-heading text-4xl leading-[0.92] text-brand-black sm:text-5xl lg:text-6xl">
            {title}
          </h1>
          <p className="max-w-2xl text-base leading-8 text-brand-charcoal sm:text-lg">{description}</p>
        </div>

        <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
          {heroSignals.map((item) => {
            const Icon = item.icon;

            return (
              <div key={item.label} className="store-panel-muted flex items-center gap-3 p-4">
                <div className="inline-flex size-11 items-center justify-center rounded-lg bg-brand-wine/10 text-brand-wine">
                  <Icon className="size-4" />
                </div>
                <p className="text-sm font-medium text-brand-black">{item.label}</p>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}

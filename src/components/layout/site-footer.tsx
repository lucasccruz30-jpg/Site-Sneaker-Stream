import Link from "next/link";

import { BrandMark } from "@/components/layout/brand-mark";
import { Container } from "@/components/shared/container";
import { institutionalLinks, mainNavigation, socialLinks } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="border-t border-brand-black/8 bg-[rgba(255,252,248,0.82)]">
      <Container className="grid gap-12 py-14 lg:grid-cols-[1.6fr_1fr_1fr_1fr]">
        <div className="space-y-6">
          <BrandMark />
          <p className="max-w-md text-sm leading-7 text-brand-charcoal">
            Curadoria premium de tênis importados para quem compra autenticidade, desejo e presença visual.
          </p>
          <div className="flex items-center gap-3">
            {socialLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex size-11 items-center justify-center rounded-lg border border-brand-black/10 bg-white text-brand-black transition hover:border-brand-wine/30 hover:text-brand-wine"
                >
                  <Icon className="size-4" />
                </Link>
              );
            })}
          </div>
        </div>
        <div>
          <h3 className="font-heading text-2xl text-brand-black">Navegação</h3>
          <ul className="mt-5 space-y-3 text-sm text-brand-charcoal">
            {mainNavigation.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="transition hover:text-brand-black">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="font-heading text-2xl text-brand-black">Institucional</h3>
          <ul className="mt-5 space-y-3 text-sm text-brand-charcoal">
            {institutionalLinks.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="transition hover:text-brand-black">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="font-heading text-2xl text-brand-black">Atendimento</h3>
          <ul className="mt-5 space-y-3 text-sm text-brand-charcoal">
            <li>contato@sneakerstream.com.br</li>
            <li>+55 11 99999-9999</li>
            <li>Suporte rápido em horário comercial</li>
            <li>São Paulo, Brasil</li>
          </ul>
        </div>
      </Container>
      <div className="border-t border-brand-black/8 py-5 text-center text-xs uppercase tracking-[0.24em] text-brand-warm-gray">
        Sneaker Stream. Sofisticação, autenticidade e desejo em cada drop.
      </div>
    </footer>
  );
}

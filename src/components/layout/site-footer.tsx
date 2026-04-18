import Link from "next/link";
import { CheckCircle2, Headphones, ShieldCheck, Truck } from "lucide-react";

import { BrandMark } from "@/components/layout/brand-mark";
import { Container } from "@/components/shared/container";
import { institutionalLinks, mainNavigation, socialLinks } from "@/lib/site";
import { getSiteSettings } from "@/server/queries/storefront";

const trustSignals = [
  { icon: ShieldCheck, title: "Autenticidade garantida" },
  { icon: Truck, title: "Entrega com rastreio" },
  { icon: Headphones, title: "Atendimento consultivo" },
  { icon: CheckCircle2, title: "Compra segura" },
];

export async function SiteFooter() {
  const settings = await getSiteSettings();

  return (
    <footer className="mt-20 border-t border-brand-black/8 bg-[#111111] text-brand-off-white">
      <Container className="space-y-10 py-14">
        <div className="grid gap-4 lg:grid-cols-4">
          {trustSignals.map((item) => {
            const Icon = item.icon;

            return (
              <div key={item.title} className="rounded-[0.4rem] border border-white/10 bg-white/[0.04] p-5">
                <div className="inline-flex size-11 items-center justify-center rounded-[0.3rem] bg-white/[0.08] text-brand-off-white">
                  <Icon className="size-4" />
                </div>
                <p className="mt-4 text-sm font-medium text-brand-off-white">{item.title}</p>
              </div>
            );
          })}
        </div>

        <div className="grid gap-12 border-t border-white/10 pt-10 lg:grid-cols-[1.6fr_1fr_1fr_1.1fr]">
          <div className="space-y-6">
            <BrandMark inverse />
            <p className="max-w-md text-sm leading-7 text-brand-light-gray">
              Curadoria de sneakers importados para quem compra autenticidade, escassez e presenca visual com mais confianca.
            </p>
            <div className="grid gap-3 text-sm text-brand-light-gray">
              <p>{settings.shippingLeadText}</p>
              <p>{settings.authenticityMessage}</p>
            </div>
            <div className="flex items-center gap-3">
              {socialLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex size-11 items-center justify-center rounded-[0.3rem] border border-white/10 bg-white/[0.05] text-brand-off-white transition hover:border-brand-light-gray/40 hover:bg-white/[0.1]"
                  >
                    <Icon className="size-4" />
                  </Link>
                );
              })}
            </div>
          </div>

          <div>
            <h3 className="font-heading text-2xl text-white">Shop</h3>
            <ul className="mt-5 space-y-3 text-sm text-brand-light-gray">
              {mainNavigation.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="transition hover:text-white">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-heading text-2xl text-white">Institucional</h3>
            <ul className="mt-5 space-y-3 text-sm text-brand-light-gray">
              {institutionalLinks.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="transition hover:text-white">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-heading text-2xl text-white">Atendimento</h3>
            <div className="mt-5 space-y-3 text-sm leading-7 text-brand-light-gray">
              <p>{settings.supportEmail}</p>
              <p>{settings.supportPhone}</p>
              <p>{settings.whatsapp ?? settings.supportPhone}</p>
              <p>Suporte consultivo em horario comercial</p>
              <p>Sao Paulo, Brasil</p>
            </div>
          </div>
        </div>
      </Container>

      <div className="border-t border-white/10 py-5 text-center text-xs uppercase tracking-[0.24em] text-brand-light-gray">
        Sneaker Stream. Exclusividade, autenticidade e desejo em cada drop.
      </div>
    </footer>
  );
}

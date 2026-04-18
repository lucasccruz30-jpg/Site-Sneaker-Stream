import Link from "next/link";
import { Search, ShieldCheck, Truck, User } from "lucide-react";

import { BrandMark } from "@/components/layout/brand-mark";
import { HeaderActions } from "@/components/layout/header-actions";
import { MobileNav } from "@/components/layout/mobile-nav";
import { Container } from "@/components/shared/container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { mainNavigation } from "@/lib/site";
import { getSiteSettings } from "@/server/queries/storefront";

export async function SiteHeader() {
  const settings = await getSiteSettings();

  return (
    <header className="sticky top-0 z-50 border-b border-brand-black/10 bg-[rgba(248,244,239,0.94)] backdrop-blur-md">
      <div className="border-b border-brand-black/8 bg-[#171717] text-brand-off-white">
        <Container className="flex min-h-11 flex-wrap items-center justify-between gap-3 py-2 text-[0.68rem] font-medium uppercase tracking-[0.22em]">
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-2 text-brand-light-gray">
              <ShieldCheck className="size-3.5 text-brand-off-white" />
              Autenticidade verificada
            </span>
            <span className="hidden items-center gap-2 text-brand-light-gray sm:inline-flex">
              <Truck className="size-3.5 text-brand-off-white" />
              Envio seguro para todo o Brasil
            </span>
          </div>
          <span className="text-brand-light-gray">{settings.announcementText ?? "5% OFF no PIX e atendimento rapido via WhatsApp"}</span>
        </Container>
      </div>

      <Container className="py-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <MobileNav />
            <BrandMark compact priority />
          </div>

          <nav className="hidden items-center gap-7 xl:flex">
            {mainNavigation.map((item) => (
              <Link key={item.href} href={item.href} className="text-sm font-medium text-brand-charcoal transition hover:text-brand-black">
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden flex-1 xl:flex xl:max-w-lg">
            <form action="/shop" className="relative w-full">
              <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-brand-warm-gray" />
              <Input
                name="search"
                placeholder="Buscar sneakers, marcas e colorways"
                className="store-input h-11 pl-11"
              />
            </form>
          </div>

          <div className="flex items-center gap-2">
            <Button
              asChild
              variant="outline"
              size="icon"
              className="border-brand-black/10 bg-white/80 text-brand-black hover:bg-white"
            >
              <Link href="/minha-conta">
                <User className="size-4" />
              </Link>
            </Button>
            <HeaderActions />
            <Button asChild className="hidden h-11 rounded-lg bg-brand-wine px-5 text-white hover:bg-brand-wine/90 lg:inline-flex">
              <Link href="/drops">Ver drops</Link>
            </Button>
          </div>
        </div>

        <div className="mt-4 grid gap-3 lg:hidden">
          <form action="/shop" className="relative w-full">
            <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-brand-warm-gray" />
            <Input
              name="search"
              placeholder="Buscar sneakers, marcas e drops"
              className="store-input h-11 pl-11"
            />
          </form>
          <div className="grid grid-cols-2 gap-3 text-[0.7rem] font-medium uppercase tracking-[0.18em] text-brand-warm-gray">
            <div className="store-panel-muted p-3 text-center">Curadoria premium</div>
            <div className="store-panel-muted p-3 text-center">Checkout rapido</div>
          </div>
        </div>
      </Container>
    </header>
  );
}

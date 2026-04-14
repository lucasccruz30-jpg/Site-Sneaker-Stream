import Link from "next/link";
import { Search, User } from "lucide-react";

import { auth } from "@/auth";
import { BrandMark } from "@/components/layout/brand-mark";
import { HeaderActions } from "@/components/layout/header-actions";
import { MobileNav } from "@/components/layout/mobile-nav";
import { Container } from "@/components/shared/container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { mainNavigation } from "@/lib/site";

export async function SiteHeader() {
  const session = await auth();

  return (
    <header className="sticky top-0 z-50 border-b border-brand-black/8 bg-[rgba(250,247,243,0.86)] backdrop-blur-xl">
      <Container className="flex flex-col gap-4 py-4">
        <div className="hidden items-center justify-between gap-4 rounded-md border border-brand-black/8 bg-white/60 px-4 py-2 text-[0.68rem] font-medium uppercase tracking-[0.24em] text-brand-warm-gray lg:flex">
          <span>Curadoria premium de sneakers importados</span>
          <span>Autenticidade, drops limitados e compra sem atrito</span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <MobileNav />
            <BrandMark compact />
          </div>
          <nav className="hidden items-center gap-6 lg:flex">
            {mainNavigation.map((item) => (
              <Link key={item.href} href={item.href} className="text-sm font-medium text-brand-charcoal transition hover:text-brand-black">
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="hidden flex-1 lg:flex lg:max-w-md">
            <form action="/shop" className="relative w-full">
              <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-brand-warm-gray" />
              <Input name="search" placeholder="Buscar sneakers, marcas e drops" className="store-input h-11 rounded-lg pl-11" />
            </form>
          </div>
          <div className="flex items-center gap-2">
            <Button asChild variant="outline" size="icon" className="border-brand-black/10 bg-white/75 text-brand-black hover:bg-white">
              <Link href={session?.user ? "/minha-conta" : "/login"}>
                <User className="size-4" />
              </Link>
            </Button>
            <HeaderActions />
          </div>
        </div>
      </Container>
    </header>
  );
}

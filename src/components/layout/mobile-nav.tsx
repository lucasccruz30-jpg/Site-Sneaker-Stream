"use client";

import Link from "next/link";
import { Menu } from "lucide-react";

import { mainNavigation } from "@/lib/site";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { BrandMark } from "@/components/layout/brand-mark";

export function MobileNav() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="border-brand-black/10 bg-white/75 text-brand-black hover:bg-white lg:hidden">
          <Menu className="size-4" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="border-brand-black/10 bg-[#fbf7f2] text-brand-black">
        <SheetHeader>
          <SheetTitle className="sr-only">Navegação principal</SheetTitle>
        </SheetHeader>
        <div className="mt-6 space-y-8">
          <BrandMark />
          <nav className="space-y-3">
            {mainNavigation.map((link) => (
              <Link key={link.href} href={link.href} className="block rounded-xl border border-brand-black/8 bg-white/72 px-4 py-4">
                <span className="block font-medium text-brand-black">{link.label}</span>
                {link.description ? <span className="mt-1 block text-sm text-brand-warm-gray">{link.description}</span> : null}
              </Link>
            ))}
          </nav>
          <div className="grid gap-3">
            <Link href="/login" className="rounded-lg border border-brand-black/10 bg-white/72 px-4 py-3 text-sm text-brand-charcoal">
              Entrar
            </Link>
            <Link href="/cadastro" className="rounded-lg bg-brand-wine px-4 py-3 text-sm font-medium text-white">
              Criar conta
            </Link>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

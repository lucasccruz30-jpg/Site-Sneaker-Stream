import Link from "next/link";
import { LayoutDashboard, LogOut } from "lucide-react";

import { signOut } from "@/auth";
import { BrandMark } from "@/components/layout/brand-mark";
import { Container } from "@/components/shared/container";
import { Button } from "@/components/ui/button";
import { adminNavigation } from "@/lib/site";

export function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#101010]">
      <Container className="grid gap-6 py-6 lg:grid-cols-[280px_1fr]">
        <aside className="surface-panel h-fit space-y-6 p-5 lg:sticky lg:top-6">
          <BrandMark href="/" />
          <div className="rounded-[1.5rem] border border-white/8 bg-black/15 p-4">
            <p className="text-[0.72rem] uppercase tracking-[0.28em] text-brand-light-gray">Admin</p>
            <h2 className="mt-3 font-heading text-3xl text-white">Operação da loja</h2>
          </div>
          <nav className="space-y-2">
            {adminNavigation.map((item, index) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center justify-between rounded-2xl border border-white/8 bg-white/5 px-4 py-3 text-sm text-brand-light-gray transition hover:border-brand-light-gray/20 hover:bg-white/10 hover:text-white"
              >
                <span>{item.label}</span>
                <span className="text-xs">{String(index + 1).padStart(2, "0")}</span>
              </Link>
            ))}
          </nav>
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/login" });
            }}
          >
            <Button variant="outline" className="w-full rounded-full border-white/10 bg-white/5 text-white hover:bg-white/10">
              <LogOut className="mr-2 size-4" />
              Sair do admin
            </Button>
          </form>
        </aside>
        <div className="space-y-6">
          <div className="surface-panel flex items-center justify-between p-5">
            <div>
              <p className="text-[0.72rem] uppercase tracking-[0.28em] text-brand-light-gray">Painel administrativo</p>
              <h1 className="mt-2 flex items-center gap-2 font-heading text-4xl text-white">
                <LayoutDashboard className="size-7" />
                Gestão Sneaker Stream
              </h1>
            </div>
          </div>
          {children}
        </div>
      </Container>
    </div>
  );
}

import { Suspense } from "react";
import type { Metadata } from "next";

import { Container } from "@/components/shared/container";
import { PageHero } from "@/components/shared/page-hero";
import { LoginForm } from "@/components/store/storefront-forms";

export const metadata: Metadata = {
  title: "Login",
  description: "Entre na sua conta para acompanhar pedidos, salvar enderecos e comprar com mais rapidez.",
};

function LoginFallback() {
  return (
    <div className="store-panel space-y-4 p-6">
      <div className="h-5 w-20 animate-pulse rounded-full bg-brand-black/8" />
      <div className="h-12 animate-pulse rounded-xl bg-brand-black/8" />
      <div className="h-5 w-16 animate-pulse rounded-full bg-brand-black/8" />
      <div className="h-12 animate-pulse rounded-xl bg-brand-black/8" />
      <div className="h-11 animate-pulse rounded-lg bg-brand-black/10" />
    </div>
  );
}

export default function LoginPage() {
  return (
    <>
      <PageHero
        eyebrow="Login"
        title="Entre para acompanhar pedidos e comprar com mais rapidez"
        description="Sua conta concentra historico, enderecos, status do pedido e uma experiencia ainda mais fluida no checkout."
      />
      <section className="section-spacing">
        <Container className="grid gap-8 lg:grid-cols-[1fr_440px]">
          <div className="store-panel p-8">
            <h2 className="font-heading text-5xl text-brand-black">Acesso claro, visual mais profissional e foco no essencial.</h2>
            <p className="mt-4 max-w-2xl text-base leading-8 text-brand-charcoal">
              Consulte pedidos, acompanhe entregas, salve informacoes de entrega e mantenha sua jornada sempre pronta para o proximo drop.
            </p>
          </div>
          <Suspense fallback={<LoginFallback />}>
            <LoginForm />
          </Suspense>
        </Container>
      </section>
    </>
  );
}

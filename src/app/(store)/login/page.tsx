import type { Metadata } from "next";

import { Container } from "@/components/shared/container";
import { PageHero } from "@/components/shared/page-hero";
import { LoginForm } from "@/components/store/storefront-forms";

export const metadata: Metadata = {
  title: "Login",
  description: "Entre na sua conta para acompanhar pedidos, salvar endereços e comprar com mais rapidez.",
};

export default function LoginPage() {
  return (
    <>
      <PageHero
        eyebrow="Login"
        title="Entre para acompanhar pedidos e comprar com mais rapidez"
        description="Sua conta concentra histórico, endereços, status do pedido e uma experiência ainda mais fluida no checkout."
      />
      <section className="section-spacing">
        <Container className="grid gap-8 lg:grid-cols-[1fr_440px]">
          <div className="surface-panel p-8">
            <h2 className="font-heading text-5xl text-white">Experiência premium também no pós-compra.</h2>
            <p className="mt-4 max-w-2xl text-base leading-8 text-brand-light-gray">
              Consulte pedidos, acompanhe entregas, salve informações de entrega e mantenha sua jornada sempre pronta para o próximo drop.
            </p>
          </div>
          <LoginForm />
        </Container>
      </section>
    </>
  );
}

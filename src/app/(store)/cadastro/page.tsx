import type { Metadata } from "next";

import { Container } from "@/components/shared/container";
import { PageHero } from "@/components/shared/page-hero";
import { RegisterForm } from "@/components/store/storefront-forms";

export const metadata: Metadata = {
  title: "Cadastro",
  description: "Crie sua conta na Sneaker Stream para acompanhar drops, pedidos e novidades exclusivas.",
};

export default function RegisterPage() {
  return (
    <>
      <PageHero
        eyebrow="Cadastro"
        title="Crie sua conta e receba uma jornada de compra ainda mais rápida"
        description="Conta pronta para acompanhar pedidos, centralizar endereços, favoritos e experiências futuras com menos atrito."
      />
      <section className="section-spacing">
        <Container className="grid gap-8 lg:grid-cols-[1fr_500px]">
          <div className="surface-panel p-8">
            <h2 className="font-heading text-5xl text-white">Entre na lista de clientes que compram primeiro.</h2>
            <p className="mt-4 max-w-2xl text-base leading-8 text-brand-light-gray">
              Cadastro simples, mobile-first e pronto para acionar relacionamento, recorrência e recuperação de carrinho.
            </p>
          </div>
          <RegisterForm />
        </Container>
      </section>
    </>
  );
}

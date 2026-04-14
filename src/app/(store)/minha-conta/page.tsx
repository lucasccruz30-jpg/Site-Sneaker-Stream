import Link from "next/link";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { Container } from "@/components/shared/container";
import { PageHero } from "@/components/shared/page-hero";
import { Button } from "@/components/ui/button";
import { formatDateBR } from "@/lib/format";
import { getUserAccountSummary } from "@/server/queries/storefront";

export default async function AccountPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const data = await getUserAccountSummary(session.user.id);

  return (
    <>
      <PageHero
        eyebrow="Minha conta"
        title="Seu espaco para acompanhar cada etapa da jornada"
        description="Perfil, enderecos e historico de compras reunidos em uma area pensada para conveniencia e recorrencia."
      />
      <section className="section-spacing">
        <Container className="grid gap-6 lg:grid-cols-[1fr_1fr]">
          <div className="store-panel space-y-4 p-6">
            <p className="text-[0.72rem] uppercase tracking-[0.28em] text-brand-warm-gray">Perfil</p>
            <h2 className="font-heading text-4xl text-brand-black">{data.user?.name}</h2>
            <div className="space-y-2 text-sm leading-7 text-brand-charcoal">
              <p>{data.user?.email}</p>
              <p>{data.user?.phone ?? "Telefone nao informado"}</p>
              <p>Cliente desde {data.user ? formatDateBR(data.user.createdAt) : "-"}</p>
            </div>
            <div className="flex gap-3">
              <Button asChild className="rounded-lg bg-brand-black text-white hover:bg-brand-charcoal">
                <Link href="/meus-pedidos">Ver pedidos</Link>
              </Button>
              <Button asChild variant="outline" className="rounded-lg border-brand-black/10 bg-white/70 text-brand-black hover:bg-white">
                <Link href="/shop">Continuar comprando</Link>
              </Button>
            </div>
          </div>
          <div className="store-panel space-y-4 p-6">
            <p className="text-[0.72rem] uppercase tracking-[0.28em] text-brand-warm-gray">Enderecos</p>
            {data.user?.addresses.length ? (
              <div className="space-y-4">
                {data.user.addresses.map((address) => (
                  <article key={address.id} className="rounded-lg border border-brand-black/8 bg-white/70 p-4">
                    <p className="font-medium text-brand-black">{address.label ?? "Entrega"}</p>
                    <p className="mt-2 text-sm leading-7 text-brand-charcoal">
                      {address.street}, {address.number}
                      {address.complement ? `, ${address.complement}` : ""}
                      <br />
                      {address.neighborhood} / {address.city}/{address.state}
                      <br />
                      CEP {address.zipCode}
                    </p>
                  </article>
                ))}
              </div>
            ) : (
              <p className="text-sm text-brand-charcoal">Nenhum endereco salvo ainda.</p>
            )}
          </div>
        </Container>
      </section>
    </>
  );
}

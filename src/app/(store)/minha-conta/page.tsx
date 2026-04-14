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
        title="Seu espaço para acompanhar cada etapa da jornada"
        description="Perfil, endereços e histórico de compras reunidos em uma área pensada para conveniência e recorrência."
      />
      <section className="section-spacing">
        <Container className="grid gap-6 lg:grid-cols-[1fr_1fr]">
          <div className="surface-panel space-y-4 p-6">
            <p className="text-[0.72rem] uppercase tracking-[0.28em] text-brand-light-gray">Perfil</p>
            <h2 className="font-heading text-4xl text-white">{data.user?.name}</h2>
            <div className="space-y-2 text-sm leading-7 text-brand-light-gray">
              <p>{data.user?.email}</p>
              <p>{data.user?.phone ?? "Telefone não informado"}</p>
              <p>Cliente desde {data.user ? formatDateBR(data.user.createdAt) : "-"}</p>
            </div>
            <div className="flex gap-3">
              <Button asChild className="rounded-full bg-brand-wine text-white hover:bg-brand-wine/90">
                <Link href="/meus-pedidos">Ver pedidos</Link>
              </Button>
              <Button asChild variant="outline" className="rounded-full border-white/10 bg-white/5 text-white hover:bg-white/10">
                <Link href="/shop">Continuar comprando</Link>
              </Button>
            </div>
          </div>
          <div className="surface-panel space-y-4 p-6">
            <p className="text-[0.72rem] uppercase tracking-[0.28em] text-brand-light-gray">Endereços</p>
            {data.user?.addresses.length ? (
              <div className="space-y-4">
                {data.user.addresses.map((address) => (
                  <article key={address.id} className="rounded-[1.5rem] border border-white/8 bg-black/15 p-4">
                    <p className="font-medium text-white">{address.label ?? "Entrega"}</p>
                    <p className="mt-2 text-sm leading-7 text-brand-light-gray">
                      {address.street}, {address.number}
                      {address.complement ? `, ${address.complement}` : ""}
                      <br />
                      {address.neighborhood} • {address.city}/{address.state}
                      <br />
                      CEP {address.zipCode}
                    </p>
                  </article>
                ))}
              </div>
            ) : (
              <p className="text-sm text-brand-light-gray">Nenhum endereço salvo ainda.</p>
            )}
          </div>
        </Container>
      </section>
    </>
  );
}

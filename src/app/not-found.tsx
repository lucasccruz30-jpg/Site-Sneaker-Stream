import Link from "next/link";

import { BrandMark } from "@/components/layout/brand-mark";
import { Container } from "@/components/shared/container";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen">
      <Container className="flex min-h-screen flex-col items-center justify-center gap-8 py-20 text-center">
        <BrandMark />
        <div className="space-y-4">
          <p className="text-[0.72rem] uppercase tracking-[0.28em] text-brand-light-gray">404</p>
          <h1 className="font-heading text-6xl text-white sm:text-7xl">A rota sumiu do mapa.</h1>
          <p className="mx-auto max-w-2xl text-base leading-8 text-brand-light-gray">
            O conteúdo que você procura não está disponível neste endereço. Volte para a curadoria principal e continue explorando a Sneaker Stream.
          </p>
        </div>
        <Button asChild className="rounded-full bg-brand-wine text-white hover:bg-brand-wine/90">
          <Link href="/">Voltar para a home</Link>
        </Button>
      </Container>
    </div>
  );
}

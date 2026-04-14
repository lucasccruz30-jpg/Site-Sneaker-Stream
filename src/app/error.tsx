"use client";

import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto flex min-h-screen max-w-3xl items-center justify-center px-4">
      <div className="surface-panel space-y-5 p-8 text-center">
        <p className="text-[0.72rem] uppercase tracking-[0.28em] text-brand-light-gray">Erro inesperado</p>
        <h1 className="font-heading text-5xl text-white">Algo saiu do ritmo.</h1>
        <p className="text-sm leading-7 text-brand-light-gray">
          {error.message || "Tente novamente em instantes. Se persistir, revise a configuração do ambiente e do banco."}
        </p>
        <Button type="button" className="rounded-full bg-brand-wine text-white hover:bg-brand-wine/90" onClick={reset}>
          Tentar novamente
        </Button>
      </div>
    </div>
  );
}

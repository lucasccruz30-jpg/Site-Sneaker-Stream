import { InstitutionalLayout } from "@/components/store/institutional-layout";

export default function ShippingPolicyPage() {
  return (
    <InstitutionalLayout
      eyebrow="Política"
      title="Política de entrega"
      description="Comunicação transparente de prazos, despacho e rastreamento."
      sections={[
        {
          title: "Despacho",
          content:
            "O prazo de despacho varia conforme disponibilidade do produto e confirmação do pagamento. Cada produto informa a previsão estimada na página de detalhe.",
        },
        {
          title: "Rastreamento",
          content:
            "Todos os pedidos enviados recebem código de rastreio. As atualizações também ficam disponíveis na área de pedidos.",
        },
        {
          title: "Cobertura",
          content:
            "Atendemos todo o Brasil com opções de frete compatíveis com a jornada do cliente e a estratégia comercial da loja.",
        },
      ]}
    />
  );
}

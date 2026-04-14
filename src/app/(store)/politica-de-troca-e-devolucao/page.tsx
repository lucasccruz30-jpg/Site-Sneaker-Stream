import { InstitutionalLayout } from "@/components/store/institutional-layout";

export default function ReturnsPolicyPage() {
  return (
    <InstitutionalLayout
      eyebrow="Política"
      title="Troca e devolução"
      description="Regras claras para manter segurança jurídica e confiança comercial."
      sections={[
        {
          title: "Solicitação",
          content:
            "Pedidos de troca ou devolução devem ser comunicados dentro do prazo legal, com o produto sem sinais de uso incompatíveis e na embalagem original.",
        },
        {
          title: "Análise",
          content:
            "Após o recebimento, realizamos conferência do item para validar condição, integridade e elegibilidade do processo.",
        },
        {
          title: "Reembolso ou crédito",
          content:
            "Quando aprovado, o cliente pode receber estorno, crédito na loja ou substituição, conforme o caso e as regras aplicáveis.",
        },
      ]}
    />
  );
}

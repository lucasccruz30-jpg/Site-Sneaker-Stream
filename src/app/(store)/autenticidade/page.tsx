import { InstitutionalLayout } from "@/components/store/institutional-layout";

export default function AuthenticityPage() {
  return (
    <InstitutionalLayout
      eyebrow="Autenticidade"
      title="Compra com confiança, curadoria com responsabilidade"
      description="A autenticidade é tratada como pilar comercial e reputacional da Sneaker Stream."
      sections={[
        {
          title: "Conferência interna",
          content:
            "Todos os pares passam por uma verificação interna antes do envio, considerando construção, acabamento, materiais e coerência visual do produto.",
        },
        {
          title: "Curadoria seletiva",
          content:
            "Não operamos como vitrine de volume indiscriminado. A seleção é pensada para manter coerência entre desejo, credibilidade e experiência premium.",
        },
        {
          title: "Suporte ao cliente",
          content:
            "Se houver qualquer dúvida sobre o produto, nosso time responde com rapidez para apoiar a compra com clareza e segurança.",
        },
      ]}
    />
  );
}

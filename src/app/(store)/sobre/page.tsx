import { getContentPage } from "@/server/queries/storefront";

import { InstitutionalLayout } from "@/components/store/institutional-layout";

export default async function AboutPage() {
  const content = await getContentPage("sobre");
  const sections =
    (content?.body as { sections?: Array<{ title: string; content: string }> } | null)?.sections ??
    [
      {
        title: "Posicionamento",
        content:
          "A Sneaker Stream nasceu para vender sneakers importados com uma leitura premium, urbana e sofisticada. Nossa proposta une desejo, autenticidade, credibilidade e uma jornada de compra limpa.",
      },
      {
        title: "Curadoria",
        content:
          "Não trabalhamos com volume genérico. A seleção da loja privilegia silhuetas com força cultural, apelo comercial, styling refinado e alto valor percebido no mercado brasileiro.",
      },
      {
        title: "Confiança",
        content:
          "Cada detalhe do produto, atendimento e operação existe para reduzir dúvida, reforçar confiança e transformar descoberta em compra com segurança.",
      },
    ];

  return (
    <InstitutionalLayout
      eyebrow="Sobre a marca"
      title={content?.heroTitle ?? "Curadoria premium para quem compra autenticidade e estilo."}
      description={
        content?.heroSubtitle ??
        "Mais do que vender sneakers, a Sneaker Stream constrói desejo com credibilidade e experiência profissional."
      }
      sections={sections}
    />
  );
}

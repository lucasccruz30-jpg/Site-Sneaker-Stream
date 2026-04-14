import { InstitutionalLayout } from "@/components/store/institutional-layout";

export default function TermsPage() {
  return (
    <InstitutionalLayout
      eyebrow="Termos"
      title="Termos de uso"
      description="Condições gerais para navegação, compra e uso da plataforma."
      sections={[
        {
          title: "Uso da plataforma",
          content:
            "Ao navegar ou comprar na Sneaker Stream, o usuário concorda com as regras comerciais, operacionais e institucionais publicadas no site.",
        },
        {
          title: "Disponibilidade",
          content:
            "Estoque, preços e condições podem mudar sem aviso prévio, respeitando a confirmação efetiva no momento da finalização do pedido.",
        },
        {
          title: "Responsabilidades",
          content:
            "A loja se compromete com a boa operação do serviço e o cliente com o fornecimento correto das informações necessárias para compra e entrega.",
        },
      ]}
    />
  );
}

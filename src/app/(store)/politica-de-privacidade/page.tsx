import { InstitutionalLayout } from "@/components/store/institutional-layout";

export default function PrivacyPolicyPage() {
  return (
    <InstitutionalLayout
      eyebrow="Política"
      title="Política de privacidade"
      description="Tratamento responsável de dados em uma operação pronta para produção."
      sections={[
        {
          title: "Coleta de dados",
          content:
            "Coletamos apenas informações necessárias para navegação, atendimento, processamento de pedidos e comunicação comercial autorizada.",
        },
        {
          title: "Uso das informações",
          content:
            "Os dados são utilizados para melhorar a experiência, confirmar pedidos, prestar suporte e operar campanhas relacionadas ao relacionamento com clientes.",
        },
        {
          title: "Segurança",
          content:
            "Aplicamos boas práticas de proteção de dados, autenticação segura e separação de variáveis sensíveis em ambiente.",
        },
      ]}
    />
  );
}

import { faqs } from "@/lib/site";
import { getContentPage } from "@/server/queries/storefront";

import { InstitutionalLayout } from "@/components/store/institutional-layout";

export default async function FaqPage() {
  const content = await getContentPage("faq");
  const sections =
    (content?.body as { items?: Array<{ question: string; answer: string }> } | null)?.items?.map((item) => ({
      title: item.question,
      content: item.answer,
    })) ??
    faqs.map((faq) => ({ title: faq.question, content: faq.answer }));

  return (
    <InstitutionalLayout
      eyebrow="FAQ"
      title={content?.heroTitle ?? "Dúvidas frequentes sobre compra, envio e autenticidade"}
      description={content?.heroSubtitle ?? "Respostas claras para reduzir objeções e aumentar confiança antes da compra."}
      sections={sections}
    />
  );
}

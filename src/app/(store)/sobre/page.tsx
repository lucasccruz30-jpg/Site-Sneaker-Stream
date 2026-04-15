import Image from "next/image";

import { getContentPage } from "@/server/queries/storefront";

import { Container } from "@/components/shared/container";
import { InstitutionalLayout } from "@/components/store/institutional-layout";
import { instagramHighlights, testimonials } from "@/lib/site";

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
          "Nao trabalhamos com volume generico. A selecao da loja privilegia silhuetas com forca cultural, apelo comercial, styling refinado e alto valor percebido no mercado brasileiro.",
      },
      {
        title: "Confianca",
        content:
          "Cada detalhe do produto, atendimento e operacao existe para reduzir duvida, reforcar confianca e transformar descoberta em compra com mais seguranca.",
      },
    ];

  return (
    <>
      <InstitutionalLayout
        eyebrow="Sobre a marca"
        title={content?.heroTitle ?? "Curadoria premium para quem compra autenticidade e estilo."}
        description={
          content?.heroSubtitle ??
          "Mais do que vender sneakers, a Sneaker Stream constroi desejo com credibilidade, repertorio visual e experiencia profissional."
        }
        sections={sections}
      />

      <section className="section-spacing pt-0">
        <Container className="space-y-8">
          <div className="max-w-3xl space-y-4">
            <p className="text-[0.72rem] uppercase tracking-[0.28em] text-brand-warm-gray">Lifestyle e repertorio</p>
            <h2 className="font-heading text-4xl text-brand-black sm:text-5xl">
              O universo da marca agora fica aqui, sem pesar a home.
            </h2>
            <p className="text-sm leading-8 text-brand-charcoal sm:text-base">
              Reunimos nesta pagina o lado mais editorial da Sneaker Stream para que a home permaneca mais objetiva e vendedora.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {instagramHighlights.map((highlight) => (
              <div key={highlight.title} className="store-panel group overflow-hidden">
                <div className="relative aspect-[4/4.8] overflow-hidden bg-[#ece6e1]">
                  <Image
                    src={highlight.image}
                    alt={highlight.title}
                    fill
                    className="object-cover transition duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
                <div className="p-5">
                  <h3 className="font-heading text-3xl text-brand-black">{highlight.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-brand-charcoal">{highlight.subtitle}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="grid gap-5 lg:grid-cols-3">
            {testimonials.map((testimonial) => (
              <article key={testimonial.name} className="store-panel-muted p-7">
                <p className="text-base leading-8 text-brand-charcoal">&quot;{testimonial.quote}&quot;</p>
                <div className="mt-5">
                  <p className="font-semibold text-brand-black">{testimonial.name}</p>
                  <p className="text-sm text-brand-warm-gray">{testimonial.role}</p>
                </div>
              </article>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}

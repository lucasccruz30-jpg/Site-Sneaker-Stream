import { ContactForm } from "@/components/store/storefront-forms";
import { Container } from "@/components/shared/container";
import { PageHero } from "@/components/shared/page-hero";

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contato"
        title="Fale com a Sneaker Stream"
        description="Atendimento rápido para tirar dúvidas, orientar sua compra e apoiar o pós-venda com proximidade."
      />
      <section className="section-spacing">
        <Container className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="surface-panel space-y-4 p-8">
            <h2 className="font-heading text-5xl text-white">Compra premium também pede atendimento premium.</h2>
            <p className="text-base leading-8 text-brand-light-gray">
              Tire dúvidas sobre disponibilidade, numeração, autenticidade, envio e pagamento. Nossa equipe responde com agilidade para manter a jornada fluida.
            </p>
            <div className="space-y-2 text-sm leading-7 text-brand-light-gray">
              <p>contato@sneakerstream.com.br</p>
              <p>+55 11 99999-9999</p>
              <p>São Paulo, Brasil</p>
            </div>
          </div>
          <ContactForm />
        </Container>
      </section>
    </>
  );
}

import { ContactForm } from "@/components/store/storefront-forms";
import { Container } from "@/components/shared/container";
import { PageHero } from "@/components/shared/page-hero";

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contato"
        title="Fale com a Sneaker Stream"
        description="Atendimento rapido para tirar duvidas, orientar sua compra e apoiar o pos-venda com proximidade."
      />
      <section className="section-spacing">
        <Container className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="store-panel space-y-4 p-8">
            <h2 className="font-heading text-5xl text-brand-black">Compra premium tambem pede atendimento premium.</h2>
            <p className="text-base leading-8 text-brand-charcoal">
              Tire duvidas sobre disponibilidade, numeracao, autenticidade, envio e pagamento. Nossa equipe responde com agilidade para manter a jornada fluida.
            </p>
            <div className="space-y-2 text-sm leading-7 text-brand-charcoal">
              <p>contato@sneakerstream.com.br</p>
              <p>+55 11 99999-9999</p>
              <p>Sao Paulo, Brasil</p>
            </div>
          </div>
          <ContactForm />
        </Container>
      </section>
    </>
  );
}

import { Container } from "@/components/shared/container";

export function PageHero({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description: string;
}) {
  return (
    <section className="store-section-band relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(85,13,26,0.12),transparent_24%),linear-gradient(180deg,rgba(255,255,255,0.24),transparent)]" />
      <Container className="relative py-16 sm:py-20">
        <div className="max-w-3xl space-y-5">
          {eyebrow ? <span className="eyebrow-chip">{eyebrow}</span> : null}
          <h1 className="font-heading text-4xl text-brand-black sm:text-5xl lg:text-6xl">{title}</h1>
          <p className="text-base leading-8 text-brand-charcoal sm:text-lg">{description}</p>
        </div>
      </Container>
    </section>
  );
}

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
    <section className="relative overflow-hidden border-b border-white/8 bg-black/20">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(85,13,26,0.28),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(87,86,86,0.18),transparent_28%)]" />
      <Container className="relative py-16 sm:py-20">
        <div className="max-w-3xl space-y-5">
          {eyebrow ? (
            <span className="inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.28em] text-brand-light-gray">
              {eyebrow}
            </span>
          ) : null}
          <h1 className="font-heading text-4xl text-white sm:text-5xl lg:text-6xl">{title}</h1>
          <p className="text-base leading-8 text-brand-light-gray sm:text-lg">{description}</p>
        </div>
      </Container>
    </section>
  );
}

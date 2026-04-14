import { Container } from "@/components/shared/container";
import { PageHero } from "@/components/shared/page-hero";

export function InstitutionalLayout({
  eyebrow,
  title,
  description,
  sections,
}: {
  eyebrow: string;
  title: string;
  description: string;
  sections: Array<{ title: string; content: string }>;
}) {
  return (
    <>
      <PageHero eyebrow={eyebrow} title={title} description={description} />
      <section className="section-spacing">
        <Container className="max-w-4xl">
          <div className="store-panel space-y-8 p-7 sm:p-10">
            {sections.map((section) => (
              <article key={section.title} className="space-y-3">
                <h2 className="font-heading text-4xl text-brand-black">{section.title}</h2>
                <p className="text-sm leading-8 text-brand-charcoal sm:text-base">{section.content}</p>
              </article>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}

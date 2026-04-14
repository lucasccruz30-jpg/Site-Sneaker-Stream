import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
}) {
  return (
    <div className={cn("space-y-4", align === "center" && "mx-auto max-w-3xl text-center")}>
      {eyebrow ? <span className="eyebrow-chip">{eyebrow}</span> : null}
      <div className="space-y-3">
        <h2 className="font-heading text-3xl leading-none text-brand-black sm:text-4xl lg:text-5xl">{title}</h2>
        {description ? <p className="max-w-2xl text-sm leading-7 text-brand-charcoal sm:text-base">{description}</p> : null}
      </div>
    </div>
  );
}

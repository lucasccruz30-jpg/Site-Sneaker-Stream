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
      {eyebrow ? (
        <span className="inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.3em] text-brand-light-gray">
          {eyebrow}
        </span>
      ) : null}
      <div className="space-y-3">
        <h2 className="font-heading text-3xl leading-none text-white sm:text-4xl lg:text-5xl">{title}</h2>
        {description ? <p className="max-w-2xl text-sm leading-7 text-brand-light-gray/90 sm:text-base">{description}</p> : null}
      </div>
    </div>
  );
}

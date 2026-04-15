import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";

export function BrandMark({
  compact = false,
  href = "/",
  inverse = false,
}: {
  compact?: boolean;
  href?: string;
  inverse?: boolean;
}) {
  return (
    <Link href={href} className="group inline-flex items-center gap-3">
      <div
        className={cn(
          "relative overflow-hidden rounded-xl border bg-white shadow-[0_12px_28px_rgba(19,19,19,0.08)] transition group-hover:border-brand-wine/20",
          inverse ? "border-white/12" : "border-brand-black/10",
          compact ? "size-10" : "size-14",
        )}
      >
        <Image
          src="/brand/logo-primary.png"
          alt="Sneaker Stream"
          fill
          className="object-cover transition duration-500 group-hover:scale-105"
          sizes={compact ? "40px" : "56px"}
          priority
        />
      </div>
      <div className={cn("space-y-0.5", compact && "hidden sm:block")}>
        <p className={cn("font-heading text-2xl leading-none tracking-wide", inverse ? "text-white" : "text-brand-black")}>
          Sneaker Stream
        </p>
        <p className={cn("text-[0.68rem] uppercase tracking-[0.28em]", inverse ? "text-brand-light-gray" : "text-brand-warm-gray")}>
          Curadoria de sneakers premium
        </p>
      </div>
    </Link>
  );
}

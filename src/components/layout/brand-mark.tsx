import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";

export function BrandMark({ compact = false, href = "/" }: { compact?: boolean; href?: string }) {
  return (
    <Link href={href} className="group inline-flex items-center gap-3">
      <div className={cn("relative overflow-hidden rounded-full border border-white/10 bg-white/5", compact ? "size-10" : "size-14")}>
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
        <p className="font-heading text-2xl leading-none tracking-wide text-white">Sneaker Stream</p>
        <p className="text-[0.68rem] uppercase tracking-[0.28em] text-brand-light-gray">A sua loja de tênis</p>
      </div>
    </Link>
  );
}

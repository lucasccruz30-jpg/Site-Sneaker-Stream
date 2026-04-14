import Link from "next/link";

import { Button } from "@/components/ui/button";

export function EmptyState({
  title,
  description,
  actionLabel,
  actionHref,
}: {
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
}) {
  return (
    <div className="store-panel p-10 text-center">
      <div className="mx-auto max-w-xl space-y-4">
        <h2 className="font-heading text-3xl text-brand-black">{title}</h2>
        <p className="text-sm leading-7 text-brand-charcoal">{description}</p>
        {actionHref && actionLabel ? (
          <Button asChild className="rounded-lg bg-brand-black text-white hover:bg-brand-charcoal">
            <Link href={actionHref}>{actionLabel}</Link>
          </Button>
        ) : null}
      </div>
    </div>
  );
}

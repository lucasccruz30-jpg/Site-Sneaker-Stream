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
    <div className="rounded-[2rem] border border-white/10 bg-white/5 p-10 text-center">
      <div className="mx-auto max-w-xl space-y-4">
        <h2 className="font-heading text-3xl text-white">{title}</h2>
        <p className="text-sm leading-7 text-brand-light-gray">{description}</p>
        {actionHref && actionLabel ? (
          <Button asChild className="bg-brand-wine text-white hover:bg-brand-wine/90">
            <Link href={actionHref}>{actionLabel}</Link>
          </Button>
        ) : null}
      </div>
    </div>
  );
}

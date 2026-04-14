import { cn } from "@/lib/utils";

export function Container({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return <div className={cn("mx-auto w-full max-w-[1440px] px-5 sm:px-7 lg:px-10 xl:px-12", className)}>{children}</div>;
}

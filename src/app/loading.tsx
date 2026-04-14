export default function GlobalLoading() {
  return (
    <div className="min-h-screen">
      <div className="mx-auto flex min-h-screen max-w-7xl items-center justify-center px-4">
        <div className="space-y-4 text-center">
          <div className="mx-auto size-16 animate-pulse rounded-full border border-white/10 bg-white/5" />
          <p className="text-sm uppercase tracking-[0.28em] text-brand-light-gray">Carregando Sneaker Stream</p>
        </div>
      </div>
    </div>
  );
}

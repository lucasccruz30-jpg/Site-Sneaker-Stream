import { formatCurrency } from "@/lib/format";
import { getAdminReports } from "@/server/queries/admin";

export default async function AdminReportsPage() {
  const reports = await getAdminReports();

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="surface-panel p-6">
        <p className="text-[0.72rem] uppercase tracking-[0.28em] text-brand-light-gray">Relatórios</p>
        <h2 className="mt-3 font-heading text-4xl text-white">Resumo comercial</h2>
        <div className="mt-6 grid gap-4">
          <div className="rounded-[1.5rem] border border-white/8 bg-black/15 p-4">
            <p className="text-sm text-brand-light-gray">Receita acumulada</p>
            <p className="mt-2 text-2xl font-semibold text-white">{formatCurrency(reports.revenueCents)}</p>
          </div>
          <div className="rounded-[1.5rem] border border-white/8 bg-black/15 p-4">
            <p className="text-sm text-brand-light-gray">Pedidos pagos</p>
            <p className="mt-2 text-2xl font-semibold text-white">{reports.totalOrders}</p>
          </div>
          <div className="rounded-[1.5rem] border border-white/8 bg-black/15 p-4">
            <p className="text-sm text-brand-light-gray">Itens vendidos</p>
            <p className="mt-2 text-2xl font-semibold text-white">{reports.totalItemsSold}</p>
          </div>
        </div>
      </div>
      <div className="surface-panel p-6">
        <p className="text-[0.72rem] uppercase tracking-[0.28em] text-brand-light-gray">Formas de pagamento</p>
        <h2 className="mt-3 font-heading text-4xl text-white">Distribuição</h2>
        <div className="mt-6 space-y-3">
          {Object.entries(reports.paymentMethodBreakdown).map(([method, count]) => (
            <div key={method} className="flex items-center justify-between rounded-[1.5rem] border border-white/8 bg-black/15 p-4 text-white">
              <span>{method}</span>
              <span>{count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

import { formatDateBR } from "@/lib/format";
import { getAdminCustomers } from "@/server/queries/admin";

export default async function AdminCustomersPage() {
  const customers = await getAdminCustomers();

  return (
    <div className="surface-panel p-6">
      <p className="text-[0.72rem] uppercase tracking-[0.28em] text-brand-light-gray">Clientes</p>
      <h2 className="mt-3 font-heading text-4xl text-white">Base cadastrada</h2>
      <div className="mt-6 overflow-x-auto">
        <table className="min-w-full text-left">
          <thead>
            <tr className="border-b border-white/8 text-sm text-brand-light-gray">
              <th className="pb-3">Nome</th>
              <th className="pb-3">E-mail</th>
              <th className="pb-3">Pedidos</th>
              <th className="pb-3">Cadastro</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr key={customer.id} className="border-b border-white/6 text-sm text-white">
                <td className="py-4">{customer.name}</td>
                <td className="py-4">{customer.email}</td>
                <td className="py-4">{customer._count.orders}</td>
                <td className="py-4">{formatDateBR(customer.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

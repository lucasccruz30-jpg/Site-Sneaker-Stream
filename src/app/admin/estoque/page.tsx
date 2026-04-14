import { getAdminInventory } from "@/server/queries/admin";

export default async function AdminInventoryPage() {
  const inventory = await getAdminInventory();

  return (
    <div className="surface-panel p-6">
      <p className="text-[0.72rem] uppercase tracking-[0.28em] text-brand-light-gray">Gestão de estoque</p>
      <h2 className="mt-3 font-heading text-4xl text-white">Grade por numeração</h2>
      <div className="mt-6 overflow-x-auto">
        <table className="min-w-full text-left">
          <thead>
            <tr className="border-b border-white/8 text-sm text-brand-light-gray">
              <th className="pb-3">Produto</th>
              <th className="pb-3">Marca</th>
              <th className="pb-3">Numeração</th>
              <th className="pb-3">Estoque</th>
            </tr>
          </thead>
          <tbody>
            {inventory.map((item) => (
              <tr key={item.id} className="border-b border-white/6 text-sm text-white">
                <td className="py-4">{item.product.name}</td>
                <td className="py-4">{item.product.brand.name}</td>
                <td className="py-4">{item.size.label}</td>
                <td className="py-4">{item.stock}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

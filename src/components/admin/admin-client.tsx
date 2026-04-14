"use client";

import { useTransition } from "react";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { toast } from "sonner";

import { moderateReviewAction, updateOrderStatusAction } from "@/server/actions/admin";
import { formatCurrency } from "@/lib/format";

import { Button } from "@/components/ui/button";

export function RevenueChart({
  data,
}: {
  data: Array<{ label: string; totalCents: number }>;
}) {
  return (
    <div className="surface-panel p-6">
      <p className="text-[0.72rem] uppercase tracking-[0.28em] text-brand-light-gray">Receita por período</p>
      <h2 className="mt-3 font-heading text-3xl text-white">Evolução de vendas</h2>
      <div className="mt-6 h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis dataKey="label" stroke="#95898A" />
            <YAxis stroke="#95898A" tickFormatter={(value) => `R$ ${Math.round(Number(value) / 100)}`} />
            <Tooltip
              formatter={(value) => formatCurrency(Number(value ?? 0))}
              contentStyle={{
                background: "#131313",
                border: "1px solid rgba(212,202,202,0.12)",
                color: "#FEFDFC",
              }}
            />
            <Bar dataKey="totalCents" fill="#550D1A" radius={[12, 12, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function OrderStatusInlineForm({
  orderId,
  defaultStatus,
  defaultTrackingCode,
}: {
  orderId: string;
  defaultStatus: string;
  defaultTrackingCode?: string | null;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <form
      className="flex flex-col gap-2 lg:flex-row"
      onSubmit={(event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);

        startTransition(async () => {
          const result = await updateOrderStatusAction({
            orderId,
            status: formData.get("status"),
            trackingCode: formData.get("trackingCode"),
          });

          if (!result.success) {
            toast.error(result.message);
            return;
          }
          toast.success(result.message);
        });
      }}
    >
      <select
        name="status"
        defaultValue={defaultStatus}
        className="h-10 rounded-full border border-white/10 bg-white/5 px-4 text-sm text-white"
      >
        <option value="PENDING">Pendente</option>
        <option value="PAID">Pago</option>
        <option value="PICKING">Em separação</option>
        <option value="SHIPPED">Enviado</option>
        <option value="DELIVERED">Entregue</option>
        <option value="CANCELLED">Cancelado</option>
      </select>
      <input
        name="trackingCode"
        defaultValue={defaultTrackingCode ?? ""}
        placeholder="Rastreio"
        className="h-10 rounded-full border border-white/10 bg-white/5 px-4 text-sm text-white placeholder:text-brand-light-gray"
      />
      <Button type="submit" disabled={isPending} className="rounded-full bg-brand-wine text-white hover:bg-brand-wine/90">
        Atualizar
      </Button>
    </form>
  );
}

export function ReviewModerationButtons({ reviewId }: { reviewId: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <div className="flex gap-2">
      <Button
        type="button"
        disabled={isPending}
        className="rounded-full bg-brand-wine text-white hover:bg-brand-wine/90"
        onClick={() =>
          startTransition(async () => {
            const result = await moderateReviewAction({ reviewId, status: "APPROVED" });
            if (!result.success) {
              toast.error(result.message);
              return;
            }
            toast.success(result.message);
          })
        }
      >
        Aprovar
      </Button>
      <Button
        type="button"
        variant="outline"
        disabled={isPending}
        className="rounded-full border-white/10 bg-white/5 text-white hover:bg-white/10"
        onClick={() =>
          startTransition(async () => {
            const result = await moderateReviewAction({ reviewId, status: "REJECTED" });
            if (!result.success) {
              toast.error(result.message);
              return;
            }
            toast.success(result.message);
          })
        }
      >
        Rejeitar
      </Button>
    </div>
  );
}

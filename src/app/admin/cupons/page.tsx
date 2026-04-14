import { CouponAdminForm } from "@/components/admin/simple-forms";
import { getAdminCoupons } from "@/server/queries/admin";

export default async function AdminCouponsPage() {
  const coupons = await getAdminCoupons();

  return (
    <div className="grid gap-6 xl:grid-cols-2">
      <CouponAdminForm />
      {coupons.map((coupon) => (
        <CouponAdminForm key={coupon.id} initialData={coupon} />
      ))}
    </div>
  );
}

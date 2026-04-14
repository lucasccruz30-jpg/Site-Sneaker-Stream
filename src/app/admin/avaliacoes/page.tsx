import { ReviewModerationButtons } from "@/components/admin/admin-client";
import { getAdminReviews } from "@/server/queries/admin";

export default async function AdminReviewsPage() {
  const reviews = await getAdminReviews();

  return (
    <div className="space-y-5">
      {reviews.map((review) => (
        <article key={review.id} className="surface-panel p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-2">
              <p className="text-[0.72rem] uppercase tracking-[0.28em] text-brand-light-gray">
                {review.product.name} • {review.rating}/5
              </p>
              <h2 className="text-xl font-semibold text-white">{review.title ?? "Avaliação sem título"}</h2>
              <p className="text-sm leading-7 text-brand-light-gray">{review.comment}</p>
              <p className="text-sm text-brand-light-gray">Autor: {review.user.name}</p>
            </div>
            <ReviewModerationButtons reviewId={review.id} />
          </div>
        </article>
      ))}
    </div>
  );
}

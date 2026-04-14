"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import {
  saveBannerAction,
  saveBrandAction,
  saveCategoryAction,
  saveContentPageAction,
  saveCouponAction,
  saveSettingsAction,
} from "@/server/actions/admin";
import {
  bannerAdminSchema,
  brandAdminSchema,
  categoryAdminSchema,
  contentPageAdminSchema,
  couponAdminSchema,
  settingsAdminSchema,
} from "@/lib/validators/admin";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

function AdminFormShell({
  title,
  description,
  children,
  onSubmit,
  isPending,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  isPending: boolean;
}) {
  return (
    <form className="surface-panel space-y-4 p-6" onSubmit={onSubmit}>
      <div>
        <h2 className="font-heading text-3xl text-white">{title}</h2>
        <p className="mt-2 text-sm leading-7 text-brand-light-gray">{description}</p>
      </div>
      {children}
      <Button type="submit" disabled={isPending} className="rounded-full bg-brand-wine text-white hover:bg-brand-wine/90">
        Salvar
      </Button>
    </form>
  );
}

export function CategoryAdminForm({
  initialData,
}: {
  initialData?: {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    imageUrl: string | null;
    isFeatured: boolean;
    isActive: boolean;
  };
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const form = useForm({
    resolver: zodResolver(categoryAdminSchema),
    defaultValues: {
      id: initialData?.id,
      name: initialData?.name ?? "",
      slug: initialData?.slug ?? "",
      description: initialData?.description ?? "",
      imageUrl: initialData?.imageUrl ?? "",
      isFeatured: initialData?.isFeatured ?? false,
      isActive: initialData?.isActive ?? true,
    },
  });

  return (
    <AdminFormShell
      title={initialData ? "Editar categoria" : "Nova categoria"}
      description="Organize o catálogo com camadas que ajudam o cliente a decidir mais rápido."
      isPending={isPending}
      onSubmit={form.handleSubmit((values) =>
        startTransition(async () => {
          const result = await saveCategoryAction(values);
          if (!result.success) {
            toast.error(result.message);
            return;
          }
          toast.success(result.message);
          router.refresh();
          if (!initialData) {
            form.reset({ name: "", slug: "", description: "", imageUrl: "", isFeatured: false, isActive: true });
          }
        }),
      )}
    >
      <Input {...form.register("name")} placeholder="Nome" className="border-white/10 bg-white/5 text-white" />
      <Input {...form.register("slug")} placeholder="Slug" className="border-white/10 bg-white/5 text-white" />
      <Textarea {...form.register("description")} placeholder="Descrição" className="min-h-28 border-white/10 bg-white/5 text-white" />
      <Input {...form.register("imageUrl")} placeholder="URL da imagem" className="border-white/10 bg-white/5 text-white" />
      <div className="flex gap-4">
        <label className="flex items-center gap-2 text-sm text-white">
          <input type="checkbox" {...form.register("isFeatured")} className="accent-[#550D1A]" />
          Destaque
        </label>
        <label className="flex items-center gap-2 text-sm text-white">
          <input type="checkbox" {...form.register("isActive")} className="accent-[#550D1A]" />
          Ativa
        </label>
      </div>
    </AdminFormShell>
  );
}

export function BrandAdminForm({
  initialData,
}: {
  initialData?: {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    logoUrl: string | null;
    isFeatured: boolean;
    isActive: boolean;
  };
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const form = useForm({
    resolver: zodResolver(brandAdminSchema),
    defaultValues: {
      id: initialData?.id,
      name: initialData?.name ?? "",
      slug: initialData?.slug ?? "",
      description: initialData?.description ?? "",
      logoUrl: initialData?.logoUrl ?? "",
      isFeatured: initialData?.isFeatured ?? false,
      isActive: initialData?.isActive ?? true,
    },
  });

  return (
    <AdminFormShell
      title={initialData ? "Editar marca" : "Nova marca"}
      description="Mantenha a leitura premium do catálogo a partir das marcas com maior força de desejo."
      isPending={isPending}
      onSubmit={form.handleSubmit((values) =>
        startTransition(async () => {
          const result = await saveBrandAction(values);
          if (!result.success) {
            toast.error(result.message);
            return;
          }
          toast.success(result.message);
          router.refresh();
        }),
      )}
    >
      <Input {...form.register("name")} placeholder="Nome" className="border-white/10 bg-white/5 text-white" />
      <Input {...form.register("slug")} placeholder="Slug" className="border-white/10 bg-white/5 text-white" />
      <Textarea {...form.register("description")} placeholder="Descrição" className="min-h-28 border-white/10 bg-white/5 text-white" />
      <Input {...form.register("logoUrl")} placeholder="URL da logo" className="border-white/10 bg-white/5 text-white" />
      <div className="flex gap-4">
        <label className="flex items-center gap-2 text-sm text-white">
          <input type="checkbox" {...form.register("isFeatured")} className="accent-[#550D1A]" />
          Destaque
        </label>
        <label className="flex items-center gap-2 text-sm text-white">
          <input type="checkbox" {...form.register("isActive")} className="accent-[#550D1A]" />
          Ativa
        </label>
      </div>
    </AdminFormShell>
  );
}

export function CouponAdminForm({
  initialData,
}: {
  initialData?: {
    id: string;
    code: string;
    description?: string | null;
    type: "PERCENTAGE" | "FIXED_AMOUNT" | "FREE_SHIPPING";
    value: number;
    minOrderCents?: number | null;
    maxDiscountCents?: number | null;
    usageLimit?: number | null;
    isActive: boolean;
    startsAt?: Date | null;
    endsAt?: Date | null;
  };
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const form = useForm({
    resolver: zodResolver(couponAdminSchema),
    defaultValues: {
      id: initialData?.id,
      code: initialData?.code ?? "",
      description: initialData?.description ?? "",
      type: initialData?.type ?? "PERCENTAGE",
      value: initialData?.value ?? 0,
      minOrderCents: initialData?.minOrderCents ?? undefined,
      maxDiscountCents: initialData?.maxDiscountCents ?? undefined,
      usageLimit: initialData?.usageLimit ?? undefined,
      isActive: initialData?.isActive ?? true,
      startsAt: initialData?.startsAt ? initialData.startsAt.toISOString().slice(0, 16) : "",
      endsAt: initialData?.endsAt ? initialData.endsAt.toISOString().slice(0, 16) : "",
    },
  });

  return (
    <AdminFormShell
      title={initialData ? "Editar cupom" : "Novo cupom"}
      description="Ative ofertas com limite, valor mínimo e condições preparadas para campanhas."
      isPending={isPending}
      onSubmit={form.handleSubmit((values) =>
        startTransition(async () => {
          const result = await saveCouponAction(values);
          if (!result.success) {
            toast.error(result.message);
            return;
          }
          toast.success(result.message);
          router.refresh();
        }),
      )}
    >
      <Input {...form.register("code")} placeholder="Código" className="border-white/10 bg-white/5 text-white" />
      <Textarea {...form.register("description")} placeholder="Descrição" className="min-h-24 border-white/10 bg-white/5 text-white" />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <select {...form.register("type")} className="h-11 rounded-2xl border border-white/10 bg-white/5 px-4 text-white">
          <option value="PERCENTAGE">Percentual</option>
          <option value="FIXED_AMOUNT">Valor fixo</option>
          <option value="FREE_SHIPPING">Frete grátis</option>
        </select>
        <Input type="number" {...form.register("value", { valueAsNumber: true })} placeholder="Valor" className="border-white/10 bg-white/5 text-white" />
        <Input type="number" {...form.register("minOrderCents", { valueAsNumber: true })} placeholder="Pedido mínimo" className="border-white/10 bg-white/5 text-white" />
        <Input type="number" {...form.register("usageLimit", { valueAsNumber: true })} placeholder="Limite de uso" className="border-white/10 bg-white/5 text-white" />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Input type="datetime-local" {...form.register("startsAt")} className="border-white/10 bg-white/5 text-white" />
        <Input type="datetime-local" {...form.register("endsAt")} className="border-white/10 bg-white/5 text-white" />
      </div>
      <label className="flex items-center gap-2 text-sm text-white">
        <input type="checkbox" {...form.register("isActive")} className="accent-[#550D1A]" />
        Cupom ativo
      </label>
    </AdminFormShell>
  );
}

export function BannerAdminForm({
  initialData,
}: {
  initialData?: {
    id: string;
    title: string;
    subtitle: string | null;
    eyebrow: string | null;
    ctaLabel: string | null;
    ctaHref: string | null;
    imageUrl: string | null;
    mobileImageUrl: string | null;
    placement: "HERO" | "FEATURED" | "MIDPAGE" | "FOOTER" | "DROPS";
    sortOrder: number;
    accent: string | null;
    isActive: boolean;
  };
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const form = useForm({
    resolver: zodResolver(bannerAdminSchema),
    defaultValues: {
      id: initialData?.id,
      title: initialData?.title ?? "",
      subtitle: initialData?.subtitle ?? "",
      eyebrow: initialData?.eyebrow ?? "",
      ctaLabel: initialData?.ctaLabel ?? "",
      ctaHref: initialData?.ctaHref ?? "",
      imageUrl: initialData?.imageUrl ?? "",
      mobileImageUrl: initialData?.mobileImageUrl ?? "",
      placement: initialData?.placement ?? "HERO",
      sortOrder: initialData?.sortOrder ?? 0,
      accent: initialData?.accent ?? "#550D1A",
      isActive: initialData?.isActive ?? true,
    },
  });

  return (
    <AdminFormShell
      title={initialData ? "Editar banner" : "Novo banner"}
      description="Controle vitrines, hero sections e comunicação comercial sem depender de deploy."
      isPending={isPending}
      onSubmit={form.handleSubmit((values) =>
        startTransition(async () => {
          const result = await saveBannerAction(values);
          if (!result.success) {
            toast.error(result.message);
            return;
          }
          toast.success(result.message);
          router.refresh();
        }),
      )}
    >
      <Input {...form.register("title")} placeholder="Título" className="border-white/10 bg-white/5 text-white" />
      <Textarea {...form.register("subtitle")} placeholder="Subtítulo" className="min-h-24 border-white/10 bg-white/5 text-white" />
      <div className="grid gap-4 md:grid-cols-2">
        <Input {...form.register("eyebrow")} placeholder="Eyebrow" className="border-white/10 bg-white/5 text-white" />
        <select {...form.register("placement")} className="h-11 rounded-2xl border border-white/10 bg-white/5 px-4 text-white">
          <option value="HERO">Hero</option>
          <option value="FEATURED">Featured</option>
          <option value="MIDPAGE">Midpage</option>
          <option value="FOOTER">Footer</option>
          <option value="DROPS">Drops</option>
        </select>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Input {...form.register("ctaLabel")} placeholder="Texto do CTA" className="border-white/10 bg-white/5 text-white" />
        <Input {...form.register("ctaHref")} placeholder="/shop" className="border-white/10 bg-white/5 text-white" />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Input {...form.register("imageUrl")} placeholder="Imagem desktop" className="border-white/10 bg-white/5 text-white" />
        <Input {...form.register("mobileImageUrl")} placeholder="Imagem mobile" className="border-white/10 bg-white/5 text-white" />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Input type="number" {...form.register("sortOrder", { valueAsNumber: true })} placeholder="Ordem" className="border-white/10 bg-white/5 text-white" />
        <Input {...form.register("accent")} placeholder="#550D1A" className="border-white/10 bg-white/5 text-white" />
      </div>
      <label className="flex items-center gap-2 text-sm text-white">
        <input type="checkbox" {...form.register("isActive")} className="accent-[#550D1A]" />
        Banner ativo
      </label>
    </AdminFormShell>
  );
}

export function ContentPageAdminForm({
  initialData,
}: {
  initialData?: {
    id: string;
    slug: string;
    title: string;
    heroTitle: string;
    heroSubtitle: string | null;
    body: unknown;
    seoTitle: string | null;
    seoDescription: string | null;
  };
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const form = useForm({
    resolver: zodResolver(contentPageAdminSchema),
    defaultValues: {
      id: initialData?.id,
      slug: initialData?.slug ?? "",
      title: initialData?.title ?? "",
      heroTitle: initialData?.heroTitle ?? "",
      heroSubtitle: initialData?.heroSubtitle ?? "",
      body: initialData?.body ? JSON.stringify(initialData.body, null, 2) : "",
      seoTitle: initialData?.seoTitle ?? "",
      seoDescription: initialData?.seoDescription ?? "",
    },
  });

  return (
    <AdminFormShell
      title={initialData ? "Editar conteúdo" : "Nova página institucional"}
      description="Mantenha textos institucionais e páginas estáticas editáveis pelo admin."
      isPending={isPending}
      onSubmit={form.handleSubmit((values) =>
        startTransition(async () => {
          const result = await saveContentPageAction(values);
          if (!result.success) {
            toast.error(result.message);
            return;
          }
          toast.success(result.message);
          router.refresh();
        }),
      )}
    >
      <Input {...form.register("slug")} placeholder="Slug" className="border-white/10 bg-white/5 text-white" />
      <Input {...form.register("title")} placeholder="Título" className="border-white/10 bg-white/5 text-white" />
      <Input {...form.register("heroTitle")} placeholder="Hero title" className="border-white/10 bg-white/5 text-white" />
      <Textarea {...form.register("heroSubtitle")} placeholder="Hero subtitle" className="min-h-20 border-white/10 bg-white/5 text-white" />
      <Textarea {...form.register("body")} placeholder='{"sections":[{"title":"...","content":"..."}]}' className="min-h-40 border-white/10 bg-white/5 font-mono text-white" />
      <Input {...form.register("seoTitle")} placeholder="SEO title" className="border-white/10 bg-white/5 text-white" />
      <Textarea {...form.register("seoDescription")} placeholder="SEO description" className="min-h-20 border-white/10 bg-white/5 text-white" />
    </AdminFormShell>
  );
}

export function SettingsAdminForm({
  initialData,
}: {
  initialData?: {
    storeName: string;
    tagline: string;
    supportEmail: string;
    supportPhone: string;
    whatsapp: string | null;
    logoUrl: string | null;
    faviconUrl: string | null;
    primaryColor: string;
    accentColor: string;
    highlightColor: string;
    offWhiteColor: string;
    metaTitle: string;
    metaDescription: string;
    shippingLeadText: string;
    announcementText: string | null;
    instagramUrl: string | null;
    tiktokUrl: string | null;
    freeShippingThresholdCents: number | null;
    pixDiscountPercentage: number;
    authenticityMessage: string;
  } | null;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const form = useForm({
    resolver: zodResolver(settingsAdminSchema),
    defaultValues: {
      storeName: initialData?.storeName ?? "Sneaker Stream",
      tagline: initialData?.tagline ?? "A sua loja de tênis premium e importados",
      supportEmail: initialData?.supportEmail ?? "contato@sneakerstream.com.br",
      supportPhone: initialData?.supportPhone ?? "+55 11 99999-9999",
      whatsapp: initialData?.whatsapp ?? "",
      logoUrl: initialData?.logoUrl ?? "/brand/logo-primary.png",
      faviconUrl: initialData?.faviconUrl ?? "/brand/favicon.png",
      primaryColor: initialData?.primaryColor ?? "#575656",
      accentColor: initialData?.accentColor ?? "#550D1A",
      highlightColor: initialData?.highlightColor ?? "#131313",
      offWhiteColor: initialData?.offWhiteColor ?? "#FEFDFC",
      metaTitle: initialData?.metaTitle ?? "Sneaker Stream | Tênis importados",
      metaDescription: initialData?.metaDescription ?? "Loja premium de sneakers importados com foco em autenticidade e desejo.",
      shippingLeadText: initialData?.shippingLeadText ?? "Despacho rápido com rastreio seguro.",
      announcementText: initialData?.announcementText ?? "",
      instagramUrl: initialData?.instagramUrl ?? "",
      tiktokUrl: initialData?.tiktokUrl ?? "",
      freeShippingThresholdCents: initialData?.freeShippingThresholdCents ?? undefined,
      pixDiscountPercentage: initialData?.pixDiscountPercentage ?? 5,
      authenticityMessage: initialData?.authenticityMessage ?? "Todos os pares passam por conferência interna de autenticidade.",
    },
  });

  return (
    <AdminFormShell
      title="Configurações gerais"
      description="Branding, SEO, contatos, cores e parâmetros comerciais da operação."
      isPending={isPending}
      onSubmit={form.handleSubmit((values) =>
        startTransition(async () => {
          const result = await saveSettingsAction(values);
          if (!result.success) {
            toast.error(result.message);
            return;
          }
          toast.success(result.message);
          router.refresh();
        }),
      )}
    >
      <div className="grid gap-4 md:grid-cols-2">
        <Input {...form.register("storeName")} placeholder="Nome da loja" className="border-white/10 bg-white/5 text-white" />
        <Input {...form.register("tagline")} placeholder="Tagline" className="border-white/10 bg-white/5 text-white" />
        <Input {...form.register("supportEmail")} placeholder="E-mail de suporte" className="border-white/10 bg-white/5 text-white" />
        <Input {...form.register("supportPhone")} placeholder="Telefone de suporte" className="border-white/10 bg-white/5 text-white" />
        <Input {...form.register("logoUrl")} placeholder="Logo" className="border-white/10 bg-white/5 text-white" />
        <Input {...form.register("faviconUrl")} placeholder="Favicon" className="border-white/10 bg-white/5 text-white" />
        <Input {...form.register("primaryColor")} placeholder="#575656" className="border-white/10 bg-white/5 text-white" />
        <Input {...form.register("accentColor")} placeholder="#550D1A" className="border-white/10 bg-white/5 text-white" />
      </div>
      <Textarea {...form.register("metaTitle")} placeholder="Título SEO" className="min-h-20 border-white/10 bg-white/5 text-white" />
      <Textarea {...form.register("metaDescription")} placeholder="Descrição SEO" className="min-h-24 border-white/10 bg-white/5 text-white" />
      <Textarea {...form.register("shippingLeadText")} placeholder="Texto de entrega" className="min-h-20 border-white/10 bg-white/5 text-white" />
      <Textarea {...form.register("authenticityMessage")} placeholder="Mensagem de autenticidade" className="min-h-20 border-white/10 bg-white/5 text-white" />
    </AdminFormShell>
  );
}

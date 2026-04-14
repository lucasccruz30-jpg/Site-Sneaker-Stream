"use client";

import Link from "next/link";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";

import { deleteProductAction, saveProductAction } from "@/server/actions/admin";
import { parseCsvList, parseLineList } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const productFormSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(3),
  slug: z.string().optional(),
  sku: z.string().min(3),
  brandId: z.string().min(1),
  categoryId: z.string().min(1),
  shortDescription: z.string().min(20),
  description: z.string().min(40),
  colorway: z.string().optional(),
  basePriceInCents: z.number().int().min(0),
  salePriceInCents: z.number().int().min(0).optional(),
  installmentCount: z.number().int().min(1).max(12),
  leadTimeInBusinessDays: z.number().int().min(1).max(20),
  isFeatured: z.boolean(),
  isActive: z.boolean(),
  isExclusive: z.boolean(),
  isNewRelease: z.boolean(),
  isOnSale: z.boolean(),
  imageUrlsText: z.string().min(5),
  keywordsText: z.string().optional(),
  highlightsText: z.string().optional(),
  specsText: z.string().optional(),
  variants: z.array(
    z.object({
      sizeId: z.string(),
      sizeLabel: z.string(),
      stock: z.number().int().min(0),
    }),
  ),
});

type ProductFormValues = z.infer<typeof productFormSchema>;

export function ProductAdminForm({
  initialProduct,
  brands,
  categories,
  sizes,
}: {
  initialProduct?: {
    id: string;
    name: string;
    slug: string;
    sku: string;
    brandId: string;
    categoryId: string;
    shortDescription: string;
    description: string;
    colorway: string | null;
    basePriceInCents: number;
    salePriceInCents: number | null;
    installmentCount: number;
    leadTimeInBusinessDays: number;
    isFeatured: boolean;
    isActive: boolean;
    isExclusive: boolean;
    isNewRelease: boolean;
    isOnSale: boolean;
    images: Array<{ url: string }>;
    variants: Array<{ sizeId: string; size: { label: string }; stock: number }>;
    searchKeywords: string[];
    highlights: unknown;
    specs: unknown;
  } | null;
  brands: Array<{ id: string; name: string }>;
  categories: Array<{ id: string; name: string }>;
  sizes: Array<{ id: string; label: string }>;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      id: initialProduct?.id,
      name: initialProduct?.name ?? "",
      slug: initialProduct?.slug ?? "",
      sku: initialProduct?.sku ?? "",
      brandId: initialProduct?.brandId ?? brands[0]?.id ?? "",
      categoryId: initialProduct?.categoryId ?? categories[0]?.id ?? "",
      shortDescription: initialProduct?.shortDescription ?? "",
      description: initialProduct?.description ?? "",
      colorway: initialProduct?.colorway ?? "",
      basePriceInCents: initialProduct?.basePriceInCents ?? 0,
      salePriceInCents: initialProduct?.salePriceInCents ?? undefined,
      installmentCount: initialProduct?.installmentCount ?? 10,
      leadTimeInBusinessDays: initialProduct?.leadTimeInBusinessDays ?? 2,
      isFeatured: initialProduct?.isFeatured ?? true,
      isActive: initialProduct?.isActive ?? true,
      isExclusive: initialProduct?.isExclusive ?? false,
      isNewRelease: initialProduct?.isNewRelease ?? false,
      isOnSale: initialProduct?.isOnSale ?? Boolean(initialProduct?.salePriceInCents),
      imageUrlsText: initialProduct?.images.map((image) => image.url).join("\n") ?? "",
      keywordsText: initialProduct?.searchKeywords.join(", ") ?? "",
      highlightsText:
        Array.isArray(initialProduct?.highlights)
          ? initialProduct?.highlights.join("\n")
          : "",
      specsText:
        Array.isArray(initialProduct?.specs)
          ? initialProduct.specs
              .map((spec) =>
                typeof spec === "object" && spec && "label" in spec && "value" in spec
                  ? `${String(spec.label)}: ${String(spec.value)}`
                  : "",
              )
              .filter(Boolean)
              .join("\n")
          : "",
      variants: sizes.map((size) => ({
        sizeId: size.id,
        sizeLabel: size.label,
        stock: initialProduct?.variants.find((variant) => variant.sizeId === size.id)?.stock ?? 0,
      })),
    },
  });

  const isOnSale = useWatch({ control: form.control, name: "isOnSale" });

  return (
    <form
      className="surface-panel space-y-6 p-6"
      onSubmit={form.handleSubmit((values) => {
        startTransition(async () => {
          const specs = parseLineList(values.specsText ?? "").map((line) => {
            const [label, ...rest] = line.split(":");
            return {
              label: label.trim(),
              value: rest.join(":").trim(),
            };
          });

          const result = await saveProductAction({
            id: values.id,
            name: values.name,
            slug: values.slug,
            sku: values.sku,
            brandId: values.brandId,
            categoryId: values.categoryId,
            shortDescription: values.shortDescription,
            description: values.description,
            colorway: values.colorway,
            basePriceInCents: values.basePriceInCents,
            salePriceInCents: values.isOnSale ? values.salePriceInCents ?? null : null,
            installmentCount: values.installmentCount,
            leadTimeInBusinessDays: values.leadTimeInBusinessDays,
            isFeatured: values.isFeatured,
            isActive: values.isActive,
            isExclusive: values.isExclusive,
            isNewRelease: values.isNewRelease,
            isOnSale: values.isOnSale,
            imageUrls: parseLineList(values.imageUrlsText),
            keywordList: parseCsvList(values.keywordsText ?? ""),
            highlightList: parseLineList(values.highlightsText ?? ""),
            specs: specs.filter((spec) => spec.label && spec.value),
            variants: values.variants,
          });

          if (!result.success) {
            toast.error(result.message);
            return;
          }

          toast.success(result.message);
          router.push("/admin/produtos");
          router.refresh();
        });
      })}
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-[0.72rem] uppercase tracking-[0.28em] text-brand-light-gray">Produto</p>
          <h2 className="mt-3 font-heading text-4xl text-white">
            {initialProduct ? "Editar produto" : "Novo produto"}
          </h2>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button asChild variant="outline" className="rounded-full border-white/10 bg-white/5 text-white hover:bg-white/10">
            <Link href="/admin/produtos">Voltar</Link>
          </Button>
          {initialProduct?.id ? (
            <Button
              type="button"
              variant="outline"
              className="rounded-full border-red-400/30 bg-red-400/10 text-red-200 hover:bg-red-400/20"
              onClick={() =>
                startTransition(async () => {
                  const result = await deleteProductAction(initialProduct.id);
                  if (!result.success) {
                    toast.error(result.message);
                    return;
                  }
                  toast.success(result.message);
                  router.push("/admin/produtos");
                  router.refresh();
                })
              }
            >
              Excluir produto
            </Button>
          ) : null}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm text-brand-light-gray">Nome</label>
          <Input {...form.register("name")} className="border-white/10 bg-white/5 text-white" />
        </div>
        <div className="space-y-2">
          <label className="text-sm text-brand-light-gray">Slug</label>
          <Input {...form.register("slug")} className="border-white/10 bg-white/5 text-white" />
        </div>
        <div className="space-y-2">
          <label className="text-sm text-brand-light-gray">SKU</label>
          <Input {...form.register("sku")} className="border-white/10 bg-white/5 text-white" />
        </div>
        <div className="space-y-2">
          <label className="text-sm text-brand-light-gray">Colorway</label>
          <Input {...form.register("colorway")} className="border-white/10 bg-white/5 text-white" />
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm text-brand-light-gray">Marca</label>
          <select {...form.register("brandId")} className="h-11 w-full rounded-2xl border border-white/10 bg-white/5 px-4 text-white">
            {brands.map((brand) => (
              <option key={brand.id} value={brand.id}>
                {brand.name}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-sm text-brand-light-gray">Categoria</label>
          <select {...form.register("categoryId")} className="h-11 w-full rounded-2xl border border-white/10 bg-white/5 px-4 text-white">
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm text-brand-light-gray">Resumo comercial</label>
        <Textarea {...form.register("shortDescription")} className="min-h-24 border-white/10 bg-white/5 text-white" />
      </div>
      <div className="space-y-2">
        <label className="text-sm text-brand-light-gray">Descrição completa</label>
        <Textarea {...form.register("description")} className="min-h-32 border-white/10 bg-white/5 text-white" />
      </div>

      <div className="grid gap-4 lg:grid-cols-4">
        <div className="space-y-2">
          <label className="text-sm text-brand-light-gray">Preço base em centavos</label>
          <Input type="number" {...form.register("basePriceInCents", { valueAsNumber: true })} className="border-white/10 bg-white/5 text-white" />
        </div>
        <div className="space-y-2">
          <label className="text-sm text-brand-light-gray">Preço promocional</label>
          <Input
            type="number"
            {...form.register("salePriceInCents", { valueAsNumber: true })}
            disabled={!isOnSale}
            className="border-white/10 bg-white/5 text-white disabled:opacity-40"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm text-brand-light-gray">Parcelas</label>
          <Input type="number" {...form.register("installmentCount", { valueAsNumber: true })} className="border-white/10 bg-white/5 text-white" />
        </div>
        <div className="space-y-2">
          <label className="text-sm text-brand-light-gray">Prazo de despacho</label>
          <Input type="number" {...form.register("leadTimeInBusinessDays", { valueAsNumber: true })} className="border-white/10 bg-white/5 text-white" />
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {[
          ["isFeatured", "Destaque"],
          ["isActive", "Ativo"],
          ["isExclusive", "Exclusivo"],
          ["isNewRelease", "Lançamento"],
          ["isOnSale", "Oferta"],
        ].map(([field, label]) => (
          <label key={field} className="flex items-center gap-3 rounded-2xl border border-white/8 bg-black/15 px-4 py-3 text-sm text-white">
            <input type="checkbox" {...form.register(field as keyof ProductFormValues)} className="size-4 accent-[#550D1A]" />
            {label}
          </label>
        ))}
      </div>

      <div className="space-y-2">
        <label className="text-sm text-brand-light-gray">Imagens do produto</label>
        <Textarea
          {...form.register("imageUrlsText")}
          className="min-h-32 border-white/10 bg-white/5 text-white"
          placeholder="Uma URL por linha"
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="space-y-2">
          <label className="text-sm text-brand-light-gray">Palavras-chave</label>
          <Textarea
            {...form.register("keywordsText")}
            className="min-h-28 border-white/10 bg-white/5 text-white"
            placeholder="nike, dunk, importado, premium"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm text-brand-light-gray">Highlights</label>
          <Textarea
            {...form.register("highlightsText")}
            className="min-h-28 border-white/10 bg-white/5 text-white"
            placeholder="Um highlight por linha"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm text-brand-light-gray">Especificações</label>
          <Textarea
            {...form.register("specsText")}
            className="min-h-28 border-white/10 bg-white/5 text-white"
            placeholder="Cabedal: Couro premium"
          />
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <p className="text-[0.72rem] uppercase tracking-[0.28em] text-brand-light-gray">Estoque por numeração</p>
          <h3 className="mt-2 font-heading text-3xl text-white">Grade comercial</h3>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {form.getValues("variants").map((variant, index) => (
            <div key={variant.sizeId} className="rounded-[1.5rem] border border-white/8 bg-black/15 p-4">
              <p className="text-sm text-brand-light-gray">Tamanho {variant.sizeLabel}</p>
              <Input
                type="number"
                {...form.register(`variants.${index}.stock`, { valueAsNumber: true })}
                className="mt-3 border-white/10 bg-white/5 text-white"
              />
            </div>
          ))}
        </div>
      </div>

      <Button type="submit" disabled={isPending} className="h-12 rounded-full bg-brand-wine px-8 text-white hover:bg-brand-wine/90">
        Salvar produto
      </Button>
    </form>
  );
}

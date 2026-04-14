"use client";

import { useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { createReviewAction, registerUserAction } from "@/server/actions/store";
import { loginSchema } from "@/lib/validators/auth";
import { contactSchema, newsletterSchema, reviewSchema } from "@/lib/validators/store";
import type { ProductDetailData } from "@/types";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const registerFormSchema = loginSchema.extend({
  name: contactSchema.shape.name,
  phone: contactSchema.shape.phone,
  confirmPassword: loginSchema.shape.password,
});

export function NewsletterForm() {
  const [isPending, startTransition] = useTransition();
  const form = useForm({
    resolver: zodResolver(newsletterSchema),
    defaultValues: { name: "", email: "" },
  });

  return (
    <form
      className="grid gap-3 sm:grid-cols-[1fr_1fr_auto]"
      onSubmit={form.handleSubmit((values) => {
        startTransition(async () => {
          const response = await fetch("/api/newsletter", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(values),
          });
          const payload = (await response.json()) as { success: boolean; message: string };
          if (!payload.success) {
            toast.error(payload.message);
            return;
          }
          toast.success(payload.message);
          form.reset();
        });
      })}
    >
      <Input {...form.register("name")} placeholder="Seu nome" className="border-white/10 bg-white/5 text-white" />
      <Input {...form.register("email")} placeholder="Seu melhor e-mail" className="border-white/10 bg-white/5 text-white" />
      <Button type="submit" disabled={isPending} className="h-11 rounded-full bg-brand-wine text-white hover:bg-brand-wine/90">
        Receber drops
      </Button>
    </form>
  );
}

export function ContactForm() {
  const [isPending, startTransition] = useTransition();
  const form = useForm({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    },
  });

  return (
    <form
      className="surface-panel space-y-4 p-6"
      onSubmit={form.handleSubmit((values) => {
        startTransition(async () => {
          const response = await fetch("/api/contact", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(values),
          });

          const payload = (await response.json()) as { success: boolean; message: string };
          if (!payload.success) {
            toast.error(payload.message);
            return;
          }
          toast.success(payload.message);
          form.reset();
        });
      })}
    >
      <div className="grid gap-4 md:grid-cols-2">
        <Input {...form.register("name")} placeholder="Seu nome" className="border-white/10 bg-white/5 text-white" />
        <Input {...form.register("email")} placeholder="Seu e-mail" className="border-white/10 bg-white/5 text-white" />
        <Input {...form.register("phone")} placeholder="Telefone" className="border-white/10 bg-white/5 text-white" />
        <Input {...form.register("subject")} placeholder="Assunto" className="border-white/10 bg-white/5 text-white" />
      </div>
      <Textarea
        {...form.register("message")}
        placeholder="Conte o que você precisa e nossa equipe responde com rapidez."
        className="min-h-40 border-white/10 bg-white/5 text-white"
      />
      <Button type="submit" disabled={isPending} className="h-11 rounded-full bg-brand-wine text-white hover:bg-brand-wine/90">
        Enviar mensagem
      </Button>
    </form>
  );
}

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/minha-conta";
  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const [isPending, startTransition] = useTransition();

  return (
    <form
      className="surface-panel space-y-4 p-6"
      onSubmit={form.handleSubmit((values) => {
        startTransition(async () => {
          const result = await signIn("credentials", {
            ...values,
            redirect: false,
            redirectTo: callbackUrl,
          });

          if (result?.error) {
            toast.error("E-mail ou senha inválidos.");
            return;
          }

          toast.success("Login realizado com sucesso.");
          router.push(callbackUrl);
        });
      })}
    >
      <div className="space-y-2">
        <label className="text-sm text-brand-light-gray">E-mail</label>
        <Input {...form.register("email")} type="email" className="border-white/10 bg-white/5 text-white" />
      </div>
      <div className="space-y-2">
        <label className="text-sm text-brand-light-gray">Senha</label>
        <Input {...form.register("password")} type="password" className="border-white/10 bg-white/5 text-white" />
      </div>
      <Button type="submit" disabled={isPending} className="h-11 w-full rounded-full bg-brand-wine text-white hover:bg-brand-wine/90">
        Entrar
      </Button>
    </form>
  );
}

export function RegisterForm() {
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    },
  });
  const [isPending, startTransition] = useTransition();

  return (
    <form
      className="surface-panel space-y-4 p-6"
      onSubmit={form.handleSubmit((values) => {
        startTransition(async () => {
          if (values.password !== values.confirmPassword) {
            toast.error("As senhas não coincidem.");
            return;
          }

          const result = await registerUserAction(values);

          if (!result.success) {
            toast.error(result.message);
            return;
          }

          await signIn("credentials", {
            email: values.email,
            password: values.password,
            redirect: false,
          });

          toast.success(result.message);
          router.push("/minha-conta");
        });
      })}
    >
      <div className="grid gap-4 md:grid-cols-2">
        <Input {...form.register("name")} placeholder="Nome completo" className="border-white/10 bg-white/5 text-white" />
        <Input {...form.register("phone")} placeholder="Telefone" className="border-white/10 bg-white/5 text-white" />
      </div>
      <Input {...form.register("email")} type="email" placeholder="Seu e-mail" className="border-white/10 bg-white/5 text-white" />
      <div className="grid gap-4 md:grid-cols-2">
        <Input {...form.register("password")} type="password" placeholder="Senha" className="border-white/10 bg-white/5 text-white" />
        <Input
          {...form.register("confirmPassword")}
          type="password"
          placeholder="Confirmar senha"
          className="border-white/10 bg-white/5 text-white"
        />
      </div>
      <Button type="submit" disabled={isPending} className="h-11 w-full rounded-full bg-brand-wine text-white hover:bg-brand-wine/90">
        Criar conta
      </Button>
    </form>
  );
}

export function ReviewForm({ product }: { product: ProductDetailData }) {
  const [isPending, startTransition] = useTransition();
  const form = useForm({
    resolver: zodResolver(reviewSchema.omit({ productId: true })),
    defaultValues: {
      rating: 5,
      title: "",
      comment: "",
    },
  });

  return (
    <form
      className="surface-panel space-y-4 p-6"
      onSubmit={form.handleSubmit((values) => {
        startTransition(async () => {
          const result = await createReviewAction({
            ...values,
            productId: product.id,
          });

          if (!result.success) {
            toast.error(result.message);
            return;
          }
          toast.success(result.message);
          form.reset({ rating: 5, title: "", comment: "" });
        });
      })}
    >
      <div className="grid gap-4 md:grid-cols-[140px_1fr]">
        <Input {...form.register("rating", { valueAsNumber: true })} type="number" min={1} max={5} className="border-white/10 bg-white/5 text-white" />
        <Input {...form.register("title")} placeholder="Título da avaliação" className="border-white/10 bg-white/5 text-white" />
      </div>
      <Textarea {...form.register("comment")} placeholder="Conte como foi sua experiência com o produto e a compra." className="min-h-32 border-white/10 bg-white/5 text-white" />
      <Button type="submit" disabled={isPending} className="rounded-full bg-brand-wine text-white hover:bg-brand-wine/90">
        Enviar avaliação
      </Button>
    </form>
  );
}

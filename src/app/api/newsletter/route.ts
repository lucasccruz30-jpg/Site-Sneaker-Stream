import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { newsletterSchema } from "@/lib/validators/store";

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = newsletterSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        success: false,
        message: parsed.error.issues[0]?.message ?? "E-mail inválido.",
      },
      { status: 400 },
    );
  }

  await prisma.newsletterSubscriber.upsert({
    where: { email: parsed.data.email },
    update: {
      name: parsed.data.name || undefined,
      isActive: true,
    },
    create: {
      email: parsed.data.email,
      name: parsed.data.name || undefined,
      source: "api-newsletter",
    },
  });

  return NextResponse.json({
    success: true,
    message: "Cadastro realizado com sucesso.",
  });
}

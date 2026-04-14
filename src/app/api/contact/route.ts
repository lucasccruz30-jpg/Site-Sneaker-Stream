import { NextResponse } from "next/server";

import { contactSchema } from "@/lib/validators/store";

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = contactSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        success: false,
        message: parsed.error.issues[0]?.message ?? "Mensagem inválida.",
      },
      { status: 400 },
    );
  }

  console.log("Novo contato Sneaker Stream:", parsed.data);

  return NextResponse.json({
    success: true,
    message: "Mensagem recebida. Nossa equipe vai responder em breve.",
  });
}

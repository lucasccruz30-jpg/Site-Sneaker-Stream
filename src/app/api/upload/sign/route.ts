import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { createCloudinarySignature, getCloudinaryUploadMode } from "@/lib/cloudinary";

export async function GET() {
  const session = await auth();

  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ success: false, message: "Acesso negado." }, { status: 401 });
  }

  const mode = getCloudinaryUploadMode();

  if (mode === "disabled") {
    return NextResponse.json({
      success: true,
      mode,
      message: "Cloudinary não configurado. Use URLs manuais no admin.",
    });
  }

  if (mode === "unsigned") {
    return NextResponse.json({
      success: true,
      mode,
      cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
      uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET,
    });
  }

  const signature = await createCloudinarySignature();

  return NextResponse.json({
    success: true,
    mode,
    ...signature,
  });
}

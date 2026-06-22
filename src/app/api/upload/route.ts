import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/db";
import { supabase } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const user = await verifyToken(token);
    if (!user || !user.isAdmin) {
      return NextResponse.json({ error: "Acesso negado" }, { status: 403 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;
    const folder = (formData.get("folder") as string) || "produtos";

    if (!file) {
      return NextResponse.json({ error: "Nenhum arquivo enviado" }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: "Tipo de arquivo não suportado. Use JPG, PNG, WebP ou GIF" }, { status: 400 });
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "Arquivo muito grande. Máximo 5MB" }, { status: 400 });
    }

    // Generate unique filename
    const ext = file.name.split(".").pop() || "webp";
    const filename = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

    // Convert File to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from("product-images")
      .upload(filename, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (error) {
      console.error("Upload error:", error);
      return NextResponse.json({ error: "Erro ao fazer upload" }, { status: 500 });
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from("product-images")
      .getPublicUrl(data.path);

    return NextResponse.json({
      success: true,
      url: urlData.publicUrl,
      path: data.path,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Erro ao processar" }, { status: 500 });
  }
}

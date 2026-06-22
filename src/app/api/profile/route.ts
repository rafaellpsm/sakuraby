import { NextResponse } from "next/server";
import { verifyToken, getUserProfile, updateUserProfile } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const user = await verifyToken(token);
    if (!user) {
      return NextResponse.json({ error: "Token inválido" }, { status: 401 });
    }

    const profile = await getUserProfile(user.id);
    return NextResponse.json({ profile });
  } catch {
    return NextResponse.json({ error: "Erro ao buscar perfil" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const user = await verifyToken(token);
    if (!user) {
      return NextResponse.json({ error: "Token inválido" }, { status: 401 });
    }

    const body = await request.json();
    const success = await updateUserProfile(user.id, body);

    if (success) {
      return NextResponse.json({ success: true, message: "Perfil atualizado com sucesso" });
    }
    return NextResponse.json({ error: "Erro ao atualizar perfil" }, { status: 500 });
  } catch {
    return NextResponse.json({ error: "Erro ao processar" }, { status: 500 });
  }
}

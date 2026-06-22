import { NextResponse } from "next/server";
import { verifyToken, updateOrderStatus } from "@/lib/db";

export async function PUT(request: Request) {
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

    const { orderId, status } = await request.json();
    if (!orderId || !status) {
      return NextResponse.json({ error: "orderId e status são obrigatórios" }, { status: 400 });
    }

    const updated = await updateOrderStatus(orderId, status);
    if (!updated) {
      return NextResponse.json({ error: "Erro ao atualizar pedido" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Erro ao atualizar pedido" }, { status: 500 });
  }
}

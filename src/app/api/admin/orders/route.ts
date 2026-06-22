import { NextResponse } from "next/server";
import { verifyToken, getAllOrders } from "@/lib/db";

export async function GET(request: Request) {
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

    const orders = await getAllOrders();
    return NextResponse.json({ orders });
  } catch {
    return NextResponse.json({ error: "Erro ao buscar pedidos" }, { status: 500 });
  }
}

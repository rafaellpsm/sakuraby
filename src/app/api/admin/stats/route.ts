import { NextResponse } from "next/server";
import { verifyToken, getOrderStats, getAllUsers } from "@/lib/db";

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

    const [stats, users] = await Promise.all([getOrderStats(), getAllUsers()]);
    return NextResponse.json({ stats, users });
  } catch {
    return NextResponse.json({ error: "Erro ao buscar dados" }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { loginUser } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ success: false, error: "E-mail e senha são obrigatórios" }, { status: 400 });
    }

    const result = await loginUser(email.toLowerCase().trim(), password);

    if (!result.success) {
      return NextResponse.json(result, { status: 401 });
    }

    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ success: false, error: "Erro interno do servidor" }, { status: 500 });
  }
}

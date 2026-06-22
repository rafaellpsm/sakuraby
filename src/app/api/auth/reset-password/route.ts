import { NextResponse } from "next/server";
import { createPasswordResetToken, resetPassword } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, email, token, password } = body;

    if (action === "request") {
      if (!email) {
        return NextResponse.json({ error: "E-mail necessário" }, { status: 400 });
      }

      const result = await createPasswordResetToken(email);
      if (result.success) {
        // In production, you would send an email here with the reset link
        // For now, we return the token so it can be used
        return NextResponse.json({
          success: true,
          message: "Um link de redefinição foi enviado para seu e-mail",
          // Remove this in production - only for development
          resetUrl: `/redefinir-senha?token=${result.token}`,
        });
      }
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    if (action === "reset") {
      if (!token || !password) {
        return NextResponse.json({ error: "Token e senha necessários" }, { status: 400 });
      }

      if (password.length < 6) {
        return NextResponse.json({ error: "A senha deve ter no mínimo 6 caracteres" }, { status: 400 });
      }

      const result = await resetPassword(token, password);
      if (result.success) {
        return NextResponse.json({ success: true, message: "Senha redefinida com sucesso!" });
      }
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({ error: "Ação inválida" }, { status: 400 });
  } catch {
    return NextResponse.json({ error: "Erro ao processar" }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { calculateShipping } from "@/lib/shipping";

export async function POST(request: Request) {
  try {
    const { cep, totalValue } = await request.json();

    if (!cep || typeof totalValue !== "number") {
      return NextResponse.json({ error: "CEP e valor total são obrigatórios" }, { status: 400 });
    }

    const cleanCEP = cep.replace(/\D/g, "");
    if (cleanCEP.length !== 8) {
      return NextResponse.json({ error: "CEP inválido" }, { status: 400 });
    }

    const options = await calculateShipping(cleanCEP, totalValue);
    return NextResponse.json({ options });
  } catch {
    return NextResponse.json({ error: "Erro ao calcular frete" }, { status: 500 });
  }
}

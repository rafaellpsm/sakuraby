import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { saveOrder, type Order } from "@/lib/db";
import { MercadoPagoConfig, Preference } from "mercadopago";

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN || "",
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { customerName, customerEmail, customerPhone, customerCPF, shippingAddress, items, shippingOption, subtotal, shippingCost, total } = body;

    if (!customerName || !customerEmail || !customerPhone || !customerCPF) {
      return NextResponse.json({ error: "Dados do cliente são obrigatórios" }, { status: 400 });
    }

    if (!shippingAddress || !items?.length) {
      return NextResponse.json({ error: "Endereço e itens são obrigatórios" }, { status: 400 });
    }

    const accessToken = process.env.MERCADO_PAGO_ACCESS_TOKEN;
    if (!accessToken || accessToken === "YOUR_ACCESS_TOKEN") {
      return NextResponse.json({
        error: "Mercado Pago não configurado. Configure MERCADO_PAGO_ACCESS_TOKEN no .env.local",
      }, { status: 500 });
    }

    const order: Order = {
      id: uuidv4(),
      customerName,
      customerEmail,
      customerPhone,
      customerCPF,
      shippingAddress,
      items: items.map((item: { id: string; name: string; price: number; quantity: number; image: string }) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
      })),
      shippingOption,
      subtotal,
      shippingCost,
      total,
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    saveOrder(order);

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    const preference = new Preference(client);
    const result = await preference.create({
      body: {
        items: items.map((item: { id: string; name: string; price: number; quantity: number; image: string }) => ({
          id: item.id,
          title: item.name,
          quantity: item.quantity,
          unit_price: item.price,
          currency_id: "BRL",
        })),
        payer: {
          name: customerName,
          email: customerEmail,
          phone: {
            number: customerPhone.replace(/\D/g, ""),
          },
          identification: {
            type: "CPF",
            number: customerCPF.replace(/\D/g, ""),
          },
        },
        shipments: {
          cost: shippingCost,
          mode: "not_specified",
        },
        external_reference: order.id,
        back_urls: {
          success: `${baseUrl}/pedido-confirmado?id=${order.id}`,
          failure: `${baseUrl}/carrinho`,
          pending: `${baseUrl}/pedido-confirmado?id=${order.id}`,
        },
        auto_return: "approved",
        notification_url: `${baseUrl}/api/mercadopago/webhook`,
      },
    });

    return NextResponse.json({
      success: true,
      orderId: order.id,
      checkoutUrl: result.init_point,
    });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json({ error: "Erro ao processar pedido" }, { status: 500 });
  }
}

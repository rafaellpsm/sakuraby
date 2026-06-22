import { NextResponse } from "next/server";
import { verifyToken, getOrderById, saveOrder, type Order } from "@/lib/db";
import { sendOrderConfirmationEmail } from "@/lib/email";

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

    const body = await request.json();
    const { orderId, trackingCode } = body;

    if (!orderId || !trackingCode) {
      return NextResponse.json({ error: "orderId e trackingCode necessários" }, { status: 400 });
    }

    const order = await getOrderById(orderId);
    if (!order) {
      return NextResponse.json({ error: "Pedido não encontrado" }, { status: 404 });
    }

    // Update order status to shipped
    const updatedOrder: Order = {
      ...order,
      status: "shipped",
    };
    await saveOrder(updatedOrder);

    // Send shipping notification email
    try {
      await sendOrderConfirmationEmail({
        orderId: updatedOrder.id,
        customerName: updatedOrder.customerName,
        customerEmail: updatedOrder.customerEmail,
        items: updatedOrder.items,
        subtotal: updatedOrder.subtotal,
        shippingCost: updatedOrder.shippingCost,
        total: updatedOrder.total,
        shippingAddress: updatedOrder.shippingAddress,
        status: "shipped",
        trackingCode,
      });
    } catch (emailError) {
      console.error("Error sending shipping email:", emailError);
    }

    return NextResponse.json({ success: true, message: "Pedido marcado como enviado e email enviado" });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Erro ao processar" }, { status: 500 });
  }
}

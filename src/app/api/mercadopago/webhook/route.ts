import { NextResponse } from "next/server";
import { getOrderById, saveOrder, type Order } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (body.type === "payment") {
      const paymentId = body.data?.id;

      if (paymentId && process.env.MERCADO_PAGO_ACCESS_TOKEN) {
        const response = await fetch(
          `https://api.mercadopago.com/v1/payments/${paymentId}`,
          {
            headers: {
              Authorization: `Bearer ${process.env.MERCADO_PAGO_ACCESS_TOKEN}`,
            },
          }
        );
        const payment = await response.json();

        if (payment.external_reference) {
          const existingOrder: Order | undefined = await getOrderById(payment.external_reference);
          if (existingOrder) {
            let newStatus: Order["status"] = "pending";

            if (payment.status === "approved") newStatus = "approved";
            else if (payment.status === "cancelled" || payment.status === "rejected") newStatus = "cancelled";

            const updatedOrder: Order = {
              id: existingOrder.id,
              userId: existingOrder.userId,
              customerName: existingOrder.customerName,
              customerEmail: existingOrder.customerEmail,
              customerPhone: existingOrder.customerPhone,
              customerCPF: existingOrder.customerCPF,
              shippingAddress: existingOrder.shippingAddress,
              items: existingOrder.items,
              shippingOption: existingOrder.shippingOption,
              subtotal: existingOrder.subtotal,
              shippingCost: existingOrder.shippingCost,
              total: existingOrder.total,
              status: newStatus,
              paymentId: paymentId.toString(),
              createdAt: existingOrder.createdAt,
            };

            await saveOrder(updatedOrder);
          }
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ received: true });
  }
}

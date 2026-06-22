import { NextResponse } from "next/server";
import { getOrderById, saveOrder } from "@/lib/db";

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
          const order = getOrderById(payment.external_reference);
          if (order) {
            let status: "approved" | "pending" | "shipped" | "delivered" | "cancelled" = "pending";

            if (payment.status === "approved") status = "approved";
            else if (payment.status === "cancelled" || payment.status === "rejected") status = "cancelled";

            saveOrder({
              ...order,
              status,
              paymentId: paymentId.toString(),
            });
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

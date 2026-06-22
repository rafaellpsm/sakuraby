import { Resend } from "resend";

const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;

interface OrderEmailData {
  orderId: string;
  customerName: string;
  customerEmail: string;
  items: Array<{ name: string; price: number; quantity: number }>;
  subtotal: number;
  shippingCost: number;
  total: number;
  shippingAddress: {
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    cep: string;
  };
  status: "pending" | "approved" | "shipped" | "delivered" | "cancelled";
  trackingCode?: string;
}

function getStatusText(status: string): string {
  const statuses: Record<string, string> = {
    pending: "Pagamento Pendente",
    approved: "Pagamento Aprovado",
    shipped: "Enviado",
    delivered: "Entregue",
    cancelled: "Cancelado",
  };
  return statuses[status] || status;
}

function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    pending: "#f59e0b",
    approved: "#10b981",
    shipped: "#3b82f6",
    delivered: "#8b5cf6",
    cancelled: "#ef4444",
  };
  return colors[status] || "#6b7280";
}

function buildItemsRows(items: OrderEmailData["items"]): string {
  return items
    .map(
      (item) => `
      <tr>
        <td style="padding: 12px 0; border-bottom: 1px solid #f3f4f6;">
          <span style="font-size: 14px; color: #374151;">${item.name}</span>
        </td>
        <td style="padding: 12px 0; border-bottom: 1px solid #f3f4f6; text-align: center;">
          <span style="font-size: 14px; color: #6b7280;">${item.quantity}x</span>
        </td>
        <td style="padding: 12px 0; border-bottom: 1px solid #f3f4f6; text-align: right;">
          <span style="font-size: 14px; color: #374151;">R$ ${(item.price * item.quantity).toFixed(2).replace(".", ",")}</span>
        </td>
      </tr>`
    )
    .join("");
}

export async function sendOrderConfirmationEmail(data: OrderEmailData) {
  const statusColor = getStatusColor(data.status);
  const statusText = getStatusText(data.status);

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; background-color: #f9fafb; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
      <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        <div style="text-align: center; margin-bottom: 32px;">
          <h1 style="font-size: 24px; color: #111827; margin: 0;">🌸 SakuraBy</h1>
          <p style="font-size: 14px; color: #6b7280; margin-top: 8px;">Skincare Coreano de Qualidade</p>
        </div>

        <div style="background: white; border-radius: 16px; padding: 32px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
          <div style="text-align: center; margin-bottom: 24px;">
            <div style="display: inline-block; padding: 8px 16px; background: ${statusColor}15; color: ${statusColor}; border-radius: 20px; font-size: 13px; font-weight: 600;">
              ${statusText}
            </div>
          </div>

          <h2 style="font-size: 20px; color: #111827; margin: 0 0 8px; text-align: center;">
            ${data.status === "approved" ? "Pedido Confirmado!" : data.status === "shipped" ? "Pedido Enviado!" : "Pedido Recebido"}
          </h2>
          <p style="font-size: 14px; color: #6b7280; text-align: center; margin: 0 0 24px;">
            Olá ${data.customerName}, ${data.status === "approved" ? "seu pagamento foi aprovado e estamos preparando seu pedido." : data.status === "shipped" ? "seu pedido saiu para entrega!" : "recebemos seu pedido e estamos aguardando o pagamento."}
          </p>

          <div style="background: #f9fafb; border-radius: 12px; padding: 16px; margin-bottom: 24px;">
            <p style="font-size: 12px; color: #9ca3af; margin: 0 0 4px; text-transform: uppercase; letter-spacing: 0.5px;">Número do Pedido</p>
            <p style="font-size: 14px; color: #374151; margin: 0; font-weight: 600;">#${data.orderId.slice(0, 8).toUpperCase()}</p>
          </div>

          ${data.trackingCode ? `
          <div style="background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 12px; padding: 16px; margin-bottom: 24px;">
            <p style="font-size: 12px; color: #3b82f6; margin: 0 0 4px; text-transform: uppercase; letter-spacing: 0.5px;">📦 Código de Rastreamento</p>
            <p style="font-size: 16px; color: #1e40af; margin: 0; font-weight: 700; letter-spacing: 1px;">${data.trackingCode}</p>
          </div>
          ` : ""}

          <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
            <thead>
              <tr>
                <th style="text-align: left; font-size: 12px; color: #9ca3af; padding: 8px 0; border-bottom: 2px solid #e5e7eb;">Produto</th>
                <th style="text-align: center; font-size: 12px; color: #9ca3af; padding: 8px 0; border-bottom: 2px solid #e5e7eb;">Qtd</th>
                <th style="text-align: right; font-size: 12px; color: #9ca3af; padding: 8px 0; border-bottom: 2px solid #e5e7eb;">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              ${buildItemsRows(data.items)}
            </tbody>
          </table>

          <div style="border-top: 2px solid #e5e7eb; padding-top: 16px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
              <span style="font-size: 14px; color: #6b7280;">Subtotal</span>
              <span style="font-size: 14px; color: #374151;">R$ ${data.subtotal.toFixed(2).replace(".", ",")}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
              <span style="font-size: 14px; color: #6b7280;">Frete</span>
              <span style="font-size: 14px; color: #374151;">${data.shippingCost === 0 ? "Grátis" : `R$ ${data.shippingCost.toFixed(2).replace(".", ",")}`}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding-top: 12px; border-top: 2px solid #e5e7eb;">
              <span style="font-size: 16px; font-weight: 700; color: #111827;">Total</span>
              <span style="font-size: 16px; font-weight: 700; color: #ec4899;">R$ ${data.total.toFixed(2).replace(".", ",")}</span>
            </div>
          </div>

          <div style="background: #f9fafb; border-radius: 12px; padding: 16px; margin-top: 24px;">
            <p style="font-size: 12px; color: #9ca3af; margin: 0 0 8px; text-transform: uppercase; letter-spacing: 0.5px;">Endereço de Entrega</p>
            <p style="font-size: 14px; color: #374151; margin: 0; line-height: 1.5;">
              ${data.shippingAddress.street}, ${data.shippingAddress.number}${data.shippingAddress.complement ? ` - ${data.shippingAddress.complement}` : ""}<br>
              ${data.shippingAddress.neighborhood} - ${data.shippingAddress.city}/${data.shippingAddress.state}<br>
              CEP: ${data.shippingAddress.cep}
            </p>
          </div>
        </div>

        <div style="text-align: center; margin-top: 32px;">
          <p style="font-size: 13px; color: #9ca3af; margin: 0;">
            Dúvidas? Entre em contato pelo WhatsApp
          </p>
          <a href="https://wa.me/5512992162952" style="display: inline-block; margin-top: 8px; padding: 10px 20px; background: #25d366; color: white; text-decoration: none; border-radius: 8px; font-size: 13px; font-weight: 600;">
            💬 Falar no WhatsApp
          </a>
        </div>

        <p style="font-size: 12px; color: #d1d5db; text-align: center; margin-top: 32px;">
          © 2026 SakuraBy. Todos os direitos reservados.
        </p>
      </div>
    </body>
    </html>
  `;

  try {
    if (!resend) {
      console.log("Email not sent: RESEND_API_KEY not configured");
      return { success: true, skipped: true };
    }

    await resend.emails.send({
      from: "SakuraBy <onboarding@resend.dev>",
      to: data.customerEmail,
      subject: `${statusText} - Pedido #${data.orderId.slice(0, 8).toUpperCase()}`,
      html,
    });
    return { success: true };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, error };
  }
}

export async function sendTrackingEmail(data: OrderEmailData & { trackingCode: string }) {
  return sendOrderConfirmationEmail({ ...data, status: "shipped" });
}

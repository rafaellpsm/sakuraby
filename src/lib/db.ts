import { SignJWT, jwtVerify } from "jose";
import bcryptjs from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import { supabase } from "./supabase";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "sakuraby-super-secret-key-change-in-production-2024"
);

export interface Order {
  id: string;
  userId?: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerCPF: string;
  shippingAddress: {
    cep: string;
    street: string;
    number: string;
    complement: string;
    neighborhood: string;
    city: string;
    state: string;
  };
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
  }>;
  shippingOption: {
    name: string;
    price: number;
    deliveryTime: string;
  };
  subtotal: number;
  shippingCost: number;
  total: number;
  status: "pending" | "approved" | "shipped" | "delivered" | "cancelled";
  paymentId?: string;
  createdAt: string;
}

export async function hashPassword(password: string): Promise<string> {
  return bcryptjs.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcryptjs.compare(password, hash);
}

export async function createToken(user: { id: string; name: string; email: string }): Promise<string> {
  return new SignJWT({ id: user.id, name: user.name, email: user.email })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(JWT_SECRET);
}

export async function verifyToken(token: string): Promise<{ id: string; name: string; email: string } | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return { id: payload.id as string, name: payload.name as string, email: payload.email as string };
  } catch {
    return null;
  }
}

export async function registerUser(name: string, email: string, password: string) {
  const { data: existing } = await supabase
    .from("users")
    .select("id")
    .eq("email", email)
    .single();

  if (existing) {
    return { success: false, error: "E-mail já cadastrado" };
  }

  const hashedPassword = await hashPassword(password);
  const user = { id: uuidv4(), name, email, password: hashedPassword };

  const { error } = await supabase.from("users").insert(user);
  if (error) {
    console.error("Supabase insert error:", error.message, error.details, error.hint);
    return { success: false, error: `Erro ao criar conta: ${error.message}` };
  }

  const token = await createToken(user);
  return { success: true, token, user: { id: user.id, name: user.name, email: user.email } };
}

export async function loginUser(email: string, password: string) {
  const { data: user } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .single();

  if (!user) {
    return { success: false, error: "E-mail ou senha inválidos" };
  }

  const valid = await verifyPassword(password, user.password);
  if (!valid) {
    return { success: false, error: "E-mail ou senha inválidos" };
  }

  const token = await createToken(user);
  return { success: true, token, user: { id: user.id, name: user.name, email: user.email } };
}

export async function saveOrder(order: Order) {
  const { error } = await supabase.from("orders").insert({
    id: order.id,
    user_id: order.userId || null,
    customer_name: order.customerName,
    customer_email: order.customerEmail,
    customer_phone: order.customerPhone,
    customer_cpf: order.customerCPF,
    shipping_address: order.shippingAddress,
    items: order.items,
    shipping_option: order.shippingOption,
    subtotal: order.subtotal,
    shipping_cost: order.shippingCost,
    total: order.total,
    status: order.status,
    payment_id: order.paymentId || null,
    created_at: order.createdAt,
  });

  if (error) {
    console.error("Error saving order:", error);
  }
}

export async function getOrdersByUser(userId: string): Promise<Order[]> {
  const { data } = await supabase
    .from("orders")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (!data) return [];

  return data.map((row) => ({
    id: row.id,
    userId: row.user_id,
    customerName: row.customer_name,
    customerEmail: row.customer_email,
    customerPhone: row.customer_phone,
    customerCPF: row.customer_cpf,
    shippingAddress: row.shipping_address,
    items: row.items,
    shippingOption: row.shipping_option,
    subtotal: row.subtotal,
    shippingCost: row.shipping_cost,
    total: row.total,
    status: row.status,
    paymentId: row.payment_id,
    createdAt: row.created_at,
  }));
}

export async function getOrderById(orderId: string): Promise<Order | undefined> {
  const { data } = await supabase
    .from("orders")
    .select("*")
    .eq("id", orderId)
    .single();

  if (!data) return undefined;

  return {
    id: data.id,
    userId: data.user_id,
    customerName: data.customer_name,
    customerEmail: data.customer_email,
    customerPhone: data.customer_phone,
    customerCPF: data.customer_cpf,
    shippingAddress: data.shipping_address,
    items: data.items,
    shippingOption: data.shipping_option,
    subtotal: data.subtotal,
    shippingCost: data.shipping_cost,
    total: data.total,
    status: data.status,
    paymentId: data.payment_id,
    createdAt: data.created_at,
  };
}

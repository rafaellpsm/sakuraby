import { SignJWT, jwtVerify } from "jose";
import bcryptjs from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";
import path from "path";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "sakuraby-super-secret-key-change-in-production-2024"
);

const USERS_FILE = path.join(process.cwd(), "data", "users.json");
const ORDERS_FILE = path.join(process.cwd(), "data", "orders.json");

function ensureDataDir() {
  const dataDir = path.join(process.cwd(), "data");
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
}

function readUsers(): Array<{ id: string; name: string; email: string; password: string }> {
  ensureDataDir();
  if (!fs.existsSync(USERS_FILE)) return [];
  return JSON.parse(fs.readFileSync(USERS_FILE, "utf-8"));
}

function writeUsers(users: Array<{ id: string; name: string; email: string; password: string }>) {
  ensureDataDir();
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

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

function readOrders(): Order[] {
  ensureDataDir();
  if (!fs.existsSync(ORDERS_FILE)) return [];
  return JSON.parse(fs.readFileSync(ORDERS_FILE, "utf-8"));
}

function writeOrders(orders: Order[]) {
  ensureDataDir();
  fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2));
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
  const users = readUsers();
  if (users.find(u => u.email === email)) {
    return { success: false, error: "E-mail já cadastrado" };
  }

  const hashedPassword = await hashPassword(password);
  const user = { id: uuidv4(), name, email, password: hashedPassword };
  users.push(user);
  writeUsers(users);

  const token = await createToken(user);
  return { success: true, token, user: { id: user.id, name: user.name, email: user.email } };
}

export async function loginUser(email: string, password: string) {
  const users = readUsers();
  const user = users.find(u => u.email === email);
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

export function saveOrder(order: Order) {
  const orders = readOrders();
  orders.push(order);
  writeOrders(orders);
}

export function getOrdersByUser(userId: string): Order[] {
  const orders = readOrders();
  return orders.filter(o => o.userId === userId).sort((a, b) =>
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function getOrderById(orderId: string): Order | undefined {
  const orders = readOrders();
  return orders.find(o => o.id === orderId);
}

"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/lib/auth";

interface Order {
  id: string;
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
  items: Array<{ id: string; name: string; price: number; quantity: number; image: string }>;
  shippingOption: { name: string; price: number; deliveryTime: string };
  subtotal: number;
  shippingCost: number;
  total: number;
  status: "pending" | "approved" | "shipped" | "delivered" | "cancelled";
  paymentId?: string;
  createdAt: string;
}

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  pending: { label: "Pendente", color: "text-amber-700", bg: "bg-amber-100" },
  approved: { label: "Aprovado", color: "text-blue-700", bg: "bg-blue-100" },
  shipped: { label: "Enviado", color: "text-purple-700", bg: "bg-purple-100" },
  delivered: { label: "Entregue", color: "text-green-700", bg: "bg-green-100" },
  cancelled: { label: "Cancelado", color: "text-red-700", bg: "bg-red-100" },
};

export default function AdminPedidosPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    const token = localStorage.getItem("sakuraby-token");
    const res = await fetch("/api/admin/orders", {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      const data = await res.json();
      setOrders(data.orders || []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (authLoading) return;
    if (!user?.isAdmin) {
      router.push("/");
      return;
    }
    fetchOrders();
  }, [user, authLoading, router, fetchOrders]);

  const updateStatus = async (orderId: string, newStatus: string) => {
    setUpdatingId(orderId);
    const token = localStorage.getItem("sakuraby-token");
    await fetch("/api/admin/orders/update", {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ orderId, status: newStatus }),
    });
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus as Order["status"] } : o));
    setUpdatingId(null);
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-pink-300 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user?.isAdmin) return null;

  const filtered = filter === "all" ? orders : orders.filter(o => o.status === filter);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/admin" className="text-gray-400 hover:text-gray-600">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <span className="text-lg font-bold text-gray-900">Pedidos</span>
            <span className="text-sm text-gray-400">({orders.length} total)</span>
          </div>
          <Link href="/" className="text-sm text-gray-600 hover:text-pink-600 font-medium">Ver Loja</Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex gap-2 overflow-x-auto pb-4 mb-6">
          {["all", "pending", "approved", "shipped", "delivered", "cancelled"].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                filter === s
                  ? "bg-gray-900 text-white"
                  : "bg-white border border-gray-200 text-gray-600 hover:border-gray-300"
              }`}
            >
              {s === "all" ? `Todos (${orders.length})` : `${statusConfig[s]?.label} (${orders.filter(o => o.status === s).length})`}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">📋</div>
            <p className="text-gray-500">Nenhum pedido encontrado.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((order) => {
              const status = statusConfig[order.status] || statusConfig.pending;
              return (
                <div key={order.id} className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${status.bg} ${status.color}`}>
                          {status.label}
                        </span>
                        <span className="text-xs text-gray-400">
                          #{order.id.slice(0, 8).toUpperCase()}
                        </span>
                        <span className="text-xs text-gray-400">
                          {new Date(order.createdAt).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-gray-400 text-xs mb-1">CLIENTE</p>
                          <p className="font-medium text-gray-800">{order.customerName}</p>
                          <p className="text-gray-500">{order.customerEmail}</p>
                          <p className="text-gray-500">{order.customerPhone}</p>
                          <p className="text-gray-400 text-xs">CPF: {order.customerCPF}</p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-xs mb-1">ENTREGA</p>
                          <p className="text-gray-600">{order.shippingAddress.street}, {order.shippingAddress.number}</p>
                          <p className="text-gray-600">{order.shippingAddress.neighborhood}</p>
                          <p className="text-gray-600">{order.shippingAddress.city} - {order.shippingAddress.state}</p>
                          <p className="text-gray-400 text-xs">CEP: {order.shippingAddress.cep}</p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-xs mb-1">ITENS</p>
                          {order.items.map((item) => (
                            <div key={item.id} className="flex items-center gap-2 mb-1">
                              <div className="w-6 h-6 bg-pink-50 rounded overflow-hidden shrink-0">
                                <Image src={item.image} alt={item.name} width={24} height={24} className="object-contain w-full h-full" />
                              </div>
                              <span className="text-gray-600 text-xs truncate">{item.quantity}x {item.name}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-3 lg:min-w-[200px]">
                      <div className="text-right">
                        <p className="text-2xl font-bold text-gray-900">R$ {order.total.toFixed(2).replace(".", ",")}</p>
                        <p className="text-xs text-gray-400">{order.shippingOption.name}</p>
                      </div>

                      <div className="flex flex-wrap gap-2 justify-end">
                        {(["pending", "approved", "shipped", "delivered", "cancelled"] as const).map((s) => (
                          <button
                            key={s}
                            onClick={() => updateStatus(order.id, s)}
                            disabled={order.status === s || updatingId === order.id}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                              order.status === s
                                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                : `${statusConfig[s].bg} ${statusConfig[s].color} hover:opacity-80`
                            }`}
                          >
                            {statusConfig[s].label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

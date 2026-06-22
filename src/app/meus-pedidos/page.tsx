"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth";

interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
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
  createdAt: string;
}

const statusLabels: Record<string, { label: string; color: string; icon: string }> = {
  pending: { label: "Aguardando pagamento", color: "bg-amber-100 text-amber-700", icon: "⏳" },
  approved: { label: "Pagamento aprovado", color: "bg-blue-100 text-blue-700", icon: "✅" },
  shipped: { label: "Enviado", color: "bg-purple-100 text-purple-700", icon: "🚚" },
  delivered: { label: "Entregue", color: "bg-green-100 text-green-700", icon: "📦" },
  cancelled: { label: "Cancelado", color: "bg-red-100 text-red-700", icon: "❌" },
};

export default function MeusPedidosPage() {
  const { user, isLoading: authLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setLoading(false);
      return;
    }

    const token = localStorage.getItem("sakuraby-token");
    fetch("/api/orders", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => {
        setOrders(data.orders || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [user, authLoading]);

  if (authLoading || loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-pink-300 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-gradient-to-b from-pink-50/30 to-white">
        <div className="text-center px-4">
          <div className="text-6xl mb-4">🔐</div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Faça login para ver seus pedidos</h2>
          <p className="text-gray-500 mb-6">Entre na sua conta para acompanhar seus pedidos.</p>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-semibold rounded-full hover:from-pink-600 hover:to-rose-600 transition-all"
          >
            Entrar
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-pink-50/30 to-white min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 md:py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Meus <span className="bg-gradient-to-r from-pink-500 to-fuchsia-500 bg-clip-text text-transparent">Pedidos</span>
            </h1>
            <p className="text-gray-500 text-sm mt-1">Olá, {user.name}!</p>
          </div>
          <Link
            href="/produtos"
            className="px-4 py-2 border border-pink-200 text-pink-600 text-sm font-medium rounded-xl hover:bg-pink-50 transition-all"
          >
            + Comprar
          </Link>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">📋</div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Nenhum pedido ainda</h3>
            <p className="text-gray-500 mb-6">Quando você fizer uma compra, os pedidos aparecerão aqui.</p>
            <Link
              href="/produtos"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-semibold rounded-full hover:from-pink-600 hover:to-rose-600 transition-all"
            >
              Começar a comprar
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map(order => {
              const status = statusLabels[order.status] || statusLabels.pending;
              return (
                <div key={order.id} className="bg-white rounded-2xl border border-pink-100 p-6 hover:shadow-md transition-shadow">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                    <div>
                      <p className="text-xs text-gray-400">
                        Pedido #{order.id.slice(0, 8).toUpperCase()}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {new Date(order.createdAt).toLocaleDateString("pt-BR", {
                          day: "2-digit",
                          month: "long",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                    <span className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium ${status.color}`}>
                      <span>{status.icon}</span>
                      {status.label}
                    </span>
                  </div>

                  <div className="space-y-2 mb-4">
                    {order.items.map(item => (
                      <div key={item.id} className="flex items-center gap-3 text-sm">
                        <span className="text-gray-400">{item.quantity}x</span>
                        <span className="text-gray-700 truncate flex-1">{item.name}</span>
                        <span className="text-gray-600 font-medium">
                          R$ {(item.price * item.quantity).toFixed(2).replace(".", ",")}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-pink-100 pt-3 flex justify-between items-center">
                    <span className="text-xs text-gray-500">
                      {order.shippingOption?.name} · {order.shippingOption?.deliveryTime}
                    </span>
                    <span className="font-bold text-pink-600">
                      Total: R$ {order.total.toFixed(2).replace(".", ",")}
                    </span>
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

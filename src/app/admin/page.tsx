"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth";

interface Stats {
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  approvedOrders: number;
  totalUsers: number;
  recentRevenue: number;
}

export default function AdminDashboard() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    const token = localStorage.getItem("sakuraby-token");
    const res = await fetch("/api/admin/stats", {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      const data = await res.json();
      setStats(data.stats);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (authLoading) return;
    if (!user?.isAdmin) {
      router.push("/");
      return;
    }
    fetchStats();
  }, [user, authLoading, router, fetchStats]);

  if (authLoading || loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-pink-300 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user?.isAdmin) return null;

  const cards = [
    { label: "Total de Pedidos", value: stats?.totalOrders || 0, icon: "📦", color: "from-blue-500 to-cyan-500" },
    { label: "Receita Total", value: `R$ ${(stats?.totalRevenue || 0).toFixed(2).replace(".", ",")}`, icon: "💰", color: "from-green-500 to-emerald-500" },
    { label: "Pedidos Pendentes", value: stats?.pendingOrders || 0, icon: "⏳", color: "from-amber-500 to-orange-500" },
    { label: "Pedidos Aprovados", value: stats?.approvedOrders || 0, icon: "✅", color: "from-pink-500 to-rose-500" },
    { label: "Receita (30 dias)", value: `R$ ${(stats?.recentRevenue || 0).toFixed(2).replace(".", ",")}`, icon: "📈", color: "from-purple-500 to-fuchsia-500" },
    { label: "Usuários Cadastrados", value: stats?.totalUsers || 0, icon: "👥", color: "from-indigo-500 to-blue-500" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🌸</span>
            <span className="text-lg font-bold text-gray-900">Admin SakuraBy</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/admin/pedidos" className="text-sm text-gray-600 hover:text-gray-900 font-medium">
              Pedidos
            </Link>
            <Link href="/admin/produtos" className="text-sm text-gray-600 hover:text-gray-900 font-medium">
              Produtos
            </Link>
            <Link href="/" className="text-sm text-gray-600 hover:text-gray-900 font-medium">
              Ver Loja
            </Link>
            <span className="text-sm text-gray-400">{user.name}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {cards.map((card) => (
            <div key={card.label} className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <span className="text-2xl">{card.icon}</span>
                <span className={`px-2.5 py-1 rounded-lg text-xs font-medium text-white bg-gradient-to-r ${card.color}`}>
                  {card.label}
                </span>
              </div>
              <p className="text-3xl font-bold text-gray-900">{card.value}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/admin/pedidos"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white text-sm font-medium rounded-full hover:bg-gray-800 transition-all"
          >
            Gerenciar Pedidos
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
          <Link
            href="/admin/produtos"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 text-gray-900 text-sm font-medium rounded-full hover:bg-gray-50 transition-all"
          >
            Gerenciar Produtos
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}

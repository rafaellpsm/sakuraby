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
        <div className="w-8 h-8 border-3 border-gray-300 dark:border-gray-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user?.isAdmin) return null;

  const cards = [
    { label: "Total de Pedidos", value: stats?.totalOrders || 0, icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2", color: "bg-blue-500", bgColor: "bg-blue-50 dark:bg-blue-900/30", textColor: "text-blue-600 dark:text-blue-400" },
    { label: "Receita Total", value: `R$ ${(stats?.totalRevenue || 0).toFixed(2).replace(".", ",")}`, icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z", color: "bg-emerald-500", bgColor: "bg-emerald-50 dark:bg-emerald-900/30", textColor: "text-emerald-600 dark:text-emerald-400" },
    { label: "Pendentes", value: stats?.pendingOrders || 0, icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z", color: "bg-amber-500", bgColor: "bg-amber-50 dark:bg-amber-900/30", textColor: "text-amber-600 dark:text-amber-400" },
    { label: "Aprovados", value: stats?.approvedOrders || 0, icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z", color: "bg-green-500", bgColor: "bg-green-50 dark:bg-green-900/30", textColor: "text-green-600 dark:text-green-400" },
    { label: "Receita (30 dias)", value: `R$ ${(stats?.recentRevenue || 0).toFixed(2).replace(".", ",")}`, icon: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6", color: "bg-indigo-500", bgColor: "bg-indigo-50 dark:bg-indigo-900/30", textColor: "text-indigo-600 dark:text-indigo-400" },
    { label: "Usuários", value: stats?.totalUsers || 0, icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z", color: "bg-purple-500", bgColor: "bg-purple-50 dark:bg-purple-900/30", textColor: "text-purple-600 dark:text-purple-400" },
  ];

  const maxRevenue = Math.max(stats?.totalRevenue || 1, stats?.recentRevenue || 1);
  const barData = [
    { label: "Total", value: stats?.totalRevenue || 0, color: "bg-emerald-500" },
    { label: "30 dias", value: stats?.recentRevenue || 0, color: "bg-blue-500" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Visão geral do seu negócio</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((card) => (
          <div key={card.label} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-10 h-10 rounded-lg ${card.bgColor} flex items-center justify-center`}>
                <svg className={`w-5 h-5 ${card.textColor}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d={card.icon} />
                </svg>
              </div>
              <span className={`w-2 h-2 rounded-full ${card.color}`} />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{card.value}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{card.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
        <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">Receita</h2>
        <div className="space-y-3">
          {barData.map((bar) => (
            <div key={bar.label} className="flex items-center gap-3">
              <span className="text-xs text-gray-500 dark:text-gray-400 w-16 shrink-0">{bar.label}</span>
              <div className="flex-1 h-8 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
                <div
                  className={`h-full ${bar.color} rounded-lg transition-all duration-700 flex items-center px-3`}
                  style={{ width: `${maxRevenue > 0 ? (bar.value / maxRevenue) * 100 : 0}%`, minWidth: bar.value > 0 ? "3rem" : "0" }}
                >
                  {bar.value > 0 && (
                    <span className="text-[10px] font-medium text-white whitespace-nowrap">
                      R$ {bar.value.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
                    </span>
                  )}
                </div>
              </div>
              <span className="text-xs font-medium text-gray-700 dark:text-gray-300 w-24 text-right shrink-0">
                R$ {bar.value.toFixed(2).replace(".", ",")}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <Link
          href="/admin/pedidos"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm font-medium rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-all"
        >
          Gerenciar Pedidos
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </Link>
        <Link
          href="/admin/produtos"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 text-sm font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
        >
          Gerenciar Produtos
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </Link>
      </div>
    </div>
  );
}

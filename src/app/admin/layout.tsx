"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "@/lib/theme";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
  { href: "/admin/pedidos", label: "Pedidos", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" },
  { href: "/admin/produtos", label: "Produtos", icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" },
  { href: "/", label: "Ver Loja", icon: "M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className="min-h-screen flex" style={{ background: isDark ? "#0a0a0a" : "#f9fafb" }}>
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          style={{ background: "rgba(0,0,0,0.5)" }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className="fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 lg:translate-x-0 lg:static lg:z-auto"
        style={{
          background: isDark ? "#111111" : "#ffffff",
          borderRight: `1px solid ${isDark ? "#262626" : "#e5e7eb"}`,
          transform: sidebarOpen ? "translateX(0)" : undefined,
        }}
      >
        <div
          className="flex items-center gap-3 px-6 h-16"
          style={{ borderBottom: `1px solid ${isDark ? "#262626" : "#e5e7eb"}` }}
        >
          <span className="text-xl">🌸</span>
          <span className="text-sm font-bold" style={{ color: isDark ? "#ffffff" : "#111827" }}>Admin Panel</span>
        </div>

        <nav className="p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all"
                style={{
                  background: isActive
                    ? isDark ? "rgba(59, 130, 246, 0.15)" : "#eff6ff"
                    : "transparent",
                  color: isActive
                    ? isDark ? "#60a5fa" : "#1d4ed8"
                    : isDark ? "#9ca3af" : "#4b5563",
                }}
              >
                <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                </svg>
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header
          className="sticky top-0 z-30 backdrop-blur-xl h-16 flex items-center px-4 sm:px-6 gap-4"
          style={{
            background: isDark ? "rgba(17, 17, 17, 0.9)" : "rgba(255, 255, 255, 0.9)",
            borderBottom: `1px solid ${isDark ? "#262626" : "#e5e7eb"}`,
          }}
        >
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 -ml-1 rounded-lg transition-colors"
            style={{ color: isDark ? "#9ca3af" : "#6b7280" }}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="flex-1" />
          <Link
            href="/"
            className="text-sm transition-colors"
            style={{ color: isDark ? "#9ca3af" : "#6b7280" }}
          >
            SakuraBy
          </Link>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

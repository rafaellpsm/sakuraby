"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useCart } from "@/lib/cart";
import { useAuth } from "@/lib/auth";
import { useTheme } from "@/lib/theme";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { itemCount } = useCart();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isDark = theme === "dark";

  return (
    <header
      className="sticky top-0 z-50 transition-all duration-300"
      style={{
        backgroundColor: scrolled
          ? isDark ? "rgba(17, 17, 17, 0.95)" : "rgba(255, 255, 255, 0.95)"
          : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled ? `1px solid ${isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"}` : "none",
      }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-2xl transition-all duration-500 group-hover:scale-125 group-hover:rotate-12 drop-shadow-sm">🌸</span>
            <span className="text-lg font-bold tracking-tight">
              <span style={{ background: "linear-gradient(to right, #ec4899, #fb7185, #d946ef)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Sakura</span>
              <span style={{ color: isDark ? "#f3f4f6" : "#1f2937" }}>By</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {[
              { href: "/", label: "Início" },
              { href: "/produtos", label: "Produtos" },
              { href: "/produtos?category=Featured", label: "Destaques" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="px-4 py-2 text-sm rounded-full transition-all duration-200"
                style={{
                  color: isDark ? "#9ca3af" : "#6b7280",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = isDark ? "#ffffff" : "#111827";
                  e.currentTarget.style.backgroundColor = isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.03)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = isDark ? "#9ca3af" : "#6b7280";
                  e.currentTarget.style.backgroundColor = "transparent";
                }}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-1">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full transition-all duration-200"
              style={{ color: isDark ? "#fbbf24" : "#9ca3af" }}
              title={isDark ? "Modo claro" : "Modo escuro"}
            >
              {isDark ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>

            {user ? (
              <div className="hidden md:flex items-center gap-1">
                <Link
                  href="/perfil"
                  className="p-2 rounded-full transition-all duration-200"
                  style={{ color: isDark ? "#9ca3af" : "#9ca3af" }}
                  title="Meu Perfil"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </Link>
                <Link
                  href="/meus-pedidos"
                  className="p-2 rounded-full transition-all duration-200"
                  style={{ color: isDark ? "#9ca3af" : "#9ca3af" }}
                  title="Meus Pedidos"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </Link>
                {user.isAdmin && (
                  <Link
                    href="/admin"
                    className="p-2 rounded-full transition-all duration-200"
                    style={{ color: "#f472b6" }}
                    title="Admin"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </Link>
                )}
                <button
                  onClick={logout}
                  className="px-3 py-1.5 text-xs rounded-full transition-all duration-200"
                  style={{ color: isDark ? "#6b7280" : "#9ca3af" }}
                >
                  Sair
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="hidden md:flex items-center gap-1.5 px-4 py-2 text-sm rounded-full transition-all duration-200"
                style={{ color: isDark ? "#9ca3af" : "#6b7280" }}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Entrar
              </Link>
            )}

            <Link
              href="/carrinho"
              className="relative p-2.5 rounded-full transition-all duration-200 group"
              style={{ color: isDark ? "#9ca3af" : "#6b7280" }}
            >
              <svg className="w-5 h-5 transition-colors duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {itemCount > 0 && (
                <span
                  className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 animate-bounce-in"
                  style={{ background: "linear-gradient(to right, #ec4899, #f43f5e)" }}
                >
                  {itemCount}
                </span>
              )}
            </Link>

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2.5 rounded-full transition-all duration-200"
              style={{ color: isDark ? "#9ca3af" : "#6b7280" }}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                {menuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {menuOpen && (
          <div
            className="md:hidden pb-4 pt-2 space-y-1 border-t animate-reveal-up"
            style={{ borderColor: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)" }}
          >
            <Link href="/" className="block px-4 py-2.5 rounded-xl text-sm transition-all duration-200" style={{ color: isDark ? "#d1d5db" : "#4b5563" }} onClick={() => setMenuOpen(false)}>
              Início
            </Link>
            <Link href="/produtos" className="block px-4 py-2.5 rounded-xl text-sm transition-all duration-200" style={{ color: isDark ? "#d1d5db" : "#4b5563" }} onClick={() => setMenuOpen(false)}>
              Produtos
            </Link>
            {user ? (
              <>
                <Link href="/perfil" className="block px-4 py-2.5 rounded-xl text-sm transition-all duration-200" style={{ color: isDark ? "#d1d5db" : "#4b5563" }} onClick={() => setMenuOpen(false)}>
                  Meu Perfil
                </Link>
                <Link href="/meus-pedidos" className="block px-4 py-2.5 rounded-xl text-sm transition-all duration-200" style={{ color: isDark ? "#d1d5db" : "#4b5563" }} onClick={() => setMenuOpen(false)}>
                  Meus Pedidos
                </Link>
                <button onClick={() => { logout(); setMenuOpen(false); }} className="block w-full text-left px-4 py-2.5 rounded-xl text-sm transition-all duration-200" style={{ color: isDark ? "#6b7280" : "#9ca3af" }}>
                  Sair
                </button>
              </>
            ) : (
              <Link href="/login" className="block px-4 py-2.5 rounded-xl text-sm transition-all duration-200" style={{ color: isDark ? "#d1d5db" : "#4b5563" }} onClick={() => setMenuOpen(false)}>
                Entrar / Criar Conta
              </Link>
            )}
          </div>
        )}
      </div>
    </header>
  );
}

"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useCart } from "@/lib/cart";
import { useAuth } from "@/lib/auth";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { itemCount } = useCart();
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`sticky top-0 z-50 transition-all duration-500 ${
      scrolled
        ? "bg-white/90 backdrop-blur-xl border-b border-gray-100"
        : "bg-transparent"
    }`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 group">
            <Image
              src="/images/logo-sakuraby.png"
              alt="SakuraBy"
              width={32}
              height={32}
              className="h-8 w-auto transition-transform duration-300 group-hover:scale-110"
              priority
            />
            <span className="text-lg font-bold tracking-tight text-gray-900 hidden sm:block">
              Sakura<span className="text-pink-500">By</span>
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
                className="px-4 py-2 text-sm text-gray-500 hover:text-gray-900 rounded-full hover:bg-gray-50 transition-all duration-200"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-1">
            {user ? (
              <div className="hidden md:flex items-center gap-1">
                <Link href="/meus-pedidos" className="p-2 rounded-full text-gray-400 hover:text-gray-900 hover:bg-gray-50 transition-all duration-200" title="Meus Pedidos">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </Link>
                {user.isAdmin && (
                  <Link href="/admin" className="p-2 rounded-full text-pink-400 hover:text-pink-600 hover:bg-pink-50 transition-all duration-200" title="Admin">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </Link>
                )}
                <button onClick={logout} className="px-3 py-1.5 text-xs text-gray-400 hover:text-gray-900 rounded-full hover:bg-gray-50 transition-all duration-200">
                  Sair
                </button>
              </div>
            ) : (
              <Link href="/login" className="hidden md:inline-flex items-center gap-1.5 px-4 py-2 text-sm text-gray-500 hover:text-gray-900 rounded-full hover:bg-gray-50 transition-all duration-200">
                Entrar
              </Link>
            )}

            <Link href="/carrinho" className="relative p-2.5 rounded-full hover:bg-gray-50 transition-all duration-200 group">
              <svg className="w-4 h-4 text-gray-500 group-hover:text-gray-900 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 bg-gray-900 text-white text-[9px] font-bold rounded-full flex items-center justify-center px-1">
                  {itemCount}
                </span>
              )}
            </Link>

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2.5 rounded-full hover:bg-gray-50 transition-all duration-200"
            >
              <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
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
          <div className="md:hidden pb-4 pt-2 space-y-1 border-t border-gray-100 animate-reveal-up">
            <Link href="/" className="block px-4 py-2.5 rounded-xl text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all duration-200" onClick={() => setMenuOpen(false)}>
              Início
            </Link>
            <Link href="/produtos" className="block px-4 py-2.5 rounded-xl text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all duration-200" onClick={() => setMenuOpen(false)}>
              Produtos
            </Link>
            {user ? (
              <>
                <Link href="/meus-pedidos" className="block px-4 py-2.5 rounded-xl text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all duration-200" onClick={() => setMenuOpen(false)}>
                  Meus Pedidos
                </Link>
                <button onClick={() => { logout(); setMenuOpen(false); }} className="block w-full text-left px-4 py-2.5 rounded-xl text-sm text-gray-400 hover:bg-gray-50 hover:text-gray-900 transition-all duration-200">
                  Sair
                </button>
              </>
            ) : (
              <Link href="/login" className="block px-4 py-2.5 rounded-xl text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all duration-200" onClick={() => setMenuOpen(false)}>
                Entrar / Criar Conta
              </Link>
            )}
          </div>
        )}
      </div>
    </header>
  );
}

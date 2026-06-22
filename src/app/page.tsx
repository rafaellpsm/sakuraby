"use client";

import Link from "next/link";
import Image from "next/image";
import { getFeaturedProducts } from "@/lib/products";
import ProductCard from "@/components/ProductCard";
import CategoryShowcase from "@/components/CategoryShowcase";
import { ScrollRevealWrapper, StaggerRevealWrapper } from "@/components/ScrollReveal";

const perks = [
  { icon: "🚚", title: "Frete grátis", desc: "Acima de R$ 199,90" },
  { icon: "🔒", title: "Compra segura", desc: "Mercado Pago" },
  { icon: "✨", title: "100% originais", desc: "K-Beauty selection" },
];

export default function Home() {
  const featured = getFeaturedProducts();

  return (
    <div className="overflow-hidden">
      <section className="relative pt-20 pb-16 md:pt-28 md:pb-24 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-gradient-to-b from-pink-50/60 via-rose-50/20 to-transparent rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <div className="animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-pink-100 mb-8">
              <span className="text-sm">🌸</span>
              <span className="text-xs font-medium text-pink-500">K-Beauty Selection</span>
            </div>

            <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold mb-6 leading-[1.1] tracking-tight text-gray-900">
              Sua beleza
              <br />
              <span className="bg-gradient-to-r from-pink-500 via-rose-400 to-fuchsia-500 bg-clip-text text-transparent">
                começa aqui
              </span>
            </h1>

            <p className="text-lg text-gray-400 max-w-md mx-auto mb-10 leading-relaxed">
              Skincare coreano selecionado com carinho para sua rotina de beleza.
            </p>

            <div className="flex items-center justify-center gap-4">
              <Link
                href="#destaques"
                className="group px-8 py-4 bg-gray-900 text-white font-medium rounded-full hover:bg-gray-800 transition-all duration-300 active:scale-95 shadow-lg shadow-gray-900/10"
              >
                <span className="flex items-center gap-2 text-sm">
                  Ver Destaques
                  <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
              </Link>
              <Link
                href="/produtos"
                className="px-8 py-4 text-gray-500 font-medium rounded-full hover:text-gray-900 hover:bg-gray-50 transition-all duration-300 text-sm"
              >
                Todos os Produtos
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-6 border-y border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <StaggerRevealWrapper className="grid grid-cols-3 gap-4" staggerDelay={100}>
            {perks.map((perk) => (
              <div key={perk.title} className="flex items-center justify-center gap-3 py-2">
                <span className="text-xl">{perk.icon}</span>
                <div>
                  <p className="text-xs font-semibold text-gray-800">{perk.title}</p>
                  <p className="text-[10px] text-gray-400">{perk.desc}</p>
                </div>
              </div>
            ))}
          </StaggerRevealWrapper>
        </div>
      </section>

      <CategoryShowcase />

      <ScrollRevealWrapper>
        <section id="destaques" className="py-16 md:py-24">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="flex items-end justify-between mb-10">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                  Destaques
                </h2>
                <p className="text-sm text-gray-400 mt-1">Os favoritos das nossas clientes</p>
              </div>
              <Link
                href="/produtos"
                className="hidden sm:inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-900 transition-colors"
              >
                Ver todos
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
              {featured.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            <div className="text-center mt-10 sm:hidden">
              <Link href="/produtos" className="text-sm text-gray-400 hover:text-gray-900 transition-colors">
                Ver todos os produtos →
              </Link>
            </div>
          </div>
        </section>
      </ScrollRevealWrapper>

      <ScrollRevealWrapper>
        <section className="py-16 md:py-24 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
            <span className="text-3xl mb-4 block">🌸</span>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
              Frete grátis acima de R$ 199,90
            </h2>
            <p className="text-gray-400 mb-8 max-w-md mx-auto text-sm leading-relaxed">
              Aproveite o frete grátis para todo o Brasil. Cuidar da sua beleza ficou mais fácil!
            </p>
            <Link
              href="/produtos"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-gray-900 text-white font-medium rounded-full hover:bg-gray-800 transition-all duration-300 shadow-lg shadow-gray-900/10 text-sm"
            >
              Comprar agora
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </section>
      </ScrollRevealWrapper>

      <section className="py-16 md:py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              Como funciona
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { num: "01", icon: "🛍️", title: "Escolha", desc: "Navegue pela nossa seleção de skincare coreano." },
              { num: "02", icon: "💳", title: "Pague", desc: "PIX, cartão ou boleto via Mercado Pago." },
              { num: "03", icon: "📦", title: "Receba", desc: "Rastreamento completo em todo o Brasil." },
            ].map((item) => (
              <div key={item.num} className="text-center group">
                <div className="w-16 h-16 mx-auto mb-5 bg-gray-50 rounded-2xl flex items-center justify-center text-3xl group-hover:bg-pink-50 group-hover:scale-110 transition-all duration-500">
                  {item.icon}
                </div>
                <p className="text-[10px] font-bold text-gray-300 tracking-widest mb-2">PASSO {item.num}</p>
                <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                <p className="text-sm text-gray-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

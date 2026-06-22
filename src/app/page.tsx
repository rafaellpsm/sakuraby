"use client";

import Link from "next/link";
import Image from "next/image";
import { getFeaturedProducts } from "@/lib/products";
import ProductCard from "@/components/ProductCard";
import CategoryShowcase from "@/components/CategoryShowcase";
import { ScrollRevealWrapper, StaggerRevealWrapper } from "@/components/ScrollReveal";

const steps = [
  { step: "01", icon: "🛍️", title: "Escolha seus produtos", desc: "Navegue pela nossa seleção de skincare coreano." },
  { step: "02", icon: "💳", title: "Pague com segurança", desc: "PIX, cartão ou boleto via Mercado Pago." },
  { step: "03", icon: "📦", title: "Receba em casa", desc: "Rastreamento completo em todo o Brasil." },
];

export default function Home() {
  const featured = getFeaturedProducts();

  return (
    <div className="overflow-hidden">
      <section className="relative py-12 md:py-16 bg-gradient-to-b from-pink-50/60 via-white to-white overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-pink-100/30 rounded-full blur-3xl" />
          <div className="absolute -bottom-32 -right-32 w-[500px] h-[500px] bg-fuchsia-100/20 rounded-full blur-3xl" />
          <Image
            src="/images/flor-cerejeira.png"
            alt=""
            width={220}
            height={220}
            className="absolute top-6 right-4 md:right-12 opacity-10 animate-float select-none pointer-events-none"
            priority={false}
          />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <div className="animate-fade-in">
            <span className="inline-block px-4 py-1.5 bg-pink-50 text-pink-500 rounded-full text-xs font-medium mb-5 tracking-wide">
              K-Beauty Selection
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-5 leading-tight tracking-tight">
              <span className="text-gray-900">Sua beleza</span>{" "}
              <span className="bg-gradient-to-r from-pink-500 via-rose-400 to-fuchsia-500 bg-clip-text text-transparent">
                começa aqui
              </span>
            </h1>
            <p className="text-base md:text-lg text-gray-400 max-w-md mx-auto mb-8 leading-relaxed">
              Skincare coreano selecionado com carinho para sua rotina de beleza.
            </p>
            <div className="flex items-center justify-center gap-3">
              <Link
                href="#destaques"
                className="group px-7 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-medium rounded-full shadow-lg shadow-pink-200/60 hover:shadow-xl hover:shadow-pink-300/60 hover:from-pink-600 hover:to-rose-600 transition-all duration-300 active:scale-95"
              >
                <span className="flex items-center gap-2 text-sm">
                  Ver Destaques
                  <svg className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
              </Link>
              <Link
                href="/produtos"
                className="px-7 py-3 text-pink-500 font-medium rounded-full hover:bg-pink-50 transition-all duration-300 text-sm"
              >
                Todos os Produtos
              </Link>
            </div>
          </div>
        </div>
      </section>

      <CategoryShowcase />

      <ScrollRevealWrapper>
        <section id="destaques" className="py-12 md:py-16 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="flex items-end justify-between mb-8">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                  Destaques
                </h2>
                <p className="text-sm text-gray-400 mt-1">Os favoritos das nossas clientes</p>
              </div>
              <Link
                href="/produtos"
                className="hidden sm:inline-flex items-center gap-1.5 text-sm text-pink-500 font-medium hover:text-pink-600 transition-colors"
              >
                Ver todos
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
              {featured.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            <div className="text-center mt-8 sm:hidden">
              <Link
                href="/produtos"
                className="inline-flex items-center gap-1.5 text-sm text-pink-500 font-medium"
              >
                Ver todos os produtos
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </section>
      </ScrollRevealWrapper>

      <div className="relative py-8 md:py-10 overflow-hidden">
        <Image
          src="/images/flores-horizontal.png"
          alt=""
          width={1200}
          height={120}
          className="w-full h-16 md:h-20 object-contain opacity-25 select-none pointer-events-none"
          priority={false}
        />
      </div>

      <ScrollRevealWrapper>
        <section className="py-12 md:py-16 bg-gradient-to-b from-white to-pink-50/30">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="bg-gradient-to-br from-pink-500 via-rose-400 to-fuchsia-500 rounded-3xl p-8 md:p-12 text-center text-white relative overflow-hidden">
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <Image
                  src="/images/petalasmaisescuras.png"
                  alt=""
                  width={100}
                  height={100}
                  className="absolute top-4 left-6 opacity-10 animate-float select-none"
                />
                <Image
                  src="/images/petalas-cereja.png"
                  alt=""
                  width={80}
                  height={80}
                  className="absolute bottom-4 right-6 opacity-10 animate-float-reverse select-none"
                />
              </div>
              <div className="relative z-10">
                <h2 className="text-xl md:text-2xl font-bold mb-2">Frete grátis acima de R$ 199,90</h2>
                <p className="text-pink-100 mb-5 text-sm max-w-md mx-auto">
                  Compras acima de R$ 199,90 com frete grátis para todo o Brasil.
                </p>
                <Link
                  href="/produtos"
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-white text-pink-600 font-medium rounded-full hover:bg-pink-50 transition-all duration-300 shadow-lg text-sm"
                >
                  Comprar agora
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </ScrollRevealWrapper>

      <section className="py-12 md:py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              Como <span className="text-pink-500">funciona</span>
            </h2>
          </div>
          <StaggerRevealWrapper className="grid grid-cols-1 md:grid-cols-3 gap-6" staggerDelay={120}>
            {steps.map((item) => (
              <div key={item.step} className="text-center p-5 rounded-2xl hover:bg-pink-50/40 transition-all duration-300">
                <div className="w-12 h-12 mx-auto mb-3 bg-pink-50 rounded-2xl flex items-center justify-center text-2xl hover:scale-110 hover:rotate-6 transition-all duration-300">
                  {item.icon}
                </div>
                <h3 className="font-semibold text-gray-800 text-sm mb-1">{item.title}</h3>
                <p className="text-xs text-gray-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </StaggerRevealWrapper>
        </div>
      </section>
    </div>
  );
}

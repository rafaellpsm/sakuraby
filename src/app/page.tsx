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
      <section className="relative py-14 md:py-20 bg-gradient-to-b from-pink-50/50 via-white to-white overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-pink-100/25 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -right-40 w-[600px] h-[600px] bg-fuchsia-100/15 rounded-full blur-3xl" />
          <Image
            src="/images/flor-cerejeira.png"
            alt=""
            width={260}
            height={260}
            className="absolute -top-6 -right-6 md:right-8 opacity-15 animate-float select-none pointer-events-none"
            priority={false}
          />
          <Image
            src="/images/petala-grande.png"
            alt=""
            width={140}
            height={140}
            className="absolute bottom-0 left-4 md:left-12 opacity-15 animate-float-reverse select-none pointer-events-none"
            priority={false}
          />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row items-center gap-10 md:gap-16">
            <div className="flex-1 text-center md:text-left animate-fade-in">
              <span className="inline-block px-3 py-1 bg-pink-50 text-pink-500 rounded-full text-xs font-medium mb-5 tracking-wide">
                ✨ Novidades K-Beauty
              </span>
              <h1 className="text-4xl sm:text-5xl md:text-5xl lg:text-6xl font-bold mb-5 leading-tight">
                <span className="text-gray-900">Sua beleza</span>
                <br />
                <span className="bg-gradient-to-r from-pink-500 via-rose-400 to-fuchsia-500 bg-clip-text text-transparent">
                  começa aqui
                </span>
              </h1>
              <p className="text-base md:text-lg text-gray-400 max-w-md mb-8 leading-relaxed">
                Séruns, hidratantes e tratamentos coreanos que transformam sua rotina de beleza.
              </p>
              <div className="flex flex-col sm:flex-row items-center md:justify-start justify-center gap-3">
                <Link
                  href="#destaques"
                  className="group px-7 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-medium rounded-full shadow-lg shadow-pink-200/50 hover:shadow-xl hover:shadow-pink-300/50 hover:from-pink-600 hover:to-rose-600 transition-all duration-300 active:scale-95"
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

            <div className="flex-shrink-0 relative w-56 h-56 md:w-72 md:h-72 animate-bounce-in">
              <div className="absolute inset-0 bg-gradient-to-br from-pink-100/60 to-fuchsia-100/40 rounded-full blur-3xl" />
              <Image
                src="/images/flor-cerejeira.png"
                alt="SakuraBy"
                width={280}
                height={280}
                className="relative z-10 w-full h-full object-contain drop-shadow-lg"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      <CategoryShowcase />

      <ScrollRevealWrapper>
        <section id="destaques" className="py-14 md:py-20 bg-white relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-pink-50/40 rounded-full blur-3xl pointer-events-none" />
          <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
            <div className="text-center mb-10">
              <span className="inline-block px-3 py-1 bg-pink-50 text-pink-500 rounded-full text-xs font-medium mb-3">
                Selecionados para você
              </span>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                Produtos em <span className="text-pink-500">destaque</span>
              </h2>
              <p className="text-sm text-gray-400 max-w-md mx-auto">
                Os favoritos das nossas clientes. Qualidade comprovada e resultados visíveis.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
              {featured.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            <div className="text-center mt-10">
              <Link
                href="/produtos"
                className="inline-flex items-center gap-2 px-6 py-2.5 border border-pink-200 text-pink-500 font-medium rounded-full hover:bg-pink-50 transition-all duration-300 text-sm"
              >
                Ver todos os produtos
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>
        </section>
      </ScrollRevealWrapper>

      <ScrollRevealWrapper>
        <section className="py-14 md:py-20 bg-gradient-to-b from-white to-pink-50/30 relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <Image
              src="/images/petalasmaisescuras.png"
              alt=""
              width={120}
              height={120}
              className="absolute top-8 left-8 opacity-10 animate-float select-none"
            />
            <Image
              src="/images/petalas-cereja.png"
              alt=""
              width={100}
              height={100}
              className="absolute bottom-8 right-8 opacity-10 animate-float-reverse select-none"
            />
          </div>
          <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10">
            <div className="bg-gradient-to-br from-pink-500 via-rose-400 to-fuchsia-500 rounded-3xl p-8 md:p-12 text-center text-white relative overflow-hidden">
              <div className="relative z-10">
                <h2 className="text-xl md:text-2xl font-bold mb-2">Frete grátis acima de R$ 199,90</h2>
                <p className="text-pink-100 mb-6 text-sm max-w-md mx-auto">
                  Aproveite o frete grátis para todo o Brasil em compras acima de R$ 199,90. Cuidar da sua beleza ficou mais fácil!
                </p>
                <Link
                  href="/produtos"
                  className="inline-flex items-center gap-2 px-7 py-3 bg-white text-pink-600 font-medium rounded-full hover:bg-pink-50 transition-all duration-300 shadow-lg text-sm"
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

      <section className="py-14 md:py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              Como <span className="text-pink-500">funciona</span>
            </h2>
            <p className="text-sm text-gray-400">Três passos simples para sua beleza</p>
          </div>
          <StaggerRevealWrapper className="grid grid-cols-1 md:grid-cols-3 gap-6" staggerDelay={120}>
            {steps.map((item) => (
              <div key={item.step} className="text-center p-6 rounded-2xl hover:bg-pink-50/30 transition-all duration-300">
                <div className="w-14 h-14 mx-auto mb-4 bg-gradient-to-br from-pink-50 to-rose-50 rounded-2xl flex items-center justify-center text-2xl hover:scale-110 hover:rotate-6 transition-all duration-300">
                  {item.icon}
                </div>
                <h3 className="font-semibold text-gray-800 text-sm mb-1.5">{item.title}</h3>
                <p className="text-xs text-gray-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </StaggerRevealWrapper>
        </div>
      </section>
    </div>
  );
}

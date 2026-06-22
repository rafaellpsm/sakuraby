"use client";

import Link from "next/link";
import Image from "next/image";
import { getFeaturedProducts } from "@/lib/products";
import ProductCard from "@/components/ProductCard";
import CategoryShowcase from "@/components/CategoryShowcase";
import { ScrollRevealWrapper, StaggerRevealWrapper } from "@/components/ScrollReveal";

const features = [
  { icon: "🌸", title: "Produtos Coreanos", description: "Selecionados das melhores marcas de K-Beauty" },
  { icon: "🚚", title: "Frete Grátis", description: "Acima de R$ 199,90" },
  { icon: "🔒", title: "Compra Segura", description: "Pagamento via Mercado Pago" },
  { icon: "💫", title: "Qualidade Garantida", description: "100% originais" },
];

const steps = [
  { step: "01", icon: "🛍️", title: "Escolha seus produtos", desc: "Navegue pela nossa seleção de skincare coreano." },
  { step: "02", icon: "💳", title: "Pague com segurança", desc: "PIX, cartão ou boleto via Mercado Pago." },
  { step: "03", icon: "📦", title: "Receba em casa", desc: "Rastreamento completo em todo o Brasil." },
];

export default function Home() {
  const featured = getFeaturedProducts();

  return (
    <div className="overflow-hidden">
      <section className="relative py-10 md:py-14 bg-gradient-to-br from-pink-50 via-white to-fuchsia-50 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -left-20 w-80 h-80 bg-pink-200/25 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-fuchsia-200/15 rounded-full blur-3xl" />
          <Image
            src="/images/flor-cerejeira.png"
            alt=""
            width={300}
            height={300}
            className="absolute -top-4 -right-8 opacity-15 animate-float select-none pointer-events-none"
            priority={false}
          />
          <Image
            src="/images/petalas-rosa.png"
            alt=""
            width={120}
            height={120}
            className="absolute bottom-4 left-8 opacity-20 animate-float-reverse select-none pointer-events-none"
            priority={false}
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
            <div className="flex-1 text-center md:text-left animate-fade-in">
              <span className="inline-block px-3 py-1 bg-pink-100 text-pink-600 rounded-full text-xs font-medium mb-4">
                ✨ Novidades K-Beauty disponíveis
              </span>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
                <span className="text-gray-900">Sua beleza</span>{" "}
                <span className="bg-gradient-to-r from-pink-500 via-rose-400 to-fuchsia-500 bg-clip-text text-transparent animate-text-shimmer">
                  começa aqui
                </span>
              </h1>
              <p className="text-base md:text-lg text-gray-500 max-w-lg mb-6 leading-relaxed">
                Séruns, hidratantes e tratamentos coreanos que transformam sua rotina de beleza.
              </p>
              <div className="flex flex-col sm:flex-row items-center md:justify-start justify-center gap-3">
                <Link
                  href="#featured"
                  className="group px-7 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-semibold rounded-full shadow-lg shadow-pink-200 hover:shadow-xl hover:shadow-pink-300 hover:from-pink-600 hover:to-rose-600 transition-all duration-300 active:scale-95"
                >
                  <span className="flex items-center gap-2">
                    Ver Destaques
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </span>
                </Link>
                <Link
                  href="/produtos"
                  className="px-7 py-3 border-2 border-pink-200 text-pink-600 font-semibold rounded-full hover:bg-pink-50 transition-all duration-300 hover-lift"
                >
                  Todos os Produtos
                </Link>
              </div>
            </div>

            <div className="flex-shrink-0 relative w-48 h-48 md:w-64 md:h-64 animate-bounce-in">
              <div className="absolute inset-0 bg-gradient-to-br from-pink-100 to-fuchsia-100 rounded-full blur-2xl opacity-60" />
              <Image
                src="/images/flor-cerejeira.png"
                alt="SakuraBy"
                width={256}
                height={256}
                className="relative z-10 w-full h-full object-contain drop-shadow-lg"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-6 md:py-8 bg-white border-b border-pink-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <StaggerRevealWrapper className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6" staggerDelay={80}>
            {features.map((feature) => (
              <div key={feature.title} className="flex items-center gap-3 group cursor-default">
                <div className="w-10 h-10 shrink-0 bg-gradient-to-br from-pink-50 to-rose-50 rounded-xl flex items-center justify-center text-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 group-hover:shadow-md group-hover:shadow-pink-100">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 text-xs">{feature.title}</h3>
                  <p className="text-[10px] text-gray-500">{feature.description}</p>
                </div>
              </div>
            ))}
          </StaggerRevealWrapper>
        </div>
      </section>

      <CategoryShowcase />

      <ScrollRevealWrapper>
        <section id="featured" className="py-14 md:py-20 bg-gradient-to-b from-white to-pink-50/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-10">
              <span className="inline-block px-3 py-1 bg-pink-100 text-pink-600 rounded-full text-xs font-medium mb-3">
                Selecionados para você
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                Produtos em <span className="bg-gradient-to-r from-pink-500 to-fuchsia-500 bg-clip-text text-transparent">destaque</span>
              </h2>
              <p className="text-gray-500 max-w-lg mx-auto">
                Os favoritos das nossas clientes. Qualidade comprovada e resultados visíveis.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {featured.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            <div className="text-center mt-8">
              <Link
                href="/produtos"
                className="inline-flex items-center gap-2 px-6 py-3 border-2 border-pink-200 text-pink-600 font-medium rounded-full hover:bg-pink-50 transition-all duration-300 hover-lift"
              >
                Ver todos os produtos
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>
        </section>
      </ScrollRevealWrapper>

      <ScrollRevealWrapper>
        <section className="py-14 md:py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="bg-gradient-to-r from-pink-500 via-rose-400 to-fuchsia-500 rounded-3xl p-8 md:p-12 text-center text-white relative overflow-hidden hover-glow">
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <Image
                  src="/images/petalasmaisescuras.png"
                  alt=""
                  width={150}
                  height={150}
                  className="absolute top-2 left-6 opacity-15 animate-float select-none"
                />
                <Image
                  src="/images/petalas-cereja.png"
                  alt=""
                  width={120}
                  height={120}
                  className="absolute bottom-2 right-6 opacity-15 animate-float-reverse select-none"
                />
              </div>
              <div className="relative z-10">
                <h2 className="text-2xl md:text-3xl font-bold mb-3">Frete grátis acima de R$ 199,90</h2>
                <p className="text-pink-100 mb-6 max-w-lg mx-auto">
                  Aproveite o frete grátis para todo o Brasil em compras acima de R$ 199,90.
                </p>
                <Link
                  href="/produtos"
                  className="inline-flex items-center gap-2 px-8 py-3 bg-white text-pink-600 font-semibold rounded-full hover:bg-pink-50 transition-all duration-300 shadow-lg hover-magnify"
                >
                  Comprar agora
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </ScrollRevealWrapper>

      <section className="py-14 md:py-20 bg-gradient-to-b from-white to-pink-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              Como <span className="bg-gradient-to-r from-pink-500 to-fuchsia-500 bg-clip-text text-transparent">funciona</span>
            </h2>
          </div>
          <StaggerRevealWrapper className="grid grid-cols-1 md:grid-cols-3 gap-8" staggerDelay={150}>
            {steps.map((item) => (
              <div key={item.step} className="text-center p-6 rounded-2xl bg-white border border-pink-100 hover:shadow-lg hover:shadow-pink-100/30 transition-all duration-500 hover-lift">
                <span className="inline-block text-xs font-bold text-pink-300 mb-3">PASSO {item.step}</span>
                <div className="text-4xl mb-4 hover-rotate inline-block">{item.icon}</div>
                <h3 className="font-semibold text-gray-800 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500">{item.desc}</p>
              </div>
            ))}
          </StaggerRevealWrapper>
        </div>
      </section>
    </div>
  );
}

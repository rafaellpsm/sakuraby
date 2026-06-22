"use client";

import Link from "next/link";
import Image from "next/image";
import { getFeaturedProducts } from "@/lib/products";
import ProductCard from "@/components/ProductCard";

const features = [
  {
    icon: "🌸",
    title: "Produtos Coreanos",
    description: "Selecionados das melhores marcas de K-Beauty",
  },
  {
    icon: "🚚",
    title: "Frete Grátis",
    description: "Acima de R$ 199,90 para todo o Brasil",
  },
  {
    icon: "🔒",
    title: "Compra Segura",
    description: "Pagamento protegido via Mercado Pago",
  },
  {
    icon: "💫",
    title: "Qualidade Garantida",
    description: "100% originais com nota fiscal",
  },
];

export default function Home() {
  const featured = getFeaturedProducts();

  return (
    <div className="overflow-hidden">
      <section className="relative min-h-[85vh] flex items-center justify-center bg-gradient-to-br from-pink-50 via-white to-fuchsia-50 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-pink-200/30 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-fuchsia-200/20 rounded-full blur-3xl animate-float-reverse" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-rose-100/20 rounded-full blur-3xl" />
          <span className="absolute top-[15%] left-[8%] text-6xl opacity-20 animate-float select-none">🌸</span>
          <span className="absolute top-[25%] right-[12%] text-5xl opacity-15 animate-float-reverse select-none">🌷</span>
          <span className="absolute bottom-[20%] left-[15%] text-4xl opacity-15 animate-float select-none">✨</span>
          <span className="absolute bottom-[30%] right-[8%] text-5xl opacity-20 animate-float-reverse select-none">🌸</span>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <div className="animate-fade-in">
            <span className="inline-block px-4 py-1.5 bg-pink-100 text-pink-600 rounded-full text-sm font-medium mb-6">
              ✨ Novidades K-Beauty disponíveis
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-6 leading-tight">
              <span className="text-gray-900">Sua beleza</span>
              <br />
              <span className="bg-gradient-to-r from-pink-500 via-rose-400 to-fuchsia-500 bg-clip-text text-transparent">
                começa aqui
              </span>
            </h1>
            <p className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto mb-8 leading-relaxed">
              Descubra os melhores produtos de skincare coreano. Séruns, hidratantes e tratamentos que transformam sua rotina de beleza.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/produtos"
                className="group px-8 py-3.5 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-semibold rounded-full shadow-lg shadow-pink-200 hover:shadow-xl hover:shadow-pink-300 hover:from-pink-600 hover:to-rose-600 transition-all duration-300 active:scale-95"
              >
                <span className="flex items-center gap-2">
                  Ver Produtos
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
              </Link>
              <Link
                href="#featured"
                className="px-8 py-3.5 border-2 border-pink-200 text-pink-600 font-semibold rounded-full hover:bg-pink-50 transition-all duration-300"
              >
                Destaques
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {features.map((feature) => (
              <div key={feature.title} className="text-center group">
                <div className="w-14 h-14 mx-auto mb-4 bg-gradient-to-br from-pink-50 to-rose-50 rounded-2xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="font-semibold text-gray-800 mb-1 text-sm">{feature.title}</h3>
                <p className="text-xs text-gray-500">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="featured" className="py-16 md:py-24 bg-gradient-to-b from-white to-pink-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
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

          <div className="text-center mt-10">
            <Link
              href="/produtos"
              className="inline-flex items-center gap-2 px-6 py-3 border-2 border-pink-200 text-pink-600 font-medium rounded-full hover:bg-pink-50 transition-all duration-300"
            >
              Ver todos os produtos
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="bg-gradient-to-r from-pink-500 via-rose-400 to-fuchsia-500 rounded-3xl p-8 md:p-12 text-center text-white relative overflow-hidden">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <span className="absolute top-4 left-8 text-5xl opacity-20 animate-float select-none">🌸</span>
              <span className="absolute bottom-4 right-8 text-4xl opacity-20 animate-float-reverse select-none">✨</span>
            </div>
            <div className="relative z-10">
              <h2 className="text-2xl md:text-3xl font-bold mb-3">Frete grátis acima de R$ 199,90</h2>
              <p className="text-pink-100 mb-6 max-w-lg mx-auto">
                Aproveite o frete grátis para todo o Brasil em compras acima de R$ 199,90. Cuidar da sua beleza ficou mais fácil!
              </p>
              <Link
                href="/produtos"
                className="inline-flex items-center gap-2 px-8 py-3 bg-white text-pink-600 font-semibold rounded-full hover:bg-pink-50 transition-all duration-300 shadow-lg"
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

      <section className="py-16 md:py-24 bg-gradient-to-b from-white to-pink-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              Como <span className="bg-gradient-to-r from-pink-500 to-fuchsia-500 bg-clip-text text-transparent">funciona</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: "01", icon: "🛍️", title: "Escolha seus produtos", desc: "Navegue pela nossa seleção de skincare coreano e adicione ao carrinho." },
              { step: "02", icon: "💳", title: "Pague com segurança", desc: "_finalize sua compra com PIX, cartão ou boleto via Mercado Pago." },
              { step: "03", icon: "📦", title: "Receba em casa", desc: "Seu pedido chega pela transportadora com rastreamento completo." },
            ].map((item) => (
              <div key={item.step} className="text-center p-6 rounded-2xl bg-white border border-pink-100 hover:shadow-lg hover:shadow-pink-100/30 transition-all duration-300">
                <span className="inline-block text-xs font-bold text-pink-300 mb-3">PASSO {item.step}</span>
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="font-semibold text-gray-800 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

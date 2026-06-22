"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { products, type Product } from "@/lib/products";
import { useCart } from "@/lib/cart";

const categoryData = [
  {
    id: "Hidratantes",
    label: "Pele",
    icon: "✨",
    emoji: "💧",
    description: "Hidratação profunda para sua pele",
    gradient: "from-blue-400 to-cyan-300",
    bgGradient: "from-blue-50 to-cyan-50",
    borderColor: "border-blue-200",
    textColor: "text-blue-600",
  },
  {
    id: "Sérums",
    label: "Tratamento",
    icon: "💎",
    emoji: "🧬",
    description: "Séruns concentrados para resultados",
    gradient: "from-purple-400 to-fuchsia-400",
    bgGradient: "from-purple-50 to-fuchsia-50",
    borderColor: "border-purple-200",
    textColor: "text-purple-600",
  },
  {
    id: "Cabelos",
    label: "Cabelo",
    icon: "💇",
    emoji: "🌸",
    description: "Cuidados capilares coreanos",
    gradient: "from-pink-400 to-rose-400",
    bgGradient: "from-pink-50 to-rose-50",
    borderColor: "border-pink-200",
    textColor: "text-pink-600",
  },
  {
    id: "Limpeza",
    label: "Limpeza",
    icon: "🫧",
    emoji: "🧴",
    description: "Limpeza suave e eficaz",
    gradient: "from-teal-400 to-emerald-400",
    bgGradient: "from-teal-50 to-emerald-50",
    borderColor: "border-teal-200",
    textColor: "text-teal-600",
  },
  {
    id: "Tratamento",
    label: "Peeling",
    icon: "🌟",
    emoji: "⚗️",
    description: "Renovação e iluminação",
    gradient: "from-amber-400 to-orange-400",
    bgGradient: "from-amber-50 to-orange-50",
    borderColor: "border-amber-200",
    textColor: "text-amber-600",
  },
  {
    id: "Olhos",
    label: "Olhos",
    icon: "👁️",
    emoji: "💫",
    description: "Contorno de olhos rejuvenescido",
    gradient: "from-indigo-400 to-violet-400",
    bgGradient: "from-indigo-50 to-violet-50",
    borderColor: "border-indigo-200",
    textColor: "text-indigo-600",
  },
];

function MiniProductCard({ product, categoryColor }: { product: Product; categoryColor: string }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="group/card bg-white rounded-2xl border border-pink-100 overflow-hidden shadow-sm hover:shadow-xl hover:shadow-pink-100/40 transition-all duration-500 hover:-translate-y-2 hover:scale-[1.02]">
      <Link href={`/produtos/${product.id}`}>
        <div className="relative aspect-square bg-gradient-to-br from-pink-50 to-rose-50 p-3 overflow-hidden">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-contain p-2 group-hover/card:scale-110 transition-transform duration-700 ease-out"
            sizes="(max-width: 640px) 50vw, 25vw"
          />
          {discount > 0 && (
            <span className={`absolute top-2 left-2 bg-gradient-to-r ${categoryColor} text-white text-[10px] font-bold px-2 py-0.5 rounded-full animate-pulse`}>
              -{discount}%
            </span>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-white/80 via-transparent to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-300" />
        </div>
      </Link>

      <div className="p-3">
        <div className="flex items-center gap-0.5 mb-1">
          {[...Array(5)].map((_, i) => (
            <svg
              key={i}
              className={`w-3 h-3 ${i < Math.floor(product.rating) ? "text-amber-400" : "text-gray-200"}`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
          <span className="text-[10px] text-gray-400 ml-0.5">({product.reviews})</span>
        </div>

        <h4 className="text-xs font-medium text-gray-800 line-clamp-2 mb-2 min-h-[2rem] group-hover/card:text-pink-600 transition-colors">
          {product.name}
        </h4>

        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-1">
            <span className="text-sm font-bold text-pink-600">
              R$ {product.price.toFixed(2).replace(".", ",")}
            </span>
            {product.originalPrice && (
              <span className="text-[10px] text-gray-400 line-through">
                R$ {product.originalPrice.toFixed(2).replace(".", ",")}
              </span>
            )}
          </div>

          <button
            onClick={handleAdd}
            disabled={product.stock === 0}
            className={`w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300 ${
              added
                ? "bg-green-500 text-white scale-110"
                : product.stock === 0
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : `bg-gradient-to-r ${categoryColor} text-white hover:scale-110 hover:shadow-lg active:scale-90`
            }`}
          >
            {added ? (
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function CategoryShowcase() {
  const [activeCategory, setActiveCategory] = useState(categoryData[0].id);

  const activeCat = categoryData.find((c) => c.id === activeCategory)!;
  const categoryProducts = products.filter((p) => p.category === activeCategory);

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-white via-pink-50/20 to-white relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-pink-100/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-fuchsia-100/20 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center mb-10">
          <span className="inline-block px-3 py-1 bg-pink-100 text-pink-600 rounded-full text-xs font-medium mb-3 animate-fade-in">
            Explore por categoria
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 animate-fade-in">
            Encontre o <span className="bg-gradient-to-r from-pink-500 to-fuchsia-500 bg-clip-text text-transparent">perfeito</span> para você
          </h2>
          <p className="text-gray-500 max-w-lg mx-auto text-sm md:text-base animate-fade-in">
            Passe o mouse sobre a categoria e descubra nossos produtos favoritos
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {categoryData.map((cat) => (
            <button
              key={cat.id}
              onMouseEnter={() => setActiveCategory(cat.id)}
              onClick={() => setActiveCategory(cat.id)}
              className={`group/cat relative px-5 py-3 rounded-2xl text-sm font-medium transition-all duration-500 overflow-hidden ${
                activeCategory === cat.id
                  ? `bg-gradient-to-r ${cat.gradient} text-white shadow-lg scale-105`
                  : `bg-white border ${cat.borderColor} ${cat.textColor} hover:shadow-md hover:scale-105`
              }`}
            >
              <span className="relative z-10 flex items-center gap-2">
                <span className="text-lg transition-transform duration-300 group-hover/cat:scale-125 group-hover/cat:rotate-12">
                  {cat.icon}
                </span>
                {cat.label}
              </span>
              {activeCategory === cat.id && (
                <span className="absolute inset-0 bg-white/20 animate-shimmer" />
              )}
            </button>
          ))}
        </div>

        <div className="relative">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-3xl animate-bounce">{activeCat.emoji}</span>
              <div>
                <h3 className={`text-xl font-bold ${activeCat.textColor}`}>
                  {activeCat.label}
                </h3>
                <p className="text-sm text-gray-500">{activeCat.description}</p>
              </div>
            </div>
            <Link
              href={`/produtos?category=${activeCat.id}`}
              className={`hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium bg-gradient-to-r ${activeCat.gradient} text-white hover:shadow-lg transition-all duration-300 hover:scale-105`}
            >
              Ver todos
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>

          <div
            key={activeCategory}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 animate-fade-in"
          >
            {categoryProducts.map((product, index) => (
              <div
                key={product.id}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 80}ms`, animationFillMode: "both" }}
              >
                <MiniProductCard product={product} categoryColor={activeCat.gradient} />
              </div>
            ))}
          </div>

          {categoryProducts.length === 0 && (
            <div className="text-center py-12 animate-fade-in">
              <span className="text-5xl mb-4 block">🔍</span>
              <p className="text-gray-500">Nenhum produto nesta categoria ainda</p>
            </div>
          )}
        </div>

        <div className="text-center mt-8 sm:hidden">
          <Link
            href={`/produtos?category=${activeCat.id}`}
            className={`inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium bg-gradient-to-r ${activeCat.gradient} text-white hover:shadow-lg transition-all duration-300`}
          >
            Ver todos os produtos de {activeCat.label}
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}

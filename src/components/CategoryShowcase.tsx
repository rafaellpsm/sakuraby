"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { products, type Product } from "@/lib/products";
import { useCart } from "@/lib/cart";

const categoryData = [
  { id: "Hidratantes", label: "Pele", icon: "💧", description: "Hidratação profunda", bgActive: "bg-gradient-to-r from-sky-400 to-cyan-400", textColor: "text-sky-600", emoji: "🌊" },
  { id: "Sérums", label: "Tratamento", icon: "💎", description: "Séruns concentrados", bgActive: "bg-gradient-to-r from-violet-400 to-purple-400", textColor: "text-violet-600", emoji: "🧬" },
  { id: "Cabelos", label: "Cabelo", icon: "💇", description: "Cuidados capilares", bgActive: "bg-gradient-to-r from-pink-400 to-rose-400", textColor: "text-pink-600", emoji: "🌸" },
  { id: "Limpeza", label: "Limpeza", icon: "🫧", description: "Limpeza suave", bgActive: "bg-gradient-to-r from-teal-400 to-emerald-400", textColor: "text-teal-600", emoji: "🧴" },
  { id: "Tratamento", label: "Peeling", icon: "🌟", description: "Renovação e luz", bgActive: "bg-gradient-to-r from-amber-400 to-orange-400", textColor: "text-amber-600", emoji: "✨" },
  { id: "Olhos", label: "Olhos", icon: "👁️", description: "Contorno rejuvenescido", bgActive: "bg-gradient-to-r from-indigo-400 to-blue-400", textColor: "text-indigo-600", emoji: "💫" },
];

function MiniProductCard({ product, catGradient }: { product: Product; catGradient: string }) {
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
    <div className="group/card bg-white rounded-2xl border border-pink-100/50 overflow-hidden hover:shadow-lg hover:shadow-pink-100/30 transition-all duration-300 hover:-translate-y-1">
      <Link href={`/produtos/${product.id}`}>
        <div className="relative aspect-square bg-gradient-to-br from-pink-50/30 to-rose-50/30 p-4 overflow-hidden">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-contain p-2 group-hover/card:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 50vw, 25vw"
          />
          {discount > 0 && (
            <span className={`absolute top-2 left-2 bg-gradient-to-r ${catGradient} text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm`}>
              -{discount}%
            </span>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-white/60 via-transparent to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-300" />
        </div>
      </Link>

      <div className="p-3">
        <div className="flex items-center gap-0.5 mb-1.5">
          {[...Array(5)].map((_, i) => (
            <svg key={i} className={`w-3 h-3 ${i < Math.floor(product.rating) ? "text-amber-400" : "text-pink-100"}`} fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>

        <h4 className="text-xs font-medium text-gray-700 line-clamp-2 mb-2 min-h-[2rem] group-hover/card:text-pink-600 transition-colors duration-300">
          {product.name}
        </h4>

        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-1">
            <span className="text-sm font-bold text-gray-900">
              R$ {product.price.toFixed(2).replace(".", ",")}
            </span>
            {product.originalPrice && (
              <span className="text-[10px] text-gray-300 line-through">
                R$ {product.originalPrice.toFixed(2).replace(".", ",")}
              </span>
            )}
          </div>

          <button
            onClick={handleAdd}
            disabled={product.stock === 0}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
              added
                ? "bg-green-500 text-white scale-110"
                : product.stock === 0
                ? "bg-pink-50 text-pink-300 cursor-not-allowed"
                : `bg-gradient-to-r ${catGradient} text-white hover:scale-110 hover:shadow-lg active:scale-90`
            }`}
          >
            {added ? (
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
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
    <section className="py-16 md:py-24 bg-gradient-to-b from-white via-pink-50/10 to-white relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <span className="absolute top-10 left-[5%] text-3xl opacity-8 animate-float select-none" style={{ animationDelay: "0.5s" }}>🌸</span>
        <span className="absolute bottom-10 right-[8%] text-4xl opacity-10 animate-float-reverse select-none" style={{ animationDelay: "1s" }}>✨</span>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Explore por <span className="bg-gradient-to-r from-pink-500 to-fuchsia-500 bg-clip-text text-transparent">categoria</span>
          </h2>
          <p className="text-sm text-gray-400">
            <span className="hidden sm:inline">Passe o mouse e </span>Descubra nossos produtos
          </p>
        </div>

        <div className="flex overflow-x-auto gap-2 mb-10 pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap sm:justify-center scrollbar-hide">
          {categoryData.map((cat) => (
            <button
              key={cat.id}
              onMouseEnter={() => setActiveCategory(cat.id)}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex-shrink-0 px-5 py-3 rounded-2xl text-sm font-medium transition-all duration-300 overflow-hidden min-h-[44px] ${
                activeCategory === cat.id
                  ? `${cat.bgActive} text-white shadow-lg`
                  : "bg-white text-gray-500 border border-pink-100 hover:border-pink-200 hover:text-gray-800 hover:shadow-md"
              }`}
            >
              <span className="relative z-10 flex items-center gap-2">
                <span className="text-lg">{cat.icon}</span>
                {cat.label}
              </span>
            </button>
          ))}
        </div>

        <div key={activeCategory} className="transition-opacity duration-300">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{activeCat.emoji}</span>
              <div>
                <h3 className={`text-lg font-bold ${activeCat.textColor}`}>
                  {activeCat.label}
                </h3>
                <p className="text-xs text-gray-400">{activeCat.description}</p>
              </div>
            </div>
            <Link
              href={`/produtos?category=${activeCat.id}`}
              className={`hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium bg-gradient-to-r ${activeCat.bgActive} text-white hover:shadow-lg transition-all duration-300`}
            >
              Ver todos
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
            {categoryProducts.map((product) => (
              <div key={product.id}>
                <MiniProductCard product={product} catGradient={activeCat.bgActive} />
              </div>
            ))}
          </div>

          {categoryProducts.length === 0 && (
            <div className="text-center py-12 animate-fade-in">
              <span className="text-4xl mb-3 block">🔍</span>
              <p className="text-sm text-gray-400">Nenhum produto nesta categoria ainda</p>
            </div>
          )}
        </div>

        <div className="text-center mt-8 sm:hidden">
          <Link
            href={`/produtos?category=${activeCat.id}`}
            className={`inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium bg-gradient-to-r ${activeCat.bgActive} text-white hover:shadow-lg transition-all duration-300`}
          >
            Ver todos de {activeCat.label}
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}

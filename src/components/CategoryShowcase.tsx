"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { products, type Product } from "@/lib/products";
import { useCart } from "@/lib/cart";

const categoryData = [
  { id: "Hidratantes", label: "Pele", icon: "💧", description: "Hidratação profunda", gradient: "from-pink-400 to-rose-400", textColor: "text-pink-600", bgActive: "bg-gradient-to-r from-pink-500 to-rose-500" },
  { id: "Sérums", label: "Tratamento", icon: "💎", description: "Séruns concentrados", gradient: "from-fuchsia-400 to-pink-400", textColor: "text-fuchsia-600", bgActive: "bg-gradient-to-r from-fuchsia-500 to-pink-500" },
  { id: "Cabelos", label: "Cabelo", icon: "🌸", description: "Cuidados capilares", gradient: "from-rose-400 to-pink-400", textColor: "text-rose-600", bgActive: "bg-gradient-to-r from-rose-500 to-pink-500" },
  { id: "Limpeza", label: "Limpeza", icon: "🫧", description: "Limpeza suave", gradient: "from-pink-300 to-rose-300", textColor: "text-pink-500", bgActive: "bg-gradient-to-r from-pink-400 to-rose-400" },
  { id: "Tratamento", label: "Peeling", icon: "✨", description: "Renovação e luz", gradient: "from-rose-300 to-fuchsia-300", textColor: "text-rose-500", bgActive: "bg-gradient-to-r from-rose-400 to-fuchsia-400" },
  { id: "Olhos", label: "Olhos", icon: "👁️", description: "Contorno rejuvenescido", gradient: "from-fuchsia-300 to-pink-300", textColor: "text-fuchsia-500", bgActive: "bg-gradient-to-r from-fuchsia-400 to-pink-400" },
];

function MiniProductCard({ product }: { product: Product }) {
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
    <div className="group/card bg-white rounded-2xl border border-pink-100/60 overflow-hidden hover:shadow-lg hover:shadow-pink-100/30 transition-all duration-500 hover:-translate-y-1">
      <Link href={`/produtos/${product.id}`}>
        <div className="relative aspect-square bg-gradient-to-br from-pink-50/50 to-rose-50/50 p-4 overflow-hidden">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-contain p-2 group-hover/card:scale-105 transition-transform duration-700 ease-out"
            sizes="(max-width: 640px) 50vw, 25vw"
          />
          {discount > 0 && (
            <span className="absolute top-2 left-2 bg-pink-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
              -{discount}%
            </span>
          )}
        </div>
      </Link>

      <div className="p-3">
        <div className="flex items-center gap-0.5 mb-1.5">
          {[...Array(5)].map((_, i) => (
            <svg key={i} className={`w-3 h-3 ${i < Math.floor(product.rating) ? "text-amber-400" : "text-gray-100"}`} fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>

        <h4 className="text-xs font-medium text-gray-700 line-clamp-2 mb-2 min-h-[2rem] group-hover/card:text-pink-600 transition-colors duration-300">
          {product.name}
        </h4>

        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-1">
            <span className="text-sm font-bold text-pink-500">
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
            className={`w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300 ${
              added
                ? "bg-green-400 text-white scale-110"
                : product.stock === 0
                ? "bg-gray-100 text-gray-300 cursor-not-allowed"
                : "bg-pink-50 text-pink-400 hover:bg-pink-500 hover:text-white hover:scale-110 active:scale-90"
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
    <section className="py-12 md:py-16 bg-gradient-to-b from-white via-pink-50/10 to-white relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Explore por <span className="text-pink-500">categoria</span>
          </h2>
          <p className="text-sm text-gray-400">
            Passe o mouse e descubra nossos produtos
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {categoryData.map((cat) => (
            <button
              key={cat.id}
              onMouseEnter={() => setActiveCategory(cat.id)}
              onClick={() => setActiveCategory(cat.id)}
              className={`relative px-4 py-2 rounded-full text-xs font-medium transition-all duration-400 ${
                activeCategory === cat.id
                  ? `${cat.bgActive} text-white shadow-md shadow-pink-200/40`
                  : "bg-white text-gray-400 hover:text-pink-500 hover:bg-pink-50/50 border border-pink-100/40"
              }`}
            >
              <span className="flex items-center gap-1.5">
                <span className={`transition-transform duration-300 ${activeCategory === cat.id ? "scale-110" : ""}`}>
                  {cat.icon}
                </span>
                {cat.label}
              </span>
            </button>
          ))}
        </div>

        <div key={activeCategory} className="animate-fade-in">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2.5">
              <span className="text-lg">{activeCat.icon}</span>
              <div>
                <h3 className={`text-base font-semibold ${activeCat.textColor}`}>
                  {activeCat.label}
                </h3>
                <p className="text-xs text-gray-400">{activeCat.description}</p>
              </div>
            </div>
            <Link
              href={`/produtos?category=${activeCat.id}`}
              className="text-xs text-pink-400 font-medium hover:text-pink-500 transition-colors flex items-center gap-1"
            >
              Ver todos
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
            {categoryProducts.map((product, index) => (
              <div
                key={product.id}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 60}ms`, animationFillMode: "both" }}
              >
                <MiniProductCard product={product} />
              </div>
            ))}
          </div>

          {categoryProducts.length === 0 && (
            <div className="text-center py-10 animate-fade-in">
              <p className="text-sm text-gray-300">Nenhum produto nesta categoria ainda</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

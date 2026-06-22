"use client";

import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/lib/products";
import { useCart } from "@/lib/cart";
import { useState } from "react";

export default function ProductCard({ product }: { product: Product }) {
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
    <Link href={`/produtos/${product.id}`} className="group block">
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg hover:shadow-gray-100/50 transition-all duration-500 hover:-translate-y-1">
        <div className="relative aspect-square bg-gray-50/50 p-4 overflow-hidden">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-contain p-1 group-hover:scale-105 transition-transform duration-700 ease-out"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />

          {discount > 0 && (
            <span className="absolute top-2.5 left-2.5 bg-gray-900 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
              -{discount}%
            </span>
          )}

          {product.stock <= 5 && product.stock > 0 && (
            <span className="absolute top-2.5 right-2.5 bg-amber-50 text-amber-600 text-[10px] font-medium px-2 py-0.5 rounded-full border border-amber-100">
              Últimas {product.stock}
            </span>
          )}
        </div>

        <div className="p-3.5">
          <div className="flex items-center gap-0.5 mb-1.5">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className={`w-3 h-3 ${i < Math.floor(product.rating) ? "text-amber-400" : "text-gray-100"}`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>

          <h3 className="text-xs font-medium text-gray-700 line-clamp-2 mb-2 group-hover:text-gray-900 transition-colors duration-300 min-h-[2rem]">
            {product.name}
          </h3>

          <div className="flex items-center justify-between">
            <div className="flex items-baseline gap-1.5">
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
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 min-w-[36px] min-h-[36px] ${
                added
                  ? "bg-green-500 text-white scale-110"
                  : product.stock === 0
                  ? "bg-gray-100 text-gray-300 cursor-not-allowed"
                  : "bg-gray-900 text-white hover:bg-gray-800 active:scale-90"
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
    </Link>
  );
}

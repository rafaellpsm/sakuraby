"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/lib/cart";

export default function CarrinhoPage() {
  const { items, removeItem, updateQuantity, total, itemCount } = useCart();

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-gradient-to-b from-pink-50/30 to-white">
        <div className="text-center px-4">
          <div className="text-6xl mb-4">🛒</div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Seu carrinho está vazio</h2>
          <p className="text-gray-500 mb-6">Adicione produtos incríveis ao seu carrinho!</p>
          <Link
            href="/produtos"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-semibold rounded-full hover:from-pink-600 hover:to-rose-600 transition-all duration-300"
          >
            Ver produtos
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-pink-50/30 to-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Meu <span className="bg-gradient-to-r from-pink-500 to-fuchsia-500 bg-clip-text text-transparent">Carrinho</span>
        </h1>
        <p className="text-gray-500 mb-8">{itemCount} {itemCount === 1 ? "item" : "itens"}</p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {items.map(({ product, quantity }) => (
              <div key={product.id} className="bg-white rounded-2xl border border-pink-100 p-4 md:p-6 flex gap-4 items-center hover:shadow-md transition-shadow">
                <Link href={`/produtos/${product.id}`} className="shrink-0">
                  <div className="relative w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-pink-50 to-rose-50 rounded-xl overflow-hidden">
                    <Image src={product.image} alt={product.name} fill className="object-contain p-2" sizes="96px" />
                  </div>
                </Link>

                <div className="flex-1 min-w-0">
                  <Link href={`/produtos/${product.id}`} className="text-sm font-medium text-gray-800 hover:text-pink-600 transition-colors line-clamp-2 block">
                    {product.name}
                  </Link>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-base font-bold text-pink-600">
                      R$ {(product.price * quantity).toFixed(2).replace(".", ",")}
                    </span>
                    {quantity > 1 && (
                      <span className="text-xs text-gray-400">
                        (R$ {product.price.toFixed(2).replace(".", ",")} cada)
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center border border-pink-200 rounded-xl overflow-hidden shrink-0">
                  <button
                    onClick={() => updateQuantity(product.id, quantity - 1)}
                    className="w-8 h-8 flex items-center justify-center hover:bg-pink-50 transition-colors text-gray-600"
                  >
                    −
                  </button>
                  <span className="w-8 text-center text-sm font-medium text-gray-800">{quantity}</span>
                  <button
                    onClick={() => updateQuantity(product.id, quantity + 1)}
                    disabled={quantity >= product.stock}
                    className="w-8 h-8 flex items-center justify-center hover:bg-pink-50 transition-colors text-gray-600 disabled:opacity-30"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={() => removeItem(product.id)}
                  className="p-2 rounded-full hover:bg-red-50 transition-colors shrink-0"
                  title="Remover"
                >
                  <svg className="w-4 h-4 text-gray-400 hover:text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            ))}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-pink-100 p-6 sticky top-24">
              <h3 className="font-semibold text-gray-800 mb-4">Resumo do pedido</h3>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Subtotal ({itemCount} {itemCount === 1 ? "item" : "itens"})</span>
                  <span className="font-medium text-gray-800">R$ {total.toFixed(2).replace(".", ",")}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Frete</span>
                  <span className="text-pink-500 font-medium">
                    {total >= 199.90 ? "Grátis" : "Calculado no checkout"}
                  </span>
                </div>
                <div className="border-t border-pink-100 pt-3 flex justify-between">
                  <span className="font-semibold text-gray-800">Total</span>
                  <span className="text-xl font-bold text-pink-600">R$ {total.toFixed(2).replace(".", ",")}</span>
                </div>
              </div>

              {total < 199.90 && (
                <div className="bg-pink-50 rounded-xl p-3 mb-4 text-center">
                  <p className="text-xs text-pink-600">
                    Falta <strong>R$ {(199.90 - total).toFixed(2).replace(".", ",")}</strong> para frete grátis!
                  </p>
                  <div className="w-full bg-pink-100 rounded-full h-2 mt-2">
                    <div
                      className="bg-gradient-to-r from-pink-400 to-rose-400 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, (total / 199.90) * 100)}%` }}
                    />
                  </div>
                </div>
              )}

              <Link
                href="/checkout"
                className="block w-full py-3.5 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-semibold rounded-xl text-center hover:from-pink-600 hover:to-rose-600 transition-all duration-300 shadow-lg shadow-pink-200"
              >
                Finalizar compra
              </Link>

              <Link
                href="/produtos"
                className="block w-full py-3 text-center text-sm text-pink-500 hover:text-pink-600 font-medium mt-3"
              >
                Continuar comprando
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

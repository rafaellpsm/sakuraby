"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function PedidoConfirmadoContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("id");

  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-gradient-to-b from-pink-50/30 to-white px-4">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
          <svg className="w-10 h-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
          Pedido realizado! 🎉
        </h1>

        <p className="text-gray-500 mb-2">
          Seu pedido foi registrado com sucesso.
        </p>

        {orderId && (
          <p className="text-sm text-gray-400 mb-6">
            Número do pedido: <span className="font-mono text-gray-600">#{orderId.slice(0, 8).toUpperCase()}</span>
          </p>
        )}

        <p className="text-sm text-gray-500 mb-8 bg-pink-50 rounded-xl p-4">
          Você receberá um e-mail com os detalhes do pedido e as instruções de pagamento via Mercado Pago.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/produtos"
            className="px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-semibold rounded-full hover:from-pink-600 hover:to-rose-600 transition-all"
          >
            Continuar comprando
          </Link>
          <Link
            href="/"
            className="px-6 py-3 border border-pink-200 text-pink-600 font-medium rounded-full hover:bg-pink-50 transition-all"
          >
            Voltar ao início
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function PedidoConfirmadoPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-pink-300 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <PedidoConfirmadoContent />
    </Suspense>
  );
}

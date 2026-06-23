"use client";

import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { getProductById, products, type Product } from "@/lib/products";
import { useCart } from "@/lib/cart";
import ProductCard from "@/components/ProductCard";

export default function ProductDetailPage() {
  const params = useParams();
  const hardcodedProduct = getProductById(params.id as string);
  const [product, setProduct] = useState<Product | undefined>(hardcodedProduct);
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await fetch(`/api/products/${params.id}`);
        if (res.ok) {
          const data = await res.json();
          setProduct(data);
        }
      } catch {
        // keep hardcoded product
      }
    }
    fetchProduct();
  }, [params.id]);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4">😿</div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Produto não encontrado</h2>
          <Link href="/produtos" className="text-pink-500 hover:text-pink-600 font-medium">
            ← Voltar aos produtos
          </Link>
        </div>
      </div>
    );
  }

  const allImages = [product.image, ...(product.images || [])].filter(Boolean);
  const currentImage = allImages[selectedImage] || product.image;

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const relatedProducts = products
    .filter(p => p.id !== product.id && (p.category === product.category || p.tags.some(t => product.tags.includes(t))))
    .slice(0, 4);

  const handleAdd = () => {
    addItem(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="bg-gradient-to-b from-pink-50/30 to-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 md:py-10">
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-pink-500 transition-colors">Início</Link>
          <span>/</span>
          <Link href="/produtos" className="hover:text-pink-500 transition-colors">Produtos</Link>
          <span>/</span>
          <span className="text-gray-800 truncate">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 mb-16">
          <div className="space-y-3">
            <div className="relative aspect-square bg-gradient-to-br from-pink-50 to-rose-50 rounded-3xl overflow-hidden">
              <Image
                src={currentImage}
                alt={product.name}
                fill
                className="object-contain p-8 transition-all duration-300"
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              {discount > 0 && (
                <span className="absolute top-4 left-4 bg-gradient-to-r from-pink-500 to-rose-500 text-white text-sm font-bold px-3 py-1.5 rounded-full shadow-md">
                  -{discount}%
                </span>
              )}
            </div>

            {allImages.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {allImages.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative w-16 h-16 md:w-20 md:h-20 rounded-xl overflow-hidden border-2 flex-shrink-0 transition-all duration-200 ${
                      selectedImage === index
                        ? "border-pink-500 shadow-md shadow-pink-200"
                        : "border-gray-200 hover:border-pink-300"
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`${product.name} ${index + 1}`}
                      fill
                      className="object-contain p-1"
                      sizes="80px"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-3">
              <span className="px-2.5 py-1 bg-pink-100 text-pink-600 text-xs font-medium rounded-full">
                {product.category}
              </span>
              {product.stock <= 5 && product.stock > 0 && (
                <span className="px-2.5 py-1 bg-amber-100 text-amber-700 text-xs font-medium rounded-full">
                  Últimas {product.stock} unidades
                </span>
              )}
            </div>

            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 leading-tight">
              {product.name}
            </h1>

            <div className="flex items-center gap-2 mb-4">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className={`w-4 h-4 ${i < Math.floor(product.rating) ? "text-amber-400" : "text-gray-200"}`} fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-sm text-gray-500">{product.rating} ({product.reviews} avaliações)</span>
            </div>

            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-3xl font-bold text-pink-600">
                R$ {product.price.toFixed(2).replace(".", ",")}
              </span>
              {product.originalPrice && (
                <span className="text-lg text-gray-400 line-through">
                  R$ {product.originalPrice.toFixed(2).replace(".", ",")}
                </span>
              )}
            </div>

            <p className="text-gray-600 leading-relaxed mb-6">
              {product.description}
            </p>

            <div className="flex flex-wrap gap-2 mb-6">
              {product.tags.map(tag => (
                <span key={tag} className="px-2.5 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                  #{tag}
                </span>
              ))}
            </div>

            <div className="mt-auto space-y-4">
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600">Quantidade:</span>
                <div className="flex items-center border border-pink-200 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="w-10 h-10 flex items-center justify-center hover:bg-pink-50 transition-colors"
                  >
                    −
                  </button>
                  <span className="w-12 text-center font-medium text-gray-800">{quantity}</span>
                  <button
                    onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                    className="w-10 h-10 flex items-center justify-center hover:bg-pink-50 transition-colors"
                  >
                    +
                  </button>
                </div>
                <span className="text-sm text-gray-400">({product.stock} disponíveis)</span>
              </div>

              <button
                onClick={handleAdd}
                disabled={product.stock === 0}
                className={`w-full py-4 rounded-2xl text-base font-semibold transition-all duration-300 ${
                  added
                    ? "bg-green-500 text-white"
                    : product.stock === 0
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-pink-500 to-rose-500 text-white hover:from-pink-600 hover:to-rose-600 hover:shadow-xl hover:shadow-pink-200 active:scale-[0.98]"
                }`}
              >
                {added ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Adicionado ao carrinho!
                  </span>
                ) : product.stock === 0 ? (
                  "Produto esgotado"
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    Adicionar ao carrinho
                  </span>
                )}
              </button>

              <div className="flex items-center gap-6 text-sm text-gray-500">
                <div className="flex items-center gap-1.5">
                  <svg className="w-4 h-4 text-pink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  Compra segura
                </div>
                <div className="flex items-center gap-1.5">
                  <svg className="w-4 h-4 text-pink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                  </svg>
                  Frete grátis acima de R$199
                </div>
              </div>
            </div>
          </div>
        </div>

        {relatedProducts.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Você também pode <span className="bg-gradient-to-r from-pink-500 to-fuchsia-500 bg-clip-text text-transparent">gostar</span>
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {relatedProducts.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/lib/auth";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  images?: string[];
  category: string;
  stock: number;
  rating: number;
  reviews: number;
  featured: boolean;
  tags: string[];
}

const categories = ["Hidratantes", "Limpeza", "Sérums", "Olhos", "Cabelos", "Tratamento"];

const emptyProduct: Product = {
  id: "",
  name: "",
  description: "",
  price: 0,
  originalPrice: undefined,
  image: "",
  images: [],
  category: "Hidratantes",
  stock: 0,
  rating: 0,
  reviews: 0,
  featured: false,
  tags: [],
};

export default function AdminProdutos() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [form, setForm] = useState<Product>(emptyProduct);
  const [tagInput, setTagInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [seeding, setSeeding] = useState(false);

  const fetchProducts = useCallback(async () => {
    const token = localStorage.getItem("sakuraby-token");
    const res = await fetch("/api/admin/products", {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      const data = await res.json();
      setProducts(data.products);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (authLoading) return;
    if (!user?.isAdmin) {
      router.push("/");
      return;
    }
    fetchProducts();
  }, [user, authLoading, router, fetchProducts]);

  const handleSeed = async () => {
    if (!confirm("Isso vai cadastrar todos os produtos existentes no banco de dados. Continuar?")) return;

    setSeeding(true);
    setMessage("");
    const token = localStorage.getItem("sakuraby-token");
    const res = await fetch("/api/admin/products/seed", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.ok) {
      const data = await res.json();
      setMessage(data.message);
      fetchProducts();
    } else {
      setMessage("Erro ao cadastrar produtos");
    }
    setSeeding(false);
  };

  const handleSave = async () => {
    if (!form.name || !form.price || !form.category) {
      setMessage("Preencha nome, preço e categoria");
      return;
    }

    setSaving(true);
    setMessage("");
    const token = localStorage.getItem("sakuraby-token");
    const res = await fetch("/api/admin/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      setMessage("Produto salvo com sucesso!");
      setShowForm(false);
      setEditingProduct(null);
      setForm(emptyProduct);
      fetchProducts();
    } else {
      setMessage("Erro ao salvar produto");
    }
    setSaving(false);
  };

  const handleDelete = async (productId: string) => {
    if (!confirm("Tem certeza que deseja excluir este produto?")) return;

    const token = localStorage.getItem("sakuraby-token");
    const res = await fetch(`/api/admin/products?id=${productId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.ok) {
      setMessage("Produto excluído!");
      fetchProducts();
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setForm({ ...product });
    setShowForm(true);
    setMessage("");
  };

  const addTag = () => {
    if (tagInput.trim() && !form.tags.includes(tagInput.trim())) {
      setForm({ ...form, tags: [...form.tags, tagInput.trim()] });
      setTagInput("");
    }
  };

  const removeTag = (tag: string) => {
    setForm({ ...form, tags: form.tags.filter((t) => t !== tag) });
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-gray-300 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user?.isAdmin) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🌸</span>
            <span className="text-lg font-bold text-gray-900">Admin SakuraBy</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/admin" className="text-sm text-gray-600 hover:text-gray-900 font-medium">
              Dashboard
            </Link>
            <Link href="/admin/pedidos" className="text-sm text-gray-600 hover:text-gray-900 font-medium">
              Pedidos
            </Link>
            <Link href="/" className="text-sm text-gray-600 hover:text-gray-900 font-medium">
              Ver Loja
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Produtos</h1>
          <div className="flex gap-2">
            {products.length === 0 && (
              <button
                onClick={handleSeed}
                disabled={seeding}
                className="px-5 py-2.5 bg-white border border-gray-200 text-gray-700 text-sm font-medium rounded-full hover:bg-gray-50 transition-all min-h-[44px] disabled:opacity-50"
              >
                {seeding ? "Cadastrando..." : "Cadastrar produtos existentes"}
              </button>
            )}
            <button
              onClick={() => {
                setEditingProduct(null);
                setForm(emptyProduct);
                setShowForm(true);
                setMessage("");
              }}
              className="px-5 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-full hover:bg-gray-800 transition-all min-h-[44px]"
            >
              + Novo Produto
            </button>
          </div>
        </div>

        {message && (
          <div className={`mb-4 p-3 rounded-xl text-sm ${message.includes("sucesso") || message.includes("excluído") ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
            {message}
          </div>
        )}

        {showForm && (
          <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              {editingProduct ? "Editar Produto" : "Novo Produto"}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Nome *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400 min-h-[44px]"
                  placeholder="Nome do produto"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Categoria *</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400 min-h-[44px]"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-gray-500 mb-1">Descrição</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400 min-h-[80px] resize-none"
                  placeholder="Descrição do produto"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Preço (R$) *</label>
                <input
                  type="number"
                  step="0.01"
                  value={form.price || ""}
                  onChange={(e) => setForm({ ...form, price: parseFloat(e.target.value) || 0 })}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400 min-h-[44px]"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Preço Original (R$)</label>
                <input
                  type="number"
                  step="0.01"
                  value={form.originalPrice || ""}
                  onChange={(e) => setForm({ ...form, originalPrice: parseFloat(e.target.value) || undefined })}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400 min-h-[44px]"
                  placeholder="Opcional"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Imagem Principal</label>
                <input
                  type="text"
                  value={form.image}
                  onChange={(e) => setForm({ ...form, image: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400 min-h-[44px]"
                  placeholder="/images/produtos/arquivo.webp"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-gray-500 mb-1">Imagens Adicionais (uma URL por linha)</label>
                <textarea
                  value={(form.images || []).join("\n")}
                  onChange={(e) => setForm({ ...form, images: e.target.value.split("\n").filter(u => u.trim()) })}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400 min-h-[80px] resize-none font-mono text-xs"
                  placeholder="/images/produtos/foto2.webp&#10;/images/produtos/foto3.webp"
                  rows={3}
                />
                <p className="text-[10px] text-gray-400 mt-1">Adicione URLs adicionais para criar uma galeria no produto</p>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Estoque</label>
                <input
                  type="number"
                  value={form.stock || ""}
                  onChange={(e) => setForm({ ...form, stock: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400 min-h-[44px]"
                  placeholder="0"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Avaliação (0-5)</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="5"
                  value={form.rating || ""}
                  onChange={(e) => setForm({ ...form, rating: parseFloat(e.target.value) || 0 })}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400 min-h-[44px]"
                  placeholder="4.5"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Avaliações (qtd)</label>
                <input
                  type="number"
                  value={form.reviews || ""}
                  onChange={(e) => setForm({ ...form, reviews: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400 min-h-[44px]"
                  placeholder="0"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-gray-500 mb-1">Tags</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                    className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400 min-h-[44px]"
                    placeholder="Digite uma tag e pressione Enter"
                  />
                  <button
                    type="button"
                    onClick={addTag}
                    className="px-4 py-2.5 bg-gray-100 text-gray-600 text-sm font-medium rounded-xl hover:bg-gray-200 transition-all min-h-[44px]"
                  >
                    Adicionar
                  </button>
                </div>
                {form.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {form.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                      >
                        {tag}
                        <button onClick={() => removeTag(tag)} className="text-gray-400 hover:text-gray-600">×</button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.featured}
                    onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                    className="w-4 h-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900"
                  />
                  <span className="text-sm text-gray-600">Produto em destaque</span>
                </label>
              </div>
            </div>

            {form.image && (
              <div className="mt-4">
                <label className="block text-xs font-medium text-gray-500 mb-2">Preview</label>
                <div className="flex flex-wrap gap-2">
                  <div className="w-20 h-20 bg-gray-50 rounded-lg overflow-hidden border border-gray-200">
                    <Image
                      src={form.image}
                      alt="Principal"
                      width={80}
                      height={80}
                      className="w-full h-full object-contain"
                      unoptimized
                    />
                  </div>
                  {(form.images || []).map((img, i) => (
                    <div key={i} className="w-20 h-20 bg-gray-50 rounded-lg overflow-hidden border border-gray-200">
                      <Image
                        src={img}
                        alt={`Extra ${i + 1}`}
                        width={80}
                        height={80}
                        className="w-full h-full object-contain"
                        unoptimized
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-6 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-full hover:bg-gray-800 transition-all disabled:opacity-50 min-h-[44px]"
              >
                {saving ? "Salvando..." : "Salvar Produto"}
              </button>
              <button
                onClick={() => {
                  setShowForm(false);
                  setEditingProduct(null);
                  setForm(emptyProduct);
                }}
                className="px-6 py-2.5 text-gray-500 text-sm font-medium rounded-full hover:bg-gray-100 transition-all min-h-[44px]"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}

        {products.length === 0 ? (
          <div className="text-center py-16">
            <span className="text-4xl mb-4 block">📦</span>
            <p className="text-gray-500">Nenhum produto cadastrado ainda</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Produto</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Categoria</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Preço</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Estoque</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                            {product.image && (
                              <Image
                                src={product.image}
                                alt={product.name}
                                width={40}
                                height={40}
                                className="w-full h-full object-contain"
                                unoptimized
                              />
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate max-w-[200px]">{product.name}</p>
                            {product.featured && (
                              <span className="text-[10px] text-pink-500 font-medium">Destaque</span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs text-gray-500">{product.category}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div>
                          <span className="text-sm font-medium text-gray-900">R$ {product.price.toFixed(2).replace(".", ",")}</span>
                          {product.originalPrice && (
                            <span className="text-[10px] text-gray-400 line-through ml-1">
                              R$ {product.originalPrice.toFixed(2).replace(".", ",")}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-medium ${product.stock <= 5 ? "text-amber-600" : "text-gray-600"}`}>
                          {product.stock} un.
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEdit(product)}
                            className="px-3 py-1.5 text-xs text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="px-3 py-1.5 text-xs text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all"
                          >
                            Excluir
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

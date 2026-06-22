"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

function RedefinirSenhaForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  if (!token) {
    return (
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-red-50 rounded-full flex items-center justify-center">
          <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <p className="text-sm text-gray-600 mb-4">Link inválido ou expirado</p>
        <Link
          href="/esqueci-senha"
          className="inline-flex items-center justify-center w-full py-3 bg-gray-900 text-white text-sm font-medium rounded-xl hover:bg-gray-800 transition-all min-h-[44px]"
        >
          Solicitar novo link
        </Link>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password !== confirmPassword) {
      setError("As senhas não coincidem");
      return;
    }

    if (password.length < 6) {
      setError("A senha deve ter no mínimo 6 caracteres");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reset", token, password }),
      });
      const data = await res.json();

      if (data.success) {
        setSuccess("Senha redefinida com sucesso!");
        setTimeout(() => router.push("/login"), 2000);
      } else {
        setError(data.error || "Erro ao redefinir senha");
      }
    } catch {
      setError("Erro ao conectar ao servidor");
    }
    setLoading(false);
  };

  if (success) {
    return (
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-green-50 rounded-full flex items-center justify-center">
          <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <p className="text-sm text-gray-600 mb-4">{success}</p>
        <p className="text-xs text-gray-400">Redirecionando para o login...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 text-red-600 text-sm p-3 rounded-xl">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-600 mb-1">Nova senha</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400 min-h-[44px]"
          placeholder="Mínimo 6 caracteres"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-600 mb-1">Confirmar senha</label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400 min-h-[44px]"
          placeholder="Repita a senha"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 bg-gray-900 text-white text-sm font-medium rounded-xl hover:bg-gray-800 transition-all disabled:opacity-50 min-h-[44px]"
      >
        {loading ? "Redefinindo..." : "Redefinir senha"}
      </button>

      <Link
        href="/login"
        className="block text-center text-sm text-gray-500 hover:text-gray-900 transition-colors"
      >
        Voltar ao login
      </Link>
    </form>
  );
}

export default function RedefinirSenhaPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <span className="text-3xl">🌸</span>
            <span className="text-2xl font-bold text-gray-900">
              Sakura<span className="text-pink-500">By</span>
            </span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Redefinir senha</h1>
          <p className="text-gray-500 text-sm mt-1">Digite sua nova senha</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8">
          <Suspense fallback={
            <div className="text-center py-8">
              <div className="w-8 h-8 border-3 border-gray-300 border-t-transparent rounded-full animate-spin mx-auto" />
            </div>
          }>
            <RedefinirSenhaForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

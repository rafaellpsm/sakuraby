"use client";

import { useState } from "react";
import Link from "next/link";

export default function EsqueciSenhaPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [resetUrl, setResetUrl] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setResetUrl("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "request", email }),
      });
      const data = await res.json();

      if (data.success) {
        setSuccess(data.message);
        // For development: show the reset link directly
        if (data.resetUrl) {
          setResetUrl(data.resetUrl);
        }
      } else {
        setError(data.error || "Erro ao solicitar redefinição");
      }
    } catch {
      setError("Erro ao conectar ao servidor");
    }
    setLoading(false);
  };

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
          <h1 className="text-2xl font-bold text-gray-900">Esqueceu a senha?</h1>
          <p className="text-gray-500 text-sm mt-1">Digite seu e-mail para redefinir</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8">
          {success ? (
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-green-50 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-sm text-gray-600 mb-4">{success}</p>

              {resetUrl && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-4">
                  <p className="text-xs text-amber-700 font-medium mb-2">Link de redefinição (desenvolvimento):</p>
                  <Link
                    href={resetUrl}
                    className="text-xs text-amber-600 underline break-all hover:text-amber-700"
                  >
                    {window.location.origin}{resetUrl}
                  </Link>
                </div>
              )}

              <Link
                href="/login"
                className="inline-flex items-center justify-center w-full py-3 bg-gray-900 text-white text-sm font-medium rounded-xl hover:bg-gray-800 transition-all min-h-[44px]"
              >
                Voltar ao login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-50 text-red-600 text-sm p-3 rounded-xl">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">E-mail</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400 min-h-[44px]"
                  placeholder="seu@email.com"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gray-900 text-white text-sm font-medium rounded-xl hover:bg-gray-800 transition-all disabled:opacity-50 min-h-[44px]"
              >
                {loading ? "Enviando..." : "Enviar link de redefinição"}
              </button>

              <Link
                href="/login"
                className="block text-center text-sm text-gray-500 hover:text-gray-900 transition-colors"
              >
                Voltar ao login
              </Link>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

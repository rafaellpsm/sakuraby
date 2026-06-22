"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth";

interface UserProfile {
  phone: string;
  cpf: string;
  address: {
    cep: string;
    street: string;
    number: string;
    complement: string;
    neighborhood: string;
    city: string;
    state: string;
  };
}

const emptyProfile: UserProfile = {
  phone: "",
  cpf: "",
  address: {
    cep: "",
    street: "",
    number: "",
    complement: "",
    neighborhood: "",
    city: "",
    state: "",
  },
};

export default function PerfilPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const [profile, setProfile] = useState<UserProfile>(emptyProfile);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const fetchProfile = useCallback(async () => {
    const token = localStorage.getItem("sakuraby-token");
    const res = await fetch("/api/profile", {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      const data = await res.json();
      if (data.profile) {
        setProfile({
          phone: data.profile.phone || "",
          cpf: data.profile.cpf || "",
          address: data.profile.address || emptyProfile.address,
        });
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.push("/login");
      return;
    }
    fetchProfile();
  }, [user, authLoading, router, fetchProfile]);

  const handleSave = async () => {
    setSaving(true);
    setMessage("");
    const token = localStorage.getItem("sakuraby-token");
    const res = await fetch("/api/profile", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(profile),
    });

    if (res.ok) {
      setMessage("Perfil salvo com sucesso!");
    } else {
      setMessage("Erro ao salvar perfil");
    }
    setSaving(false);
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-gray-300 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 md:py-12">
        <div className="mb-6">
          <Link href="/" className="text-sm text-gray-400 hover:text-gray-600 transition-colors">
            ← Voltar
          </Link>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">Meu Perfil</h1>
        <p className="text-sm text-gray-500 mb-8">Suas informações pessoais e endereço de entrega</p>

        {message && (
          <div className={`mb-6 p-3 rounded-xl text-sm ${message.includes("sucesso") ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
            {message}
          </div>
        )}

        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h2 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <span className="text-lg">👤</span>
              Dados Pessoais
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Nome</label>
                <p className="text-sm text-gray-900">{user.name}</p>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">E-mail</label>
                <p className="text-sm text-gray-900">{user.email}</p>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Telefone</label>
                <input
                  type="tel"
                  value={profile.phone}
                  onChange={(e) => {
                    const raw = e.target.value.replace(/\D/g, "").slice(0, 11);
                    let formatted = raw;
                    if (raw.length > 6) formatted = `(${raw.slice(0,2)}) ${raw.slice(2,7)}-${raw.slice(7)}`;
                    else if (raw.length > 2) formatted = `(${raw.slice(0,2)}) ${raw.slice(2)}`;
                    else if (raw.length > 0) formatted = `(${raw}`;
                    setProfile({ ...profile, phone: formatted });
                  }}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400 min-h-[44px]"
                  placeholder="(11) 99999-9999"
                  maxLength={16}
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">CPF</label>
                <input
                  type="text"
                  value={profile.cpf}
                  onChange={(e) => {
                    const raw = e.target.value.replace(/\D/g, "").slice(0, 11);
                    let formatted = raw;
                    if (raw.length > 9) formatted = `${raw.slice(0,3)}.${raw.slice(3,6)}.${raw.slice(6,9)}-${raw.slice(9)}`;
                    else if (raw.length > 6) formatted = `${raw.slice(0,3)}.${raw.slice(3,6)}.${raw.slice(6)}`;
                    else if (raw.length > 3) formatted = `${raw.slice(0,3)}.${raw.slice(3)}`;
                    setProfile({ ...profile, cpf: formatted });
                  }}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400 min-h-[44px]"
                  placeholder="000.000.000-00"
                  maxLength={14}
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h2 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <span className="text-lg">📍</span>
              Endereço de Entrega
            </h2>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">CEP</label>
                  <input
                    type="text"
                    value={profile.address.cep}
                    onChange={(e) => {
                      const raw = e.target.value.replace(/\D/g, "").slice(0, 8);
                      const formatted = raw.length > 5 ? `${raw.slice(0,5)}-${raw.slice(5)}` : raw;
                      setProfile({ ...profile, address: { ...profile.address, cep: formatted } });
                    }}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400 min-h-[44px]"
                    placeholder="00000-000"
                    maxLength={9}
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-gray-500 mb-1">Rua</label>
                  <input
                    type="text"
                    value={profile.address.street}
                    onChange={(e) => setProfile({ ...profile, address: { ...profile.address, street: e.target.value } })}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400 min-h-[44px]"
                    placeholder="Rua, Avenida..."
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Número</label>
                  <input
                    type="text"
                    value={profile.address.number}
                    onChange={(e) => setProfile({ ...profile, address: { ...profile.address, number: e.target.value.replace(/\D/g, "").slice(0, 6) } })}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400 min-h-[44px]"
                    placeholder="123"
                  />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-xs font-medium text-gray-500 mb-1">Complemento</label>
                  <input
                    type="text"
                    value={profile.address.complement}
                    onChange={(e) => setProfile({ ...profile, address: { ...profile.address, complement: e.target.value } })}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400 min-h-[44px]"
                    placeholder="Apt, Bloco..."
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-gray-500 mb-1">Bairro</label>
                  <input
                    type="text"
                    value={profile.address.neighborhood}
                    onChange={(e) => setProfile({ ...profile, address: { ...profile.address, neighborhood: e.target.value } })}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400 min-h-[44px]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Cidade</label>
                  <input
                    type="text"
                    value={profile.address.city}
                    onChange={(e) => setProfile({ ...profile, address: { ...profile.address, city: e.target.value } })}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400 min-h-[44px]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Estado</label>
                  <input
                    type="text"
                    value={profile.address.state}
                    onChange={(e) => setProfile({ ...profile, address: { ...profile.address, state: e.target.value.replace(/[^a-zA-Z]/g, "").toUpperCase().slice(0, 2) } })}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400 min-h-[44px] uppercase"
                    maxLength={2}
                  />
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full py-3 bg-gray-900 text-white text-sm font-medium rounded-xl hover:bg-gray-800 transition-all disabled:opacity-50 min-h-[44px]"
          >
            {saving ? "Salvando..." : "Salvar Perfil"}
          </button>

          <p className="text-xs text-gray-400 text-center">
            Suas informações serão usadas automaticamente no checkout.
          </p>
        </div>
      </div>
    </div>
  );
}

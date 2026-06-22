"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/lib/cart";
import { useAuth } from "@/lib/auth";
import { calculateShipping, fetchAddressByCEP, type ShippingOption, type AddressInfo } from "@/lib/shipping";

type Step = "info" | "shipping" | "payment";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, total, clearCart } = useCart();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState<Step>("info");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [profileLoaded, setProfileLoaded] = useState(false);

  const [customerInfo, setCustomerInfo] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: "",
    cpf: "",
  });

  const [address, setAddress] = useState<AddressInfo | null>(null);
  const [addressForm, setAddressForm] = useState({
    cep: "",
    street: "",
    number: "",
    complement: "",
    neighborhood: "",
    city: "",
    state: "",
  });

  const [shippingOptions, setShippingOptions] = useState<ShippingOption[]>([]);
  const [selectedShipping, setSelectedShipping] = useState<ShippingOption | null>(null);
  const [loadingShipping, setLoadingShipping] = useState(false);

  // Load user profile to pre-fill checkout
  useEffect(() => {
    if (!user || profileLoaded) return;

    const loadProfile = async () => {
      const token = localStorage.getItem("sakuraby-token");
      if (!token) return;

      try {
        const res = await fetch("/api/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          if (data.profile) {
            setCustomerInfo({
              name: user.name,
              email: user.email,
              phone: data.profile.phone || "",
              cpf: data.profile.cpf || "",
            });

            if (data.profile.address) {
              setAddressForm({
                cep: data.profile.address.cep || "",
                street: data.profile.address.street || "",
                number: data.profile.address.number || "",
                complement: data.profile.address.complement || "",
                neighborhood: data.profile.address.neighborhood || "",
                city: data.profile.address.city || "",
                state: data.profile.address.state || "",
              });
            }
          }
        }
      } catch {
        // Profile load failed, continue with empty fields
      }
      setProfileLoaded(true);
    };

    loadProfile();
  }, [user, profileLoaded]);

  const handleCEPLookup = useCallback(async (cep: string) => {
    const cleanCEP = cep.replace(/\D/g, "");
    if (cleanCEP.length !== 8) return;

    setLoadingShipping(true);
    const addressInfo = await fetchAddressByCEP(cep);
    if (addressInfo) {
      setAddress(addressInfo);
      setAddressForm(prev => ({
        ...prev,
        street: addressInfo.street,
        neighborhood: addressInfo.neighborhood,
        city: addressInfo.city,
        state: addressInfo.state,
      }));
    }
    setLoadingShipping(false);
  }, []);

  useEffect(() => {
    const cleanCEP = addressForm.cep.replace(/\D/g, "");
    if (cleanCEP.length === 8) {
      handleCEPLookup(addressForm.cep);
    }
  }, [addressForm.cep, handleCEPLookup]);

  useEffect(() => {
    const cleanCEP = addressForm.cep.replace(/\D/g, "");
    if (cleanCEP.length === 8 && addressForm.number) {
      setLoadingShipping(true);
      calculateShipping(addressForm.cep, total).then(options => {
        setShippingOptions(options);
        setLoadingShipping(false);
      });
    }
  }, [addressForm.cep, addressForm.number, total]);

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-gray-50">
        <div className="text-center px-4">
          <div className="text-6xl mb-4">🛒</div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Carrinho vazio</h2>
          <Link href="/produtos" className="text-gray-900 hover:text-gray-600 font-medium">
            ← Ver produtos
          </Link>
        </div>
      </div>
    );
  }

  const steps: { id: Step; label: string; num: number }[] = [
    { id: "info", label: "Dados", num: 1 },
    { id: "shipping", label: "Frete", num: 2 },
    { id: "payment", label: "Pagamento", num: 3 },
  ];

  const subtotal = total;
  const shippingCost = selectedShipping?.price || 0;
  const finalTotal = subtotal + shippingCost;

  const handleNextStep = () => {
    if (currentStep === "info") setCurrentStep("shipping");
    else if (currentStep === "shipping") setCurrentStep("payment");
  };

  const handlePlaceOrder = async () => {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: customerInfo.name,
          customerEmail: customerInfo.email,
          customerPhone: customerInfo.phone,
          customerCPF: customerInfo.cpf,
          shippingAddress: {
            cep: addressForm.cep.replace(/\D/g, ""),
            street: addressForm.street,
            number: addressForm.number,
            complement: addressForm.complement,
            neighborhood: addressForm.neighborhood,
            city: addressForm.city,
            state: addressForm.state,
          },
          items: items.map(({ product, quantity }) => ({
            id: product.id,
            name: product.name,
            price: product.price,
            quantity,
            image: product.image,
          })),
          shippingOption: selectedShipping ? {
            name: selectedShipping.name,
            price: selectedShipping.price,
            deliveryTime: selectedShipping.deliveryTime,
          } : null,
          subtotal,
          shippingCost,
          total: finalTotal,
        }),
      });
      const data = await res.json();
      if (data.success) {
        // Save profile data for logged-in users
        if (user) {
          const token = localStorage.getItem("sakuraby-token");
          fetch("/api/profile", {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              phone: customerInfo.phone,
              cpf: customerInfo.cpf,
              address: {
                cep: addressForm.cep.replace(/\D/g, ""),
                street: addressForm.street,
                number: addressForm.number,
                complement: addressForm.complement,
                neighborhood: addressForm.neighborhood,
                city: addressForm.city,
                state: addressForm.state,
              },
            }),
          }).catch(() => {});
        }

        clearCart();
        if (data.checkoutUrl) {
          window.location.href = data.checkoutUrl;
        } else {
          router.push(`/pedido-confirmado?id=${data.orderId}`);
        }
      }
    } catch {
      alert("Erro ao processar pedido. Tente novamente.");
    }
    setIsSubmitting(false);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 md:py-12">
        <h1 className="text-2xl font-bold text-gray-900 mb-2 text-center">
          Checkout
        </h1>

        <div className="flex items-center justify-center gap-2 mb-8">
          {steps.map((step, i) => (
            <div key={step.id} className="flex items-center">
              <button
                onClick={() => {
                  if (step.num < steps.findIndex(s => s.id === currentStep) + 1) {
                    setCurrentStep(step.id);
                  }
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  currentStep === step.id
                    ? "bg-gray-900 text-white"
                    : steps.findIndex(s => s.id === currentStep) > i
                    ? "bg-gray-200 text-gray-700"
                    : "bg-gray-100 text-gray-400"
                }`}
              >
                <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold">
                  {steps.findIndex(s => s.id === currentStep) > i ? "✓" : step.num}
                </span>
                <span className="hidden sm:inline">{step.label}</span>
              </button>
              {i < steps.length - 1 && (
                <div className={`w-8 h-0.5 mx-1 ${steps.findIndex(s => s.id === currentStep) > i ? "bg-gray-300" : "bg-gray-200"}`} />
              )}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {currentStep === "info" && (
              <div className="bg-white rounded-2xl border border-gray-200 p-6 animate-fade-in">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">Dados pessoais</h2>
                  {user && (
                    <Link href="/perfil" className="text-xs text-gray-400 hover:text-gray-600 transition-colors">
                      Editar perfil →
                    </Link>
                  )}
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Nome completo *</label>
                    <input
                      type="text"
                      value={customerInfo.name}
                      onChange={e => setCustomerInfo(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400 min-h-[44px]"
                      placeholder="Seu nome"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">E-mail *</label>
                      <input
                        type="email"
                        value={customerInfo.email}
                        onChange={e => setCustomerInfo(prev => ({ ...prev, email: e.target.value }))}
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400 min-h-[44px]"
                        placeholder="seu@email.com"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Telefone *</label>
                      <input
                        type="tel"
                        value={customerInfo.phone}
                        onChange={e => {
                          const raw = e.target.value.replace(/\D/g, "").slice(0, 11);
                          let formatted = raw;
                          if (raw.length > 6) formatted = `(${raw.slice(0,2)}) ${raw.slice(2,7)}-${raw.slice(7)}`;
                          else if (raw.length > 2) formatted = `(${raw.slice(0,2)}) ${raw.slice(2)}`;
                          else if (raw.length > 0) formatted = `(${raw}`;
                          setCustomerInfo(prev => ({ ...prev, phone: formatted }));
                        }}
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400 min-h-[44px]"
                        placeholder="(11) 99999-9999"
                        maxLength={16}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">CPF *</label>
                    <input
                      type="text"
                      value={customerInfo.cpf}
                      onChange={e => {
                        const raw = e.target.value.replace(/\D/g, "").slice(0, 11);
                        let formatted = raw;
                        if (raw.length > 9) formatted = `${raw.slice(0,3)}.${raw.slice(3,6)}.${raw.slice(6,9)}-${raw.slice(9)}`;
                        else if (raw.length > 6) formatted = `${raw.slice(0,3)}.${raw.slice(3,6)}.${raw.slice(6)}`;
                        else if (raw.length > 3) formatted = `${raw.slice(0,3)}.${raw.slice(3)}`;
                        setCustomerInfo(prev => ({ ...prev, cpf: formatted }));
                      }}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400 min-h-[44px]"
                      placeholder="000.000.000-00"
                      maxLength={14}
                    />
                  </div>
                </div>
                <div className="flex justify-end mt-6">
                  <button
                    onClick={handleNextStep}
                    disabled={!customerInfo.name || !customerInfo.email || !customerInfo.phone || !customerInfo.cpf}
                    className="px-8 py-3 bg-gray-900 text-white font-medium rounded-xl hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]"
                  >
                    Continuar
                  </button>
                </div>
              </div>
            )}

            {currentStep === "shipping" && (
              <div className="bg-white rounded-2xl border border-gray-200 p-6 animate-fade-in">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">Endereço de entrega</h2>
                  {user && (
                    <Link href="/perfil" className="text-xs text-gray-400 hover:text-gray-600 transition-colors">
                      Editar endereço →
                    </Link>
                  )}
                </div>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">CEP *</label>
                      <input
                        type="text"
                        value={addressForm.cep}
                        onChange={e => {
                          const raw = e.target.value.replace(/\D/g, "").slice(0, 8);
                          const formatted = raw.length > 5 ? `${raw.slice(0,5)}-${raw.slice(5)}` : raw;
                          setAddressForm(prev => ({ ...prev, cep: formatted }));
                        }}
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400 min-h-[44px]"
                        placeholder="00000-000"
                        maxLength={9}
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-medium text-gray-500 mb-1">Rua *</label>
                      <input
                        type="text"
                        value={addressForm.street}
                        onChange={e => setAddressForm(prev => ({ ...prev, street: e.target.value }))}
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400 min-h-[44px]"
                        placeholder="Rua, Avenida..."
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Número *</label>
                      <input
                        type="text"
                        value={addressForm.number}
                        onChange={e => {
                          const raw = e.target.value.replace(/\D/g, "").slice(0, 6);
                          setAddressForm(prev => ({ ...prev, number: raw }));
                        }}
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400 min-h-[44px]"
                        placeholder="123"
                        maxLength={6}
                      />
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                      <label className="block text-xs font-medium text-gray-500 mb-1">Complemento</label>
                      <input
                        type="text"
                        value={addressForm.complement}
                        onChange={e => setAddressForm(prev => ({ ...prev, complement: e.target.value }))}
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400 min-h-[44px]"
                        placeholder="Apt, Bloco..."
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-medium text-gray-500 mb-1">Bairro *</label>
                      <input
                        type="text"
                        value={addressForm.neighborhood}
                        onChange={e => setAddressForm(prev => ({ ...prev, neighborhood: e.target.value }))}
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400 min-h-[44px]"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Cidade *</label>
                      <input
                        type="text"
                        value={addressForm.city}
                        onChange={e => setAddressForm(prev => ({ ...prev, city: e.target.value }))}
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400 min-h-[44px]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Estado *</label>
                      <input
                        type="text"
                        value={addressForm.state}
                        onChange={e => setAddressForm(prev => ({ ...prev, state: e.target.value.replace(/[^a-zA-Z]/g, "").toUpperCase().slice(0, 2) }))}
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400 min-h-[44px] uppercase"
                        maxLength={2}
                      />
                    </div>
                  </div>

                  {shippingOptions.length > 0 && (
                    <div className="mt-6">
                      <h3 className="text-sm font-semibold text-gray-900 mb-3">Opções de frete</h3>
                      <div className="space-y-2">
                        {shippingOptions.map(option => (
                          <label
                            key={option.id}
                            className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                              selectedShipping?.id === option.id
                                ? "border-gray-900 bg-gray-50"
                                : "border-gray-200 hover:border-gray-300"
                            }`}
                          >
                            <input
                              type="radio"
                              name="shipping"
                              checked={selectedShipping?.id === option.id}
                              onChange={() => setSelectedShipping(option)}
                              className="sr-only"
                            />
                            <span className="text-2xl">{option.icon}</span>
                            <div className="flex-1">
                              <span className="font-medium text-gray-900">{option.name}</span>
                              <span className="text-sm text-gray-500 ml-2">{option.carrier}</span>
                              <p className="text-xs text-gray-400 mt-0.5">{option.deliveryTime}</p>
                            </div>
                            <span className={`font-bold ${option.price === 0 ? "text-green-500" : "text-gray-900"}`}>
                              {option.price === 0 ? "Grátis" : `R$ ${option.price.toFixed(2).replace(".", ",")}`}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}

                  {loadingShipping && (
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <div className="w-4 h-4 border-2 border-gray-300 border-t-transparent rounded-full animate-spin" />
                      Calculando frete...
                    </div>
                  )}
                </div>
                <div className="flex justify-between mt-6">
                  <button
                    onClick={() => setCurrentStep("info")}
                    className="px-6 py-3 border border-gray-200 text-gray-600 font-medium rounded-xl hover:bg-gray-50 transition-all min-h-[44px]"
                  >
                    Voltar
                  </button>
                  <button
                    onClick={handleNextStep}
                    disabled={!addressForm.cep || !addressForm.number || !addressForm.city || !selectedShipping}
                    className="px-8 py-3 bg-gray-900 text-white font-medium rounded-xl hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]"
                  >
                    Continuar
                  </button>
                </div>
              </div>
            )}

            {currentStep === "payment" && (
              <div className="bg-white rounded-2xl border border-gray-200 p-6 animate-fade-in">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Pagamento</h2>
                <p className="text-sm text-gray-500 mb-6">
                  Você será redirecionado para o Mercado Pago para concluir o pagamento com segurança.
                </p>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">PIX</p>
                      <p className="text-xs text-gray-500">Aprovação instantânea</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Cartão de crédito</p>
                      <p className="text-xs text-gray-500">Até 12x sem juros</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                    <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Boleto bancário</p>
                      <p className="text-xs text-gray-500">Até 3 dias úteis para compensação</p>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 rounded-xl p-4 mb-6">
                  <div className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-green-600 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    <div>
                      <p className="text-sm font-medium text-green-800">Pagamento 100% seguro</p>
                      <p className="text-xs text-green-600">Seus dados são protegidos pelo Mercado Pago</p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between">
                  <button
                    onClick={() => setCurrentStep("shipping")}
                    className="px-6 py-3 border border-gray-200 text-gray-600 font-medium rounded-xl hover:bg-gray-50 transition-all min-h-[44px]"
                  >
                    Voltar
                  </button>
                  <button
                    onClick={handlePlaceOrder}
                    disabled={isSubmitting}
                    className="px-8 py-3 bg-gray-900 text-white font-medium rounded-xl hover:bg-gray-800 transition-all disabled:opacity-50 min-h-[44px]"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Processando...
                      </span>
                    ) : (
                      `Pagar R$ ${finalTotal.toFixed(2).replace(".", ",")}`
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-gray-200 p-6 sticky top-24">
              <h3 className="font-semibold text-gray-900 mb-4">Seu pedido</h3>
              <div className="space-y-3 mb-4">
                {items.map(({ product, quantity }) => (
                  <div key={product.id} className="flex items-center gap-3">
                    <div className="relative w-12 h-12 bg-gray-50 rounded-lg overflow-hidden shrink-0">
                      <Image src={product.image} alt={product.name} fill className="object-contain p-1" sizes="48px" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-700 line-clamp-1">{product.name}</p>
                      <p className="text-xs text-gray-400">Qtd: {quantity}</p>
                    </div>
                    <span className="text-xs font-medium text-gray-900 shrink-0">
                      R$ {(product.price * quantity).toFixed(2).replace(".", ",")}
                    </span>
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-100 pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="text-gray-900">R$ {subtotal.toFixed(2).replace(".", ",")}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Frete</span>
                  <span className={shippingCost === 0 ? "text-green-500" : "text-gray-900"}>
                    {selectedShipping ? (shippingCost === 0 ? "Grátis" : `R$ ${shippingCost.toFixed(2).replace(".", ",")}`) : "—"}
                  </span>
                </div>
                <div className="border-t border-gray-100 pt-2 flex justify-between">
                  <span className="font-semibold text-gray-900">Total</span>
                  <span className="text-lg font-bold text-gray-900">R$ {finalTotal.toFixed(2).replace(".", ",")}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

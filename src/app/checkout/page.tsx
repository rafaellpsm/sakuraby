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
      <div className="min-h-[60vh] flex items-center justify-center bg-gradient-to-b from-pink-50/30 to-white">
        <div className="text-center px-4">
          <div className="text-6xl mb-4">🛒</div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Carrinho vazio</h2>
          <Link href="/produtos" className="text-pink-500 hover:text-pink-600 font-medium">
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
    <div className="bg-gradient-to-b from-pink-50/30 to-white min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 md:py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 text-center">
          <span className="bg-gradient-to-r from-pink-500 to-fuchsia-500 bg-clip-text text-transparent">Checkout</span>
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
                    ? "bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-md"
                    : steps.findIndex(s => s.id === currentStep) > i
                    ? "bg-pink-100 text-pink-600"
                    : "bg-gray-100 text-gray-400"
                }`}
              >
                <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold">
                  {steps.findIndex(s => s.id === currentStep) > i ? "✓" : step.num}
                </span>
                <span className="hidden sm:inline">{step.label}</span>
              </button>
              {i < steps.length - 1 && (
                <div className={`w-8 h-0.5 mx-1 ${steps.findIndex(s => s.id === currentStep) > i ? "bg-pink-300" : "bg-gray-200"}`} />
              )}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {currentStep === "info" && (
              <div className="bg-white rounded-2xl border border-pink-100 p-6 animate-fade-in">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Dados pessoais</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Nome completo *</label>
                    <input
                      type="text"
                      value={customerInfo.name}
                      onChange={e => setCustomerInfo(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-4 py-3 border border-pink-200 rounded-xl text-sm"
                      placeholder="Seu nome"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">E-mail *</label>
                      <input
                        type="email"
                        value={customerInfo.email}
                        onChange={e => setCustomerInfo(prev => ({ ...prev, email: e.target.value }))}
                        className="w-full px-4 py-3 border border-pink-200 rounded-xl text-sm"
                        placeholder="seu@email.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Telefone *</label>
                      <input
                        type="tel"
                        value={customerInfo.phone}
                        onChange={e => setCustomerInfo(prev => ({ ...prev, phone: e.target.value }))}
                        className="w-full px-4 py-3 border border-pink-200 rounded-xl text-sm"
                        placeholder="(11) 99999-9999"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">CPF *</label>
                    <input
                      type="text"
                      value={customerInfo.cpf}
                      onChange={e => setCustomerInfo(prev => ({ ...prev, cpf: e.target.value }))}
                      className="w-full px-4 py-3 border border-pink-200 rounded-xl text-sm"
                      placeholder="000.000.000-00"
                      maxLength={14}
                    />
                  </div>
                </div>
                <div className="flex justify-end mt-6">
                  <button
                    onClick={handleNextStep}
                    disabled={!customerInfo.name || !customerInfo.email || !customerInfo.phone || !customerInfo.cpf}
                    className="px-8 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-semibold rounded-xl hover:from-pink-600 hover:to-rose-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Continuar
                  </button>
                </div>
              </div>
            )}

            {currentStep === "shipping" && (
              <div className="bg-white rounded-2xl border border-pink-100 p-6 animate-fade-in">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Endereço de entrega</h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">CEP *</label>
                      <input
                        type="text"
                        value={addressForm.cep}
                        onChange={e => setAddressForm(prev => ({ ...prev, cep: e.target.value }))}
                        className="w-full px-4 py-3 border border-pink-200 rounded-xl text-sm"
                        placeholder="00000-000"
                        maxLength={9}
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-gray-600 mb-1">Rua *</label>
                      <input
                        type="text"
                        value={addressForm.street}
                        onChange={e => setAddressForm(prev => ({ ...prev, street: e.target.value }))}
                        className="w-full px-4 py-3 border border-pink-200 rounded-xl text-sm"
                        placeholder="Rua, Avenida..."
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Número *</label>
                      <input
                        type="text"
                        value={addressForm.number}
                        onChange={e => setAddressForm(prev => ({ ...prev, number: e.target.value }))}
                        className="w-full px-4 py-3 border border-pink-200 rounded-xl text-sm"
                        placeholder="123"
                      />
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                      <label className="block text-sm font-medium text-gray-600 mb-1">Complemento</label>
                      <input
                        type="text"
                        value={addressForm.complement}
                        onChange={e => setAddressForm(prev => ({ ...prev, complement: e.target.value }))}
                        className="w-full px-4 py-3 border border-pink-200 rounded-xl text-sm"
                        placeholder="Apt, Bloco..."
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-gray-600 mb-1">Bairro *</label>
                      <input
                        type="text"
                        value={addressForm.neighborhood}
                        onChange={e => setAddressForm(prev => ({ ...prev, neighborhood: e.target.value }))}
                        className="w-full px-4 py-3 border border-pink-200 rounded-xl text-sm"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Cidade *</label>
                      <input
                        type="text"
                        value={addressForm.city}
                        onChange={e => setAddressForm(prev => ({ ...prev, city: e.target.value }))}
                        className="w-full px-4 py-3 border border-pink-200 rounded-xl text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Estado *</label>
                      <input
                        type="text"
                        value={addressForm.state}
                        onChange={e => setAddressForm(prev => ({ ...prev, state: e.target.value }))}
                        className="w-full px-4 py-3 border border-pink-200 rounded-xl text-sm"
                        maxLength={2}
                      />
                    </div>
                  </div>

                  {shippingOptions.length > 0 && (
                    <div className="mt-6">
                      <h3 className="text-sm font-semibold text-gray-800 mb-3">Opções de frete</h3>
                      <div className="space-y-2">
                        {shippingOptions.map(option => (
                          <label
                            key={option.id}
                            className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                              selectedShipping?.id === option.id
                                ? "border-pink-400 bg-pink-50"
                                : "border-gray-100 hover:border-pink-200"
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
                              <span className="font-medium text-gray-800">{option.name}</span>
                              <span className="text-sm text-gray-500 ml-2">{option.carrier}</span>
                              <p className="text-xs text-gray-400 mt-0.5">{option.deliveryTime}</p>
                            </div>
                            <span className={`font-bold ${option.price === 0 ? "text-green-500" : "text-gray-800"}`}>
                              {option.price === 0 ? "Grátis" : `R$ ${option.price.toFixed(2).replace(".", ",")}`}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}

                  {loadingShipping && (
                    <div className="flex items-center gap-2 text-sm text-pink-500">
                      <div className="w-4 h-4 border-2 border-pink-300 border-t-transparent rounded-full animate-spin" />
                      Calculando frete...
                    </div>
                  )}
                </div>
                <div className="flex justify-between mt-6">
                  <button
                    onClick={() => setCurrentStep("info")}
                    className="px-6 py-3 border border-pink-200 text-pink-600 font-medium rounded-xl hover:bg-pink-50 transition-all"
                  >
                    Voltar
                  </button>
                  <button
                    onClick={handleNextStep}
                    disabled={!addressForm.cep || !addressForm.number || !addressForm.city || !selectedShipping}
                    className="px-8 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-semibold rounded-xl hover:from-pink-600 hover:to-rose-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Continuar
                  </button>
                </div>
              </div>
            )}

            {currentStep === "payment" && (
              <div className="bg-white rounded-2xl border border-pink-100 p-6 animate-fade-in">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Pagamento</h2>
                <p className="text-sm text-gray-500 mb-6">
                  Você será redirecionado para o Mercado Pago para concluir o pagamento com segurança.
                </p>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3 p-4 bg-pink-50 rounded-xl">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">PIX</p>
                      <p className="text-xs text-gray-500">Aprovação instantânea</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-pink-50 rounded-xl">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">Cartão de crédito</p>
                      <p className="text-xs text-gray-500">Até 12x sem juros</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-pink-50 rounded-xl">
                    <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">Boleto bancário</p>
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
                    className="px-6 py-3 border border-pink-200 text-pink-600 font-medium rounded-xl hover:bg-pink-50 transition-all"
                  >
                    Voltar
                  </button>
                  <button
                    onClick={handlePlaceOrder}
                    disabled={isSubmitting}
                    className="px-8 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-semibold rounded-xl hover:from-pink-600 hover:to-rose-600 transition-all disabled:opacity-50 shadow-lg shadow-pink-200"
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
            <div className="bg-white rounded-2xl border border-pink-100 p-6 sticky top-24">
              <h3 className="font-semibold text-gray-800 mb-4">Seu pedido</h3>
              <div className="space-y-3 mb-4">
                {items.map(({ product, quantity }) => (
                  <div key={product.id} className="flex items-center gap-3">
                    <div className="relative w-12 h-12 bg-pink-50 rounded-lg overflow-hidden shrink-0">
                      <Image src={product.image} alt={product.name} fill className="object-contain p-1" sizes="48px" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-600 line-clamp-1">{product.name}</p>
                      <p className="text-xs text-gray-400">Qtd: {quantity}</p>
                    </div>
                    <span className="text-xs font-medium text-gray-800 shrink-0">
                      R$ {(product.price * quantity).toFixed(2).replace(".", ",")}
                    </span>
                  </div>
                ))}
              </div>
              <div className="border-t border-pink-100 pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="text-gray-800">R$ {subtotal.toFixed(2).replace(".", ",")}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Frete</span>
                  <span className={shippingCost === 0 ? "text-green-500" : "text-gray-800"}>
                    {selectedShipping ? (shippingCost === 0 ? "Grátis" : `R$ ${shippingCost.toFixed(2).replace(".", ",")}`) : "—"}
                  </span>
                </div>
                <div className="border-t border-pink-100 pt-2 flex justify-between">
                  <span className="font-semibold text-gray-800">Total</span>
                  <span className="text-lg font-bold text-pink-600">R$ {finalTotal.toFixed(2).replace(".", ",")}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

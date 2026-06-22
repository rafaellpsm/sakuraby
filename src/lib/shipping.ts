export interface ShippingOption {
  id: string;
  name: string;
  carrier: string;
  price: number;
  deliveryTime: string;
  icon: string;
}

export interface AddressInfo {
  cep: string;
  street: string;
  neighborhood: string;
  city: string;
  state: string;
}

export async function fetchAddressByCEP(cep: string): Promise<AddressInfo | null> {
  const cleanCEP = cep.replace(/\D/g, "");
  if (cleanCEP.length !== 8) return null;

  try {
    const res = await fetch(`https://viacep.com.br/ws/${cleanCEP}/json/`);
    const data = await res.json();
    if (data.erro) return null;
    return {
      cep: data.cep,
      street: data.logradouro,
      neighborhood: data.bairro,
      city: data.localidade,
      state: data.uf,
    };
  } catch {
    return null;
  }
}

export async function calculateShipping(cep: string, totalValue: number): Promise<ShippingOption[]> {
  const cleanCEP = cep.replace(/\D/g, "");
  if (cleanCEP.length !== 8) return [];

  const weight = 0.5;
  const format = "1";

  try {
    const res = await fetch(
      `https://ws.correios.com.br/calculador/CalcPrecoPrazo.aspx?nCdEmpresa=&sDsSenha=&sCepOrigem=01310100&sCepDestino=${cleanCEP}&nVlPeso=${weight}&nCdFormato=${format}&nVlComprimento=20&nVlAltura=10&nVlLargura=15&sCdMaoPropria=N&nVlValorDeclarado=0&sCdAvisoRecebimento=N&nCdServico=04510,04014,04511&nVlDiametro=0&StrRetorno=text`,
      { signal: AbortSignal.timeout(10000) }
    );
    const text = await res.text();
    const options = parseCorreiosResponse(text, totalValue);
    if (options.length > 0) return options;
  } catch {
    // Fallback to calculated options
  }

  return getFallbackShipping(totalValue);
}

function parseCorreiosResponse(xml: string, totalValue: number): ShippingOption[] {
  const options: ShippingOption[] = [];
  const services = xml.match(/<cServico>[\s\S]*?<\/cServico>/g) || [];

  for (const service of services) {
    const code = extractTag(service, "Codigo");
    const price = parseFloat(extractTag(service, "Valor").replace(",", "."));
    const days = extractTag(service, "PrazoEntrega");
    const error = extractTag(service, "Erro");

    if (error === "0" && price > 0) {
      let name = "SEDEX";
      let icon = "🚚";
      if (code === "04510") { name = "PAC"; icon = "📦"; }
      if (code === "04014") { name = "SEDEX"; icon = "⚡"; }
      if (code === "04511") { name = "SEDEX 10"; icon = "🚀"; }

      const freeThreshold = 199.90;
      const finalPrice = totalValue >= freeThreshold ? 0 : price;

      options.push({
        id: code,
        name,
        carrier: "Correios",
        price: finalPrice,
        deliveryTime: `${days} dias úteis`,
        icon,
      });
    }
  }

  return options.sort((a, b) => a.price - b.price);
}

function extractTag(xml: string, tag: string): string {
  const match = xml.match(new RegExp(`<${tag}>(.*?)<\\/${tag}>`));
  return match ? match[1].trim() : "";
}

function getFallbackShipping(totalValue: number): ShippingOption[] {
  const freeThreshold = 199.90;
  const basePAC = 15.90;
  const baseSEDEX = 24.90;

  return [
    {
      id: "pac",
      name: "PAC",
      carrier: "Correios",
      price: totalValue >= freeThreshold ? 0 : basePAC,
      deliveryTime: "7 a 10 dias úteis",
      icon: "📦",
    },
    {
      id: "sedex",
      name: "SEDEX",
      carrier: "Correios",
      price: totalValue >= freeThreshold ? 0 : baseSEDEX,
      deliveryTime: "2 a 4 dias úteis",
      icon: "⚡",
    },
  ];
}

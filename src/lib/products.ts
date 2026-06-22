export interface Product {
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
  featured?: boolean;
  tags: string[];
}

export const products: Product[] = [
  {
    id: "medicube-creme-hialuronico",
    name: "MEDICUBE Creme Hidratante com Cápsulas de Ácido Hialurônico 55g",
    description: "Creme hidratante com microcápsulas de ácido hialurônico que estouram ao toque, liberando hidratação profunda. Perfeito para todos os tipos de pele, especialmente peles desidratadas. Textura leve e refrescante.",
    price: 89.90,
    originalPrice: 119.90,
    image: "/images/produtos/MEDICUBECremeHidratanteemaCapsulasdeacidoHialurônico55g.webp",
    category: "Hidratantes",
    stock: 15,
    rating: 4.8,
    reviews: 127,
    featured: true,
    tags: ["hidratante", "ácido hialurônico", "pele seca", "k-beauty"]
  },
  {
    id: "medicube-creme-niacinamida",
    name: "MEDICUBE Creme Hidratante Facial com Cápsulas de Niacinamida e TXA 55g",
    description: "Creme multifuncional com niacinamida e ácido tranexâmico para uniformizar o tom da pele, reduzir manchas e controlar oleosidade. Cápsulas que liberam ativos de forma controlada.",
    price: 94.90,
    originalPrice: 124.90,
    image: "/images/produtos/MEDICUBECremeHidratanteFacialcomCápsulasdeNiacinamidaeTXA55g.webp",
    category: "Hidratantes",
    stock: 12,
    rating: 4.7,
    reviews: 98,
    featured: true,
    tags: ["niacinamida", "manchas", "oleosidade", "k-beauty"]
  },
  {
    id: "medicube-creme-olhos",
    name: "MEDICUBE Creme para Olhos de PDRN com Peptídeo 30ml",
    description: "Creme para contorno dos olhos com PDRN (DNA de salmão) e peptídeos anti-age. Reduz olheiras, linhas de expressão e inchaço. Textura sedosa que absorve rapidamente.",
    price: 109.90,
    originalPrice: 139.90,
    image: "/images/produtos/MEDICUBECremeparaOlhosdePdrncompeptidio30ml.webp",
    category: "Olhos",
    stock: 8,
    rating: 4.9,
    reviews: 85,
    featured: false,
    tags: ["olhos", "PDRN", "antissinais", "peptídeos"]
  },
  {
    id: "medicube-espuma-limpeza",
    name: "MEDICUBE Espuma de Limpeza Zero Poros Cápsulas de Exossomas 120g",
    description: "Espuma de limpeza ultra suave com exossomas que desobstruem poros sem ressecar. Remove impurezas, excesso de oleosidade e maquiagem de forma eficaz. pH balanceado.",
    price: 69.90,
    originalPrice: 89.90,
    image: "/images/produtos/MEDICUBEEspumadeLimpezaZeroPorosCápsulasdeExossomas120g.webp",
    category: "Limpeza",
    stock: 20,
    rating: 4.6,
    reviews: 156,
    featured: true,
    tags: ["limpeza", "poros", "exossomas", "espuma"]
  },
  {
    id: "medicube-oleo-limpeza",
    name: "MEDICUBE Óleo de Limpeza Facial Zero Poros 120ml",
    description: "Óleo de limpeza biphásico que remove maquiagem à prova d'água, protetor solar e excesso de sebo. Enriquecido com óleos vegetais que nutrem a pele durante a limpeza.",
    price: 74.90,
    originalPrice: 99.90,
    image: "/images/produtos/MEDICUBEoleodeLimpezaFacialzeroPoros120g.webp",
    category: "Limpeza",
    stock: 18,
    rating: 4.7,
    reviews: 134,
    tags: ["limpeza", "óleo", "maquiagem", "biphásico"]
  },
  {
    id: "medicube-serum-pdrn-colageno",
    name: "MEDICUBE Sérums Bubble de PDRN com Colágeno 95ml",
    description: "Sérums em formato bubble com PDRN e colágeno hidrolisado. Textura inovadora que se transforma em bolhas ao aplicar, entregando ativos de forma profunda. Firmeza e elasticidade.",
    price: 129.90,
    originalPrice: 159.90,
    image: "/images/produtos/MEDICUBESerumBubbledePDRNcomColágeno95ml.webp",
    category: "Sérums",
    stock: 10,
    rating: 4.9,
    reviews: 203,
    featured: true,
    tags: ["sérum", "PDRN", "colágeno", "firmeza"]
  },
  {
    id: "medicube-serum-egfnad",
    name: "MEDICUBE Sérums Firmador com EGF NAD 30ml",
    description: "Sérums anti-age com EGF (fator de crescimento epidérmico) e NAD+ para estimular a renovação celular. Resultados visíveis de firmeza e redução de linhas em poucas semanas.",
    price: 149.90,
    originalPrice: 189.90,
    image: "/images/produtos/MEDICUBESerumFirmadorcomEGFNAD30ml.webp",
    category: "Sérums",
    stock: 7,
    rating: 4.8,
    reviews: 76,
    tags: ["sérum", "anti-age", "EGF", "firmeza"]
  },
  {
    id: "medicube-serum-pdrn-cabelo",
    name: "MEDICUBE Sérums Fortalecedor de PDRN para Couro Cabeludo 20ml",
    description: "Sérums capilar com PDRN que fortalece os fios desde a raiz, reduzindo queda e estimulando o crescimento. Aplicador preciso para tratamento direcionado no couro cabeludo.",
    price: 79.90,
    originalPrice: 99.90,
    image: "/images/produtos/MEDICUBESerumFortalecedordePDRNparacouroCabeludo20ml.webp",
    category: "Cabelos",
    stock: 14,
    rating: 4.5,
    reviews: 62,
    tags: ["cabelo", "PDRN", "queda", "crescimento"]
  },
  {
    id: "medicube-shampoo-pdrn",
    name: "MEDICUBE Shampoo Fortalecedor e Refrescante de PDRN 400ml",
    description: "Shampoo com PDRN que limpa suavemente enquanto fortalece os fios. Fórmula refrescante que equilibra o couro cabeludo. Sem sulfatos agressivos, ideal para uso diário.",
    price: 64.90,
    originalPrice: 84.90,
    image: "/images/produtos/MEDICUBEShampooFortalecedorerefrescantedePDRN400ml.webp",
    category: "Cabelos",
    stock: 22,
    rating: 4.6,
    reviews: 89,
    tags: ["shampoo", "PDRN", "fortalecimento", "cabelo"]
  },
  {
    id: "medicube-shot-peeling",
    name: "MEDICUBE Shot Peeling Iluminador de Ácido Kójico e Cúrcuma 80ml",
    description: "Shot peeling concentrado com ácido kójico e extrato de cúrcuma para iluminar a pele e reduzir manchas. Uso 2-3 vezes por semana para resultados radiantes. Textura aquosa de rápida absorção.",
    price: 84.90,
    originalPrice: 109.90,
    image: "/images/produtos/MEDICUBEShotPeelingIluminadordeÁcidoKójicoeCúrcuma80ml.webp",
    category: "Tratamento",
    stock: 11,
    rating: 4.7,
    reviews: 113,
    featured: false,
    tags: ["peeling", "iluminador", "ácido kójico", "manchas"]
  }
];

export const categories = [
  "Todos",
  "Hidratantes",
  "Limpeza",
  "Sérums",
  "Olhos",
  "Cabelos",
  "Tratamento"
];

export function getProductById(id: string): Product | undefined {
  return products.find(p => p.id === id);
}

export function getFeaturedProducts(): Product[] {
  return products.filter(p => p.featured);
}

export function getProductsByCategory(category: string): Product[] {
  if (category === "Todos") return products;
  return products.filter(p => p.category === category);
}

export function searchProducts(query: string): Product[] {
  const lower = query.toLowerCase();
  return products.filter(p =>
    p.name.toLowerCase().includes(lower) ||
    p.description.toLowerCase().includes(lower) ||
    p.tags.some(t => t.toLowerCase().includes(lower))
  );
}

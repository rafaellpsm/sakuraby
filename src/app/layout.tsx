import type { Metadata } from "next";
import { Quicksand } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/lib/cart";
import { AuthProvider } from "@/lib/auth";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

const quicksand = Quicksand({
  variable: "--font-quicksand",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "SakuraBy | Skincare Coreano de Qualidade",
  description: "Produtos de skincare coreanos de alta qualidade. Séruns, hidratantes, limpeza e muito mais. Beleza que começa com cuidado.",
  keywords: ["skincare", "k-beauty", "coreano", "cosméticos", "beleza", "sérum", "hidratante"],
  openGraph: {
    title: "SakuraBy | Skincare Coreano de Qualidade",
    description: "Produtos de skincare coreanos de alta qualidade",
    type: "website",
    locale: "pt_BR",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${quicksand.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-white" style={{ fontFamily: "var(--font-quicksand), sans-serif" }}>
        <AuthProvider>
          <CartProvider>
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
            <WhatsAppButton />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

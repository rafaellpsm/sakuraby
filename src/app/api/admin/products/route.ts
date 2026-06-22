import { NextResponse } from "next/server";
import { verifyToken, getAllProducts, saveProduct, deleteProduct, type ProductData } from "@/lib/db";

async function checkAdmin(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return null;
  }
  const token = authHeader.split(" ")[1];
  const user = await verifyToken(token);
  if (!user || !user.isAdmin) {
    return null;
  }
  return user;
}

export async function GET() {
  try {
    const products = await getAllProducts();
    return NextResponse.json({ products });
  } catch {
    return NextResponse.json({ error: "Erro ao buscar produtos" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await checkAdmin(request);
    if (!user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const body = await request.json();
    const product: ProductData = {
      id: body.id || `product-${Date.now()}`,
      name: body.name,
      description: body.description || "",
      price: Number(body.price),
      originalPrice: body.originalPrice ? Number(body.originalPrice) : undefined,
      image: body.image || "",
      images: body.images || [],
      category: body.category,
      stock: Number(body.stock) || 0,
      rating: Number(body.rating) || 0,
      reviews: Number(body.reviews) || 0,
      featured: body.featured || false,
      tags: body.tags || [],
    };

    const success = await saveProduct(product);
    if (success) {
      return NextResponse.json({ success: true, product });
    }
    return NextResponse.json({ error: "Erro ao salvar produto" }, { status: 500 });
  } catch {
    return NextResponse.json({ error: "Erro ao processar" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const user = await checkAdmin(request);
    if (!user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const productId = searchParams.get("id");
    if (!productId) {
      return NextResponse.json({ error: "ID do produto necessário" }, { status: 400 });
    }

    const success = await deleteProduct(productId);
    if (success) {
      return NextResponse.json({ success: true });
    }
    return NextResponse.json({ error: "Erro ao deletar produto" }, { status: 500 });
  } catch {
    return NextResponse.json({ error: "Erro ao processar" }, { status: 500 });
  }
}

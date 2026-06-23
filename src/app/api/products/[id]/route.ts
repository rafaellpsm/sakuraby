import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: "Produto não encontrado" }, { status: 404 });
    }

    return NextResponse.json({
      id: data.id,
      name: data.name,
      description: data.description,
      price: Number(data.price),
      originalPrice: data.original_price ? Number(data.original_price) : undefined,
      image: data.image,
      images: data.images || [],
      category: data.category,
      stock: data.stock,
      rating: Number(data.rating),
      reviews: data.reviews,
      featured: data.featured,
      tags: data.tags || [],
    });
  } catch {
    return NextResponse.json({ error: "Erro ao buscar produto" }, { status: 500 });
  }
}

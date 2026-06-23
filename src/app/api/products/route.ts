import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: "Erro ao buscar produtos" }, { status: 500 });
    }

    const products = (data || []).map((row) => ({
      id: row.id,
      name: row.name,
      description: row.description,
      price: Number(row.price),
      originalPrice: row.original_price ? Number(row.original_price) : undefined,
      image: row.image,
      images: row.images || [],
      category: row.category,
      stock: row.stock,
      rating: Number(row.rating),
      reviews: row.reviews,
      featured: row.featured,
      tags: row.tags || [],
    }));

    return NextResponse.json({ products });
  } catch {
    return NextResponse.json({ error: "Erro ao buscar produtos" }, { status: 500 });
  }
}

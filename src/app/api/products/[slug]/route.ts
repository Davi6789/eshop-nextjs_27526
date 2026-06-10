//  src/app/api/products/[slug]/route.ts

import { supabase } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
        // Wichtig: params mit await auflösen!
    const { slug } = await params

    const { data: product, error } = await supabase
      .from("products")
      .select("*")
      .eq("slug", slug)
      .single()

    if (error || !product) {
      return NextResponse.json(
        { error: "Produkt nicht gefunden" },
        { status: 404 }
      )
    }

    //Rabattberechnung (Berechne aktuellen Preis m. Rabatt)
    const now = new Date()
    const hasDiscount = product.discount_until && 
      new Date(product.discount_until) > now && 
      product.discount_price &&
      product.discount_price < product.price
    // const productWithPrice = {
    //   ...product,
  //     current_price: hasDiscount ? product.discount_price : product.price,
  //     has_discount: hasDiscount,
  //     discount_percent: hasDiscount ? 
  //       Math.round(((product.price - product.discount_price) / product.price) * 100) : 0,
  //     discount_ends_at: product.discount_until,
  //     images: product.images || (product.image_url ? [product.image_url] : [])
  //   }

  //   return NextResponse.json(productWithPrice)
  // } catch (error) {
        
    const current_price = hasDiscount ? product.discount_price : product.price
    const discount_percent = hasDiscount 
      ? Math.round(((product.price - product.discount_price) / product.price) * 100)
      : 0

    // Füge berechnete Felder hinzu
    const productWithDetails = {
      ...product,
      current_price,
      has_discount: hasDiscount,
      discount_percent,
      discount_ends_at: product.discount_until,
      // images: product.images || (product.image_url ? [product.image_url] : [])
      images: product.image_url ? [product.image_url] : []
    }

    return NextResponse.json(productWithDetails)
  } catch (error) {
    console.error("API Error:", error)
    return NextResponse.json(
      { error: "Interner Serverfehler" },
      { status: 500 }
    )
  }
}
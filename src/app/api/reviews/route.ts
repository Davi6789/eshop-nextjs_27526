// src/app/api/reviews/route.ts

import { supabase } from "@/lib/supabase/server"
import { auth } from "@/lib/auth/config"
import { NextRequest, NextResponse } from "next/server"

// GET - Reviews für ein Produkt
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const productId = searchParams.get("productId")
  const limit = parseInt(searchParams.get("limit") || "10")
  const page = parseInt(searchParams.get("page") || "1")
  const sort = searchParams.get("sort") || "newest"

  if (!productId) {
    return NextResponse.json({ error: "Product ID required" }, { status: 400 })
  }

  let query = supabase
    .from("reviews")
    .select(`
      *,
      users (
        name, email,
        avatar_url
      )
    `)
    .eq("product_id", productId)
    .eq("status", "approved")

  // Sortierung
  switch (sort) {
    case "newest":
      query = query.order("created_at", { ascending: false })
      break
    case "oldest":
      query = query.order("created_at", { ascending: true })
      break
    case "highest":
      query = query.order("rating", { ascending: false })
      break
    case "lowest":
      query = query.order("rating", { ascending: true })
      break
    default:
      query = query.order("created_at", { ascending: false })
  }

  const from = (page - 1) * limit
  const to = from + limit - 1
  query = query.range(from, to)

  const { data, error, count } = await query

  if (error) {
    console.error("Reviews GET Error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({
    reviews: data || [],
    total: count || 0,
    page,
    totalPages: Math.ceil((count || 0) / limit)
  })
}

// POST - Neue Bewertung erstellen
export async function POST(request: NextRequest) {
  const session = await auth()
  
  if (!session) {
    return NextResponse.json({ error: "Nicht autorisiert" }, { status: 401 })
  }

  try {
  const body = await request.json()
  const { productId, rating, title, comment } = body

  // Validierung
  if (!productId || !rating || rating < 1 || rating > 5) {
    return NextResponse.json({ error: "Ungültige Eingabe" }, { status: 400 })
  }

  // Prüfen ob User das Produkt gekauft hat (Verified Purchase)
   // Einfachere Abfrage ohne .in() Problem
  const { data: orderItems } = await supabase
    // .from("order_items")
    // .select("order_id")
    // .eq("product_id", productId)
    // .in("order_id", 
    //   supabase
    //     .from("orders")
    //     .select("id")
    //     .eq("user_id", session.user.id)
    // )

  // const verifiedPurchase = orderItems && orderItems.length > 0
    .from("orders")
      .select("id")
      .eq("user_id", session.user.id)

    let verifiedPurchase = false
    if (orders && orders.length > 0) {
      const orderIds = orders.map(o => o.id)

      const { data: orderItems, error: itemsError } = await supabase
        .from("order_items")
        .select("product_id")
        .in("order_id", orderIds)
        .eq("product_id", productId)

      if (!itemsError && orderItems && orderItems.length > 0) {
        verifiedPurchase = true
      }
    }

  // Review speichern
  const { data, error } = await supabase
    .from("reviews")
    .insert({
      product_id: productId,
      user_id: session.user.id,
      rating,
        title: title || null,
        comment: comment || null,
      verified_purchase: verifiedPurchase,
      status: "pending" // Admin muss freigeben
    })
    .select()
    .single()

  if (error) {
      console.error("Review Insert Error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Produkt Bewertung aktualisieren
  await updateProductRating(productId)

  return NextResponse.json(data)
  } catch (error) {
    console.error("POST Error:", error)
    return NextResponse.json({ error: "Interner Serverfehler" }, { status: 500 })
  }
}

// Hilfsfunktion: Produkt Durchschnittsbewertung aktualisieren
async function updateProductRating(productId: string) {
  const { data: reviews } = await supabase
    .from("reviews")
    .select("rating")
    .eq("product_id", productId)
    .eq("status", "approved")

  if (reviews && reviews.length > 0) {
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    
    await supabase
      .from("products")
      .update({
        rating_avg: Math.round(avgRating * 10) / 10,
        rating_count: reviews.length
      })
      .eq("id", productId)
  }
}
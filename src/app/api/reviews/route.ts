// src/app/api/reviews/route.ts

 import { supabase } from "@/lib/supabase/server"
import { auth } from "@/lib/auth/config"
import { NextRequest, NextResponse } from "next/server"

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
  .select(`*`)
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
    let verifiedPurchase = false

    // Bestellungen des Users holen
    const { data: orders } = await supabase
      .from("orders")
      .select("id")
      .eq("user_id", session.user.id)

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
    const { data: newReview, error: insertError } = await supabase
      .from("reviews")
      .insert({
        product_id: productId,
        user_id: session.user.id,
        rating: rating,
        title: title || null,
        comment: comment || null,
        verified_purchase: verifiedPurchase,
        // status: "pending", // Admin muss genehmigen
        status: "approved", // Sofort sichtbar
        created_at: new Date().toISOString()
      })
      .select()
      .single()

    if (insertError) {
      console.error("Review Insert Error:", insertError)
      return NextResponse.json({ error: insertError.message }, { status: 500 })
    }

    // Produkt Bewertung aktualisieren (nur approved reviews, daher wird hier nichts aktualisiert)
    // Die Aktualisierung erfolgt wenn Admin die Review genehmigt

    return NextResponse.json({
      success: true,
      message: "Bewertung wurde gespeichert und wartet auf Freigabe",
      review: newReview
    }, { status: 201 })

  } catch (error) {
    console.error("Reviews POST Error:", error)
    return NextResponse.json({ error: "Ein Fehler ist aufgetreten" }, { status: 500 })
  }
}
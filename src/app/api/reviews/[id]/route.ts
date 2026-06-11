//  src/app/api/reviews/[id]/route.ts

import { supabase } from "@/lib/supabase/server"
import { auth } from "@/lib/auth/config"
import { NextRequest, NextResponse } from "next/server"

// PUT - Review moderieren (nur Admin)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Kein Admin-Zugriff" }, { status: 403 })
  }

  try {
    const { id } = await params
    const body = await request.json()
    const { status } = body

    if (!status || !["approved", "rejected", "pending"].includes(status)) {
      return NextResponse.json({ error: "Ungültiger Status" }, { status: 400 })
    }

    // Review Status aktualisieren
    const { data, error } = await supabase
      .from("reviews")
      .update({ status })
      .eq("id", id)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Produkt Bewertung neu berechnen
    const { data: product } = await supabase
      .from("reviews")
      .select("product_id")
      .eq("id", id)
      .single()

    if (product) {
      const { data: reviews } = await supabase
        .from("reviews")
        .select("rating")
        .eq("product_id", product.product_id)
        .eq("status", "approved")

      if (reviews && reviews.length > 0) {
        const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        
        await supabase
          .from("products")
          .update({
            rating_avg: Math.round(avgRating * 10) / 10,
            rating_count: reviews.length
          })
          .eq("id", product.product_id)
      }
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Review Update Error:", error)
    return NextResponse.json({ error: "Fehler beim Aktualisieren" }, { status: 500 })
  }
}

// DELETE - Review löschen (nur Admin)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Kein Admin-Zugriff" }, { status: 403 })
  }

  try {
    const { id } = await params

    // Produkt ID für spätere Aktualisierung holen
    const { data: review } = await supabase
      .from("reviews")
      .select("product_id")
      .eq("id", id)
      .single()

    // Review löschen
    const { error } = await supabase
      .from("reviews")
      .delete()
      .eq("id", id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Produkt Bewertung neu berechnen
    if (review) {
      const { data: reviews } = await supabase
        .from("reviews")
        .select("rating")
        .eq("product_id", review.product_id)
        .eq("status", "approved")

      if (reviews && reviews.length > 0) {
        const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        
        await supabase
          .from("products")
          .update({
            rating_avg: Math.round(avgRating * 10) / 10,
            rating_count: reviews.length
          })
          .eq("id", review.product_id)
      } else {
        // Keine Bewertungen mehr -> zurücksetzen
        await supabase
          .from("products")
          .update({
            rating_avg: 0,
            rating_count: 0
          })
          .eq("id", review.product_id)
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Review Delete Error:", error)
    return NextResponse.json({ error: "Fehler beim Löschen" }, { status: 500 })
  }
}
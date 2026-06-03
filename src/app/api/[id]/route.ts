// src/app/api/reviews/[id]/route.ts

import { supabase } from "@/lib/supabase/server";
import { auth } from "@/lib/auth/config";
import { NextResponse } from "next/server";

// PUT - Review moderieren (nur Admin)
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 1. params auflösen
    const { id } = await params
    
    // 2. Session prüfen
    const session = await auth();
    
    if (!session || session.user?.role !== "admin") {
      return NextResponse.json({ error: "Kein Admin-Zugriff" }, { status: 403 });
    }

    // 3. Request Body parsen
    const body = await request.json();
    const { status } = body;

    if (!status || !["approved", "rejected", "pending"].includes(status)) {
      return NextResponse.json({ error: "Ungültiger Status" }, { status: 400 });
    }

    // 4. Review Status aktualisieren (HIER: id statt params.id)
    const { data, error } = await supabase
      .from("reviews")
      .update({ status })
      .eq("id", id)  // ← Geändert: params.id → id
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // 5. Produkt Bewertung neu berechnen (HIER: id statt params.id)
    const { data: reviewData } = await supabase
      .from("reviews")
      .select("product_id")
      .eq("id", id)  // ← Geändert: params.id → id
      .single();

    if (reviewData) {
      const { data: reviews } = await supabase
        .from("reviews")
        .select("rating")
        .eq("product_id", reviewData.product_id)
        .eq("status", "approved");

      if (reviews && reviews.length > 0) {
        const avgRating =
          reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

        await supabase
          .from("products")
          .update({
            rating_avg: avgRating,
            rating_count: reviews.length,
          })
          .eq("id", reviewData.product_id);
      }
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Interner Serverfehler" },
      { status: 500 }
    );
  }
}

// DELETE - Review löschen (nur Admin)
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 1. params auflösen
    const { id } = await params
    
    // 2. Session prüfen
    const session = await auth();
    
    if (!session || session.user?.role !== "admin") {
      return NextResponse.json({ error: "Kein Admin-Zugriff" }, { status: 403 });
    }

    // 3. Review löschen (HIER: id statt params.id)
    const { error } = await supabase
      .from("reviews")
      .delete()
      .eq("id", id);  // ← Geändert: params.id → id

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Interner Serverfehler" },
      { status: 500 }
    );
  }
}
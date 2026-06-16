// src/app/api/admin/orders/[id]/status/route.ts

import { supabase } from "@/lib/supabase/server"
import { auth } from "@/lib/auth/config"
import { NextRequest, NextResponse } from "next/server"

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }  // ← Promise Typ
) {
  const session = await auth()
    
  // Admin-Check
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Kein Admin-Zugriff" }, { status: 403 })
  }

  try {
    const { id } = await params  // ← await params!
    const { status } = await request.json()

    // Optional: tracking_number, tracking_url, notes (falls vorhanden)
    const body = await request.json()
    const { tracking_number, tracking_url, notes } = body

    const updateData: any = { status }
    if (tracking_number !== undefined) updateData.tracking_number = tracking_number
    if (tracking_url !== undefined) updateData.tracking_url = tracking_url
    if (notes !== undefined) updateData.notes = notes

    const { data, error } = await supabase
      .from("orders")
      .update(updateData)
      .eq("id", id)  // ← HIER: id statt params.id!
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Order Update Error:", error)
    return NextResponse.json({ error: "Interner Serverfehler" }, { status: 500 })
  }
}
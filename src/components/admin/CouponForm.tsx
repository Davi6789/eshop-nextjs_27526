// src/components/admin/CouponForm.tsx 

import { supabase } from "@/lib/supabase/server"
import { auth } from "@/lib/auth/config"
import { NextRequest, NextResponse } from "next/server"

// GET - Alle Coupons
export async function GET(request: NextRequest) {
  const session = await auth()
  
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Kein Admin-Zugriff" }, { status: 403 })
  }

  const searchParams = request.nextUrl.searchParams
  const isActive = searchParams.get("isActive")
  const search = searchParams.get("search")
  const page = parseInt(searchParams.get("page") || "1")
  const limit = parseInt(searchParams.get("limit") || "20")

  let query = supabase
    .from("coupons")
    .select("*", { count: "exact" })

  if (isActive === "true") {
    query = query.eq("is_active", true)
  } else if (isActive === "false") {
    query = query.eq("is_active", false)
  }

  if (search) {
    query = query.ilike("code", `%${search}%`)
  }

  query = query.order("created_at", { ascending: false })

  const from = (page - 1) * limit
  const to = from + limit - 1
  query = query.range(from, to)

  const { data, error, count } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({
    coupons: data,
    total: count,
    page,
    totalPages: Math.ceil((count || 0) / limit)
  })
}

// POST - Neuen Coupon erstellen
export async function POST(request: NextRequest) {
  const session = await auth()
  
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Kein Admin-Zugriff" }, { status: 403 })
  }

  try {
    const body = await request.json()
    const { code, discount_type, discount_value, min_order_amount, max_discount, valid_until, usage_limit } = body

    // Prüfen ob Code bereits existiert
    const { data: existing } = await supabase
      .from("coupons")
      .select("code")
      .eq("code", code.toUpperCase())
      .single()

    if (existing) {
      return NextResponse.json({ error: "Gutscheincode existiert bereits" }, { status: 400 })
    }

    const { data, error } = await supabase
      .from("coupons")
      .insert({
        code: code.toUpperCase(),
        discount_type,
        discount_value: parseFloat(discount_value),
        min_order_amount: parseFloat(min_order_amount) || 0,
        max_discount: max_discount ? parseFloat(max_discount) : null,
        valid_until: valid_until || null,
        usage_limit: usage_limit ? parseInt(usage_limit) : null,
        is_active: true,
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: "Fehler beim Erstellen" }, { status: 500 })
  }
}

// PUT - Coupon aktualisieren
export async function PUT(request: NextRequest) {
  const session = await auth()
  
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Kein Admin-Zugriff" }, { status: 403 })
  }

  try {
    const body = await request.json()
    const { id, code, discount_type, discount_value, min_order_amount, max_discount, valid_until, usage_limit, is_active } = body

    const { data, error } = await supabase
      .from("coupons")
      .update({
        code: code.toUpperCase(),
        discount_type,
        discount_value: parseFloat(discount_value),
        min_order_amount: parseFloat(min_order_amount) || 0,
        max_discount: max_discount ? parseFloat(max_discount) : null,
        valid_until: valid_until || null,
        usage_limit: usage_limit ? parseInt(usage_limit) : null,
        is_active,
      })
      .eq("id", id)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: "Fehler beim Aktualisieren" }, { status: 500 })
  }
}

// DELETE - Coupon löschen
export async function DELETE(request: NextRequest) {
  const session = await auth()
  
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Kein Admin-Zugriff" }, { status: 403 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "ID fehlt" }, { status: 400 })
    }

    const { error } = await supabase
      .from("coupons")
      .delete()
      .eq("id", id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Fehler beim Löschen" }, { status: 500 })
  }
}
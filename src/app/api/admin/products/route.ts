 //  src/app/api/admin/products/route.ts 

 import { supabase } from "@/lib/supabase/server"
import { auth } from "@/lib/auth/config"
import { NextRequest, NextResponse } from "next/server"

// GET - Produkte Liste (mit Paginierung & Suche)
export async function GET(request: NextRequest) {
  const session = await auth()
  
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Kein Admin-Zugriff" }, { status: 403 })
  }

  const searchParams = request.nextUrl.searchParams
  const search = searchParams.get("search") || ""
  const page = parseInt(searchParams.get("page") || "1")
  const limit = parseInt(searchParams.get("limit") || "20")
  const category = searchParams.get("category") || ""

  let query = supabase
    .from("products")
    .select("*", { count: "exact" })

  if (search) {
    query = query.ilike("title", `%${search}%`)
  }

  if (category) {
    query = query.eq("category", category)
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
    products: data,
    total: count,
    page,
    totalPages: Math.ceil((count || 0) / limit)
  })
}

// POST - Neues Produkt erstellen
export async function POST(request: NextRequest) {
  const session = await auth()
  
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Kein Admin-Zugriff" }, { status: 403 })
  }

  try {
    const body = await request.json()
    const { title, slug, description, price, discount_price, discount_until, category, stock, image_url, images } = body

    // Slug generieren falls nicht vorhanden
    const finalSlug = slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-')

    const { data, error } = await supabase
      .from("products")
      .insert({
        title,
        slug: finalSlug,
        description,
        price,
        discount_price: discount_price || null,
        discount_until: discount_until || null,
        category,
        stock: stock || 0,
        image_url: image_url || null,
        images: images || [],
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

// PUT - Produkt aktualisieren
export async function PUT(request: NextRequest) {
  const session = await auth()
  
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Kein Admin-Zugriff" }, { status: 403 })
  }

  try {
    const body = await request.json()
    const { id, title, slug, description, price, discount_price, discount_until, category, stock, image_url, images } = body

    const { data, error } = await supabase
      .from("products")
      .update({
        title,
        slug,
        description,
        price,
        discount_price: discount_price || null,
        discount_until: discount_until || null,
        category,
        stock,
        image_url: image_url || null,
        images: images || [],
        updated_at: new Date().toISOString(),
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

// DELETE - Produkt löschen
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
      .from("products")
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
// src/app/api/products/route.ts

import { supabase } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
    // Cache für 60 Sekunden (ISR ähnlich)
  const response = new NextResponse()
  response.headers.set('Cache-Control', 's-maxage=60, stale-while-revalidate=300')
  
  // Filter Parameter
  // const filter = searchParams.get("filter")
  // const page = parseInt(searchParams.get("page") || "1")
  // const maxPrice = parseFloat(searchParams.get("maxPrice") || "0")
  // const sort = searchParams.get("sort") || "newest"
  // const limit = parseInt(searchParams.get("limit") || "20")
  // const category = searchParams.get('category')
  // const search = searchParams.get('search')
  // const minPrice = searchParams.get('minPrice')
  // const maxPrice = searchParams.get('maxPrice')
  // const sort = searchParams.get('sort') || 'created_at'

  const filter = searchParams.get("filter")
  const category = searchParams.get('category')
  const search = searchParams.get('search')
  const minPrice = searchParams.get('minPrice')
  const maxPrice = searchParams.get('maxPrice')
  const sort = searchParams.get('sort') || 'newest'

  // // Paginierung - NUR EINMAL definieren!
  // const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 50
  // const page = searchParams.get('page') ? parseInt(searchParams.get('page')!) : 1

  const limit = parseInt(searchParams.get('limit') || '20')
  const page = parseInt(searchParams.get('page') || '1')

  // Query starten
  let query = supabase
    .from('products')
    .select('*', { count: 'exact' })

  // Filter anwenden
  if (filter === "discount") {
    query = query.not("discount_price", "is", null)
  }
  if (category && category !== 'alle') {
    query = query.eq('category', category)
  }

  if (search) {
    query = query.ilike('title', `%${search}%`)
  }

  if (minPrice) {
    query = query.gte('price', parseFloat(minPrice))
  }

  if (maxPrice) {
    query = query.lte('price', parseFloat(maxPrice))
  }

  // Sortierung
  switch (sort) {
    case 'price_asc':
      query = query.order('price', { ascending: true })
      break
    case 'price_desc':
      query = query.order('price', { ascending: false })
      break
    case 'rating':
      query = query.order('rating_avg', { ascending: false })
      break
    case 'newest':
      query = query.order('created_at', { ascending: false })
      break
    default:
      query = query.order('created_at', { ascending: false })
  }

  // Paginierung - berechne from/to
  const from = (page - 1) * limit
  const to = from + limit - 1
  query = query.range(from, to)

  const { data, error, count } = await query

  if (error) {
    console.error('Fehler beim Laden der Produkte:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Dynamische Rabattberechnung für jedes Produkt
  const now = new Date()
  const productsWithPrice = data?.map(product => {
    const hasDiscount = product.discount_until && 
      new Date(product.discount_until) > now && 
      product.discount_price &&
      product.discount_price < product.price
    
    return {
      ...product,
      current_price: hasDiscount ? product.discount_price : product.price,
      has_discount: hasDiscount,
      discount_percent: hasDiscount ? 
        Math.round(((product.price - product.discount_price) / product.price) * 100) : 0,
      discount_ends_at: product.discount_until
    }
  })

  return NextResponse.json({
    products: productsWithPrice,
    total: count,
    page,
    limit,
    totalPages: Math.ceil((count || 0) / limit)
     }, {
    headers: {
      'Cache-Control': 's-maxage=60, stale-while-revalidate=300',
    }
  })
}
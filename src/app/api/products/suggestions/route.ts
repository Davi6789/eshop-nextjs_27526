//  src/app/api/products/suggestions/route.ts

import { supabase } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const q = searchParams.get("q") || ""

  if (q.length < 2) {
    return NextResponse.json({ suggestions: [] })
  }

  const { data, error } = await supabase
    .from("products")
    .select("title")
    .ilike("title", `%${q}%`)
    .limit(5)

  if (error) {
    return NextResponse.json({ suggestions: [] })
  }

  const suggestions = [...new Set(data.map(p => p.title))]

  return NextResponse.json({ suggestions })
}
// src/app/api/admin/users/route.ts

import { supabase } from "@/lib/supabase/server"
import { auth } from "@/lib/auth/config"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const session = await auth()
  
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Kein Admin-Zugriff" }, { status: 403 })
  }

  const searchParams = request.nextUrl.searchParams
  const search = searchParams.get("search") || ""
  const role = searchParams.get("role") || ""
  const page = parseInt(searchParams.get("page") || "1")
  const limit = parseInt(searchParams.get("limit") || "20")

  let query = supabase
    .from("users")
    .select("*", { count: "exact" })

  if (search) {
    query = query.or(`email.ilike.%${search}%,name.ilike.%${search}%`)
  }

  if (role) {
    query = query.eq("role", role)
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
    users: data,
    total: count,
    page,
    totalPages: Math.ceil((count || 0) / limit)
  })
}

export async function PATCH(request: NextRequest) {
  const session = await auth()
  
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Kein Admin-Zugriff" }, { status: 403 })
  }

  try {
    const { id, role, is_blocked } = await request.json()

    const updateData: any = {}
    if (role !== undefined) updateData.role = role
    if (is_blocked !== undefined) updateData.is_blocked = is_blocked

    const { data, error } = await supabase
      .from("users")
      .update(updateData)
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
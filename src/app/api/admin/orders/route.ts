//  src/app/api/admin/orders/route.ts

import { supabase } from "@/lib/supabase/server";
import { auth } from "@/lib/auth/config";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const session = await auth();

  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Kein Admin-Zugriff" }, { status: 403 });
  }

  const searchParams = request.nextUrl.searchParams;
  const status = searchParams.get("status");
  const search = searchParams.get("search");
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "20");
  const sortBy = searchParams.get("sortBy") || "created_at";
  const sortOrder = searchParams.get("sortOrder") || "desc";

  let query = supabase.from("orders").select(
    `
      *,
      users (
        id,
        name,
        email
      )
    `,
    { count: "exact" },
  );

  // Filter
  if (status && status !== "all") {
    query = query.eq("status", status);
  }

  if (search) {
    query = query.or(
      `order_number.ilike.%${search}%,users.name.ilike.%${search}%,users.email.ilike.%${search}%`,
    );
  }

  // Sortierung
  query = query.order(sortBy, { ascending: sortOrder === "asc" });

  // Paginierung
  const from = (page - 1) * limit;
  const to = from + limit - 1;
  query = query.range(from, to);

  const { data, error, count } = await query;

  if (error) {
    console.error("Admin Orders Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    orders: data,
    total: count,
    page,
    totalPages: Math.ceil((count || 0) / limit),
  });
}

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
  const sortBy = searchParams.get("sortBy") || "created_at"
  const sortOrder = searchParams.get("sortOrder") || "desc"
  const dateFrom = searchParams.get("dateFrom")
  const dateTo = searchParams.get("dateTo")
  const minAmount = searchParams.get("minAmount")
  const maxAmount = searchParams.get("maxAmount")

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

  // Status Filter
  if (status && status !== "all") {
    query = query.eq("status", status);
  }

  // Suchfilter (Bestellnummer, Kunde)
  if (search) {
    query = query.or(
      `order_number.ilike.%${search}%,users.name.ilike.%${search}%,users.email.ilike.%${search}%`,
    );
  }

  // Datumsfilter
  if (dateFrom) {
    query = query.gte("created_at", dateFrom)
  }
  if (dateTo) {
    query = query.lte("created_at", dateTo)
  }

  // Betragsfilter
  if (minAmount) {
    query = query.gte("total_amount", parseFloat(minAmount))
  }
  if (maxAmount) {
    query = query.lte("total_amount", parseFloat(maxAmount))
  }

  // Sortierung
  query = query.order(sortBy, { ascending: sortOrder === "asc" });

  // Paginierung
  const from = (page - 1) * limit;
  query = query.range(from, from + limit - 1);

  const { data, error, count } = await query;

  if (error) {
    console.error("Admin Orders Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Status Statistiken
  // const { data: statusStats } = await supabase
  // .rpc("get_order_status_counts")
  // .select("*")

  // Status Counts in JS berechnen  - alle Orders holen und in JS gruppieren
const { data: allOrders } = await supabase
  .from("orders")
  .select("status")

  const statusCounts: Record<string, number> = {};
  allOrders?.forEach((order: any) => {
    statusCounts[order.status] = (statusCounts[order.status] || 0) + 1;
  });

  // ✅ Return nicht vergessen!
  return NextResponse.json({
    orders: data,
    total: count,
    page,
    totalPages: Math.ceil((count || 0) / limit),
    statusCounts,
  });
}

// Bulk Status Update
export async function PATCH(request: NextRequest) {
  const session = await auth()
  
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Kein Admin-Zugriff" }, { status: 403 })
  }

  try {
    const { orderIds, status } = await request.json()

    if (!orderIds || !orderIds.length || !status) {
      return NextResponse.json({ error: "Ungültige Parameter" }, { status: 400 })
    }

    const { error } = await supabase
      .from("orders")
      .update({ status, updated_at: new Date().toISOString() })
      .in("id", orderIds)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, updatedCount: orderIds.length })
  } catch (error) {
    return NextResponse.json({ error: "Fehler beim Aktualisieren" }, { status: 500 })
  }
}
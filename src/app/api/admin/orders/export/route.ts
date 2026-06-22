 // src/app/api/admin/orders/export/route.ts 

 import { supabase } from "@/lib/supabase/server"
import { auth } from "@/lib/auth/config"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const session = await auth()
  
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Kein Admin-Zugriff" }, { status: 403 })
  }

  const searchParams = request.nextUrl.searchParams
  const status = searchParams.get("status")
  const dateFrom = searchParams.get("dateFrom")
  const dateTo = searchParams.get("dateTo")

  let query = supabase
    .from("orders")
    .select(`
      order_number,
      created_at,
      total_amount,
      status,
      payment_method,
      payment_status,
      shipping_address,
      users (name, email)
    `)

  if (status && status !== 'all') {
    query = query.eq("status", status)
  }
  if (dateFrom) {
    query = query.gte("created_at", dateFrom)
  }
  if (dateTo) {
    query = query.lte("created_at", dateTo)
  }

  const { data: orders, error } = await query.order("created_at", { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // CSV generieren
  const headers = [
    "Bestellnummer",
    "Datum",
    "Kunde",
    "Email",
    "Betrag",
    "Status",
    "Zahlungsmethode",
    "Zahlungsstatus",
    "Adresse"
  ]

  const csvRows = [headers.join(",")]
  
  orders?.forEach((order: any) => {
    const row = [
      `"${order.order_number}"`,
      `"${new Date(order.created_at).toLocaleDateString("de-DE")}"`,
      `"${order.users?.name || ""}"`,
      `"${order.users?.email || ""}"`,
      order.total_amount,
      order.status,
      order.payment_method,
      order.payment_status,
      `"${order.shipping_address.replace(/"/g, '""')}"`
    ]
    csvRows.push(row.join(","))
  })

  const csv = csvRows.join("\n")
  
  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename=orders_${new Date().toISOString().split("T")[0]}.csv`
    }
  })
}
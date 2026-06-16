 //  src/app/api/admin/stats/route.ts

 import { supabase } from "@/lib/supabase/server"
import { auth } from "@/lib/auth/config"
import { NextResponse } from "next/server"

export async function GET() {
  const session = await auth()
  
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Kein Admin-Zugriff" }, { status: 403 })
  }

  try {
    // Gesamtumsatz
    const { data: salesData } = await supabase
      .from("orders")
      .select("total_amount")
      .eq("status", "paid")

    const totalRevenue = salesData?.reduce((sum, order) => sum + order.total_amount, 0) || 0

    // Anzahl Bestellungen
    const { count: totalOrders } = await supabase
      .from("orders")
      .select("*", { count: "exact", head: true })

    // Anzahl Produkte
    const { count: totalProducts } = await supabase
      .from("products")
      .select("*", { count: "exact", head: true })

    // Anzahl Benutzer
    const { count: totalUsers } = await supabase
      .from("users")
      .select("*", { count: "exact", head: true })

    // Bestellungen letzte 30 Tage (für Chart)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const { data: recentOrders } = await supabase
      .from("orders")
      .select("created_at, total_amount")
      .gte("created_at", thirtyDaysAgo.toISOString())
      .order("created_at", { ascending: true })

    // Tägliche Umsätze für Chart
    const dailyRevenue = new Map()
    recentOrders?.forEach(order => {
      const date = new Date(order.created_at).toLocaleDateString("de-DE")
      dailyRevenue.set(date, (dailyRevenue.get(date) || 0) + order.total_amount)
    })

    const chartData = Array.from(dailyRevenue.entries()).map(([date, revenue]) => ({
      date,
      revenue
    }))

    // Kürzliche Bestellungen
    const { data: latestOrders } = await supabase
      .from("orders")
      .select(`
        id,
        order_number,
        total_amount,
        status,
        created_at,
        users (name, email)
      `)
      .order("created_at", { ascending: false })
      .limit(5)

    // Top Produkte
    const { data: topProducts } = await supabase
      .from("order_items")
      .select(`
        product_name,
        quantity,
        price
      `)
      .limit(10)

    const productSales = new Map()
    topProducts?.forEach(item => {
      productSales.set(
        item.product_name,
        (productSales.get(item.product_name) || 0) + item.quantity
      )
    })

    const topProductsList = Array.from(productSales.entries())
      .map(([name, quantity]) => ({ name, quantity }))
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5)

    return NextResponse.json({
      stats: {
        totalRevenue,
        totalOrders: totalOrders || 0,
        totalProducts: totalProducts || 0,
        totalUsers: totalUsers || 0,
        averageOrderValue: totalOrders ? totalRevenue / totalOrders : 0,
      },
      chartData,
      latestOrders,
      topProducts: topProductsList
    })
  } catch (error) {
    console.error("Stats Error:", error)
    return NextResponse.json({ error: "Fehler beim Laden der Statistiken" }, { status: 500 })
  }
}
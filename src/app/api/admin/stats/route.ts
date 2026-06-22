 //  src/app/api/admin/stats/route.ts

import { supabase } from "@/lib/supabase/server"
import { auth } from "@/lib/auth/config"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const session = await auth()
  
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Kein Admin-Zugriff" }, { status: 403 })
  }

  const searchParams = request.nextUrl.searchParams
  const period = searchParams.get("period") || "30"
  const groupBy = searchParams.get("groupBy") || "day"

  try {
    const now = new Date()
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - parseInt(period))

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


    const averageOrderValue = totalOrders ? totalRevenue / totalOrders : 0

    // 2. Monatsvergleich
    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1)
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0)

    const { data: currentMonthOrders } = await supabase
      .from("orders")
      .select("total_amount")
      .eq("status", "paid")
      .gte("created_at", currentMonthStart.toISOString())

    const { data: lastMonthOrders } = await supabase
      .from("orders")
      .select("total_amount")
      .eq("status", "paid")
      .gte("created_at", lastMonthStart.toISOString())
      .lte("created_at", lastMonthEnd.toISOString())

    const currentMonthRevenue = currentMonthOrders?.reduce((sum, o) => sum + o.total_amount, 0) || 0
    const lastMonthRevenue = lastMonthOrders?.reduce((sum, o) => sum + o.total_amount, 0) || 0
    const revenueChange = lastMonthRevenue
      ? ((currentMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100
      : 0

    // 3. Chart Daten
    const { data: ordersForChart } = await supabase
      .from("orders")
      .select("created_at, total_amount")
      .eq("status", "paid")
      .gte("created_at", startDate.toISOString())
      .order("created_at", { ascending: true })

    const chartMap = new Map<string, { revenue: number; orders: number }>()
    ordersForChart?.forEach(order => {
      const orderDate = new Date(order.created_at)
      let dateKey: string

      if (groupBy === "week") {
        dateKey = `KW ${getWeekNumber(orderDate)}`
      } else if (groupBy === "month") {
        dateKey = orderDate.toLocaleDateString("de-DE", { month: "short", year: "numeric" })
      } else {
        dateKey = orderDate.toLocaleDateString("de-DE")
      }

      const existing = chartMap.get(dateKey) || { revenue: 0, orders: 0 }
      chartMap.set(dateKey, {
        revenue: existing.revenue + order.total_amount,
        orders: existing.orders + 1
      })
    })

    const chartDataArray = Array.from(chartMap.entries()).map(([label, data]) => ({
      label,
      revenue: data.revenue,
      orders: data.orders
    }))

    // 4. Bestellstatus Verteilung — group_by nicht verfügbar → JS gruppieren
    const { data: allOrderStatuses } = await supabase
      .from("orders")
      .select("status")

    const statusData: Record<string, number> = {}
    allOrderStatuses?.forEach(order => {
      statusData[order.status] = (statusData[order.status] || 0) + 1
    })

    // 5. Top Produkte
    const { data: topProductsRaw } = await supabase
      .from("order_items")
      .select("product_name, quantity, price")

    const productSales = new Map<string, { quantity: number; revenue: number }>()
    topProductsRaw?.forEach(item => {
      const existing = productSales.get(item.product_name) || { quantity: 0, revenue: 0 }
      productSales.set(item.product_name, {
        quantity: existing.quantity + item.quantity,
        revenue: existing.revenue + item.price * item.quantity
      })
    })

    const topProducts = Array.from(productSales.entries())
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10)

    // 6. Kategorie Verteilung — group_by nicht verfügbar → JS gruppieren
    const { data: allProducts } = await supabase
      .from("products")
      .select("category")
      .not("category", "is", null)

    const categoryDistribution: Record<string, number> = {}
    allProducts?.forEach(product => {
      if (product.category) {
        categoryDistribution[product.category] = (categoryDistribution[product.category] || 0) + 1
      }
    })

    // 7. Letzte 7 Tage
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - (6 - i))
      return date.toISOString().split("T")[0]
    })

    const { data: dailyOrdersRaw } = await supabase
      .from("orders")
      .select("created_at")
      .gte("created_at", new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())

    const dailyCounts = new Map<string, number>()
    dailyOrdersRaw?.forEach(order => {
      const date = new Date(order.created_at).toISOString().split("T")[0]
      dailyCounts.set(date, (dailyCounts.get(date) || 0) + 1)
    })

    const dailyOrdersData = last7Days.map(date => ({
      date: new Date(date).toLocaleDateString("de-DE", { weekday: "short" }),
      orders: dailyCounts.get(date) || 0
    }))

    // 8. Kundenanalyse
    const { data: customerOrders } = await supabase
      .from("orders")
      .select("user_id, total_amount")
      .eq("status", "paid")

    const customerStats = new Map<string, { orders: number; spent: number }>()
    customerOrders?.forEach(order => {
      const existing = customerStats.get(order.user_id) || { orders: 0, spent: 0 }
      customerStats.set(order.user_id, {
        orders: existing.orders + 1,
        spent: existing.spent + order.total_amount
      })
    })

    const totalCustomers = customerStats.size
    const returningCustomers = Array.from(customerStats.values()).filter(c => c.orders > 1).length
    const retentionRate = totalCustomers ? (returningCustomers / totalCustomers) * 100 : 0

    // 9. Zahlungsmethoden
    const { data: paymentMethodData } = await supabase
      .from("orders")
      .select("payment_method, total_amount")
      .eq("status", "paid")

    const paymentMethodStats = new Map<string, number>()
    paymentMethodData?.forEach(order => {
      const method = order.payment_method || "unknown"
      paymentMethodStats.set(method, (paymentMethodStats.get(method) || 0) + order.total_amount)
    })

    const paymentMethodLabels: Record<string, string> = {
      paypal: "PayPal",
      bank_transfer: "Banküberweisung",
      credit_card: "Kreditkarte"
    }

    const paymentMethodBreakdown = Array.from(paymentMethodStats.entries()).map(([method, revenue]) => ({
      method: paymentMethodLabels[method] || method,
      revenue
    }))

    // Kürzliche Bestellungen
    const { data: latestOrders } = await supabase
      .from("orders")
      .select("id, order_number, total_amount, status, created_at, users (name, email)")
      .order("created_at", { ascending: false })
      .limit(5)

    return NextResponse.json({
      stats: {
        totalRevenue,
        totalOrders: totalOrders || 0,
        totalProducts: totalProducts || 0,
        totalUsers: totalUsers || 0,
        averageOrderValue,
        revenueChange
      },
      chartData: chartDataArray,
      statusDistribution: statusData,
      topProducts,
      categoryDistribution,
      dailyOrders: dailyOrdersData,
      latestOrders,
      customerAnalytics: {
        totalCustomers,
        avgSpentPerCustomer: totalCustomers ? totalRevenue / totalCustomers : 0,
        avgOrdersPerCustomer: totalCustomers ? (totalOrders || 0) / totalCustomers : 0,
        returningCustomers,
        retentionRate
      },
      paymentMethodBreakdown
    })

  } catch (error) {
    console.error("Stats Error:", error)
    return NextResponse.json({ error: "Fehler beim Laden der Statistiken" }, { status: 500 })
  }
}

function getWeekNumber(date: Date): number {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1)
  const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7)
}
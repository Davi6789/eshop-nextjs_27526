// src/app/admin/page.tsx

"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { SimpleBarChart, PieChart, LineChart } from "@/components/admin/Charts"

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalUsers: 0,
    averageOrderValue: 0,
    revenueChange: 0
  })
  const [chartData, setChartData] = useState<any[]>([])
  const [statusDistribution, setStatusDistribution] = useState<Record<string, number>>({})
  const [topProducts, setTopProducts] = useState<any[]>([])
  const [categoryDistribution, setCategoryDistribution] = useState<Record<string, number>>({})
  const [dailyOrders, setDailyOrders] = useState<any[]>([])
  const [customerAnalytics, setCustomerAnalytics] = useState<any>({})
  const [paymentMethodBreakdown, setPaymentMethodBreakdown] = useState<any[]>([])
  const [latestOrders, setLatestOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [period, setPeriod] = useState("30")
  const [groupBy, setGroupBy] = useState("day")

  useEffect(() => {
    loadStats()
  }, [period, groupBy])

  const loadStats = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/stats?period=${period}&groupBy=${groupBy}`)
      const data = await res.json()
      setStats(data.stats)
      setChartData(data.chartData || [])
      setStatusDistribution(data.statusDistribution || {})
      setTopProducts(data.topProducts || [])
      setCategoryDistribution(data.categoryDistribution || {})
      setDailyOrders(data.dailyOrders || [])
      setCustomerAnalytics(data.customerAnalytics || {})
      setPaymentMethodBreakdown(data.paymentMethodBreakdown || [])
      setLatestOrders(data.latestOrders || [])
    } catch (error) {
      console.error("Fehler:", error)
    } finally {
      setLoading(false)
    }
  }

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(price)

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("de-DE", {
      day: "2-digit", month: "2-digit",
      hour: "2-digit", minute: "2-digit"
    })

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      paid: "Bezahlt", processing: "In Bearbeitung",
      shipped: "Versendet", pending: "Ausstehend",
      delivered: "Geliefert", cancelled: "Storniert"
    }
    return labels[status] || status
  }

  const getStatusClass = (status: string) => {
    const classes: Record<string, string> = {
      paid: "bg-green-100 text-green-800",
      processing: "bg-blue-100 text-blue-800",
      shipped: "bg-purple-100 text-purple-800",
      delivered: "bg-emerald-100 text-emerald-800",
      cancelled: "bg-red-100 text-red-800",
      pending: "bg-yellow-100 text-yellow-800"
    }
    return classes[status] || classes.pending
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Analytics Dashboard
        </h1>
        <div className="flex gap-2">
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="px-3 py-1 border rounded-lg dark:bg-gray-700"
          >
            <option value="7">Letzte 7 Tage</option>
            <option value="30">Letzte 30 Tage</option>
            <option value="90">Letzte 90 Tage</option>
            <option value="365">Letztes Jahr</option>
          </select>
          <select
            value={groupBy}
            onChange={(e) => setGroupBy(e.target.value)}
            className="px-3 py-1 border rounded-lg dark:bg-gray-700"
          >
            <option value="day">Täglich</option>
            <option value="week">Wöchentlich</option>
            <option value="month">Monatlich</option>
          </select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500">Gesamtumsatz</p>
              <p className="text-2xl font-bold">{formatPrice(stats.totalRevenue)}
          icon="💰"
          color="text-green-500"
          change={12}</p>
            </div>
            <span className={`text-sm font-medium ${stats.revenueChange >= 0 ? "text-green-600" : "text-red-600"}`}>
              {stats.revenueChange >= 0 ? "↑" : "↓"} {Math.abs(stats.revenueChange).toFixed(1)}%
            </span>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <p className="text-sm text-gray-500">Bestellungen</p>
          <p className="text-2xl font-bold">{stats.totalOrders}
          icon="📦"
          color="text-blue-500"
          change={8}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <p className="text-sm text-gray-500">Kunden</p>
          <p className="text-2xl font-bold">{stats.totalUsers}
          icon="👥"
          color="text-orange-500"
          change={15}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <p className="text-sm text-gray-500">Ø Bestellwert</p>
          <p className="text-2xl font-bold">{formatPrice(stats.averageOrderValue)}</p>
        </div>
      </div>

      {/* Charts Row 1: Umsatz + Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <LineChart data={chartData} title="Umsatzentwicklung" />
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <SimpleBarChart
            data={Object.entries(statusDistribution).map(([key, value]) => ({
              label: getStatusLabel(key),
              value
            }))}
            title="Bestellstatus Verteilung"
          />
        </div>
      </div>

      {/* Charts Row 2: Top Produkte + Kategorien */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-md font-semibold mb-4">Top 10 Produkte (nach Umsatz)</h3>
          <div className="space-y-3">
            {topProducts.length === 0 ? (
              <p className="text-gray-500 text-center py-4">Keine Verkaufsdaten</p>
            ) : (
              topProducts.map((product, index) => (
                <div key={index} className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400 w-6">#{index + 1}</span>
                    <span className="font-medium line-clamp-1">{product.name}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{formatPrice(product.revenue)}</div>
                    <div className="text-xs text-gray-500">{product.quantity} verkauft</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <PieChart
            data={Object.entries(categoryDistribution).map(([key, value]) => ({
              label: key,
              value
            }))}
            title="Produkte nach Kategorie"
          />
        </div>
      </div>

      {/* Charts Row 3: Tägliche Bestellungen + Zahlungsmethoden */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <SimpleBarChart
            data={dailyOrders.map((day: any) => ({
              label: day.date,
              value: day.orders
            }))}
            title="Tägliche Bestellungen (letzte 7 Tage)"
          />
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <PieChart
            data={paymentMethodBreakdown.map((method: any) => ({
              label: method.method,
              value: method.revenue
            }))}
            title="Umsatz nach Zahlungsmethode"
          />
        </div>
      </div>

      {/* Kundenanalyse */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8">
        <h3 className="text-md font-semibold mb-4">Kundenanalyse</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-gray-500">Gesamtkunden</p>
            <p className="text-xl font-bold">{customerAnalytics.totalCustomers || 0}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Ausgaben pro Kunde</p>
            <p className="text-xl font-bold">{formatPrice(customerAnalytics.avgSpentPerCustomer || 0)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Bestellungen pro Kunde</p>
            <p className="text-xl font-bold">{customerAnalytics.avgOrdersPerCustomer?.toFixed(1) || 0}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Wiederkaufsrate</p>
            <p className="text-xl font-bold">{customerAnalytics.retentionRate?.toFixed(1) || 0}%</p>
          </div>
        </div>
      </div>

      {/* Letzte Bestellungen */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold">Letzte Bestellungen</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase">Bestellnummer</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase">Kunde</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase">Datum</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase">Betrag</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {latestOrders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    Keine Bestellungen vorhanden
                  </td>
                </tr>
              ) : (
                latestOrders.map((order: any) => (
                  <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 font-mono text-sm">#{order.order_number}</td>
                    <td className="px-6 py-4">{order.users?.name || order.users?.email || "—"}</td>
                    <td className="px-6 py-4 text-sm">{formatDate(order.created_at)}</td>
                    <td className="px-6 py-4 font-medium">{formatPrice(order.total_amount)}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusClass(order.status)}`}>
                        {getStatusLabel(order.status)}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t text-center">
          <Link href="/admin/orders" className="text-blue-600 hover:text-blue-800">
            Alle Bestellungen anzeigen →
          </Link>
        </div>
      </div>
    </div>
  )
}
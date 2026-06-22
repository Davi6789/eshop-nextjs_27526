// src/app/admin/orders/page.tsx

"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ORDER_STATUSES } from "@/types/order"

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [dateFrom, setDateFrom] = useState("")
  const [dateTo, setDateTo] = useState("")
  const [minAmount, setMinAmount] = useState("")
  const [maxAmount, setMaxAmount] = useState("")
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [statusCounts, setStatusCounts] = useState<Record<string, number>>({})
  const [selectedOrders, setSelectedOrders] = useState<string[]>([])

  useEffect(() => {
    loadOrders()
  }, [statusFilter, searchTerm, page, dateFrom, dateTo, minAmount, maxAmount])

  const loadOrders = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (statusFilter !== "all") params.append("status", statusFilter)
      if (searchTerm) params.append("search", searchTerm)
      if (dateFrom) params.append("dateFrom", dateFrom)
      if (dateTo) params.append("dateTo", dateTo)
      if (minAmount) params.append("minAmount", minAmount)
      if (maxAmount) params.append("maxAmount", maxAmount)
      params.append("page", page.toString())
      params.append("limit", "20")

      const res = await fetch(`/api/admin/orders?${params.toString()}`)
      const data = await res.json()
      setOrders(data.orders || [])
      setTotalPages(data.totalPages || 1)
      setStatusCounts(data.statusCounts || {})
    } catch (error) {
      console.error("Fehler:", error)
    } finally {
      setLoading(false)
    }
  }

  const exportCSV = () => {
    const params = new URLSearchParams()
    if (statusFilter !== "all") params.append("status", statusFilter)
    if (dateFrom) params.append("dateFrom", dateFrom)
    if (dateTo) params.append("dateTo", dateTo)
    window.location.href = `/api/admin/orders/export?${params.toString()}`
  }

  const bulkStatusUpdate = async (newStatus: string) => {
    if (!newStatus || selectedOrders.length === 0) return
    if (!confirm(`${selectedOrders.length} Bestellungen auf "${newStatus}" setzen?`)) return

    try {
      const res = await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderIds: selectedOrders, status: newStatus })
      })
      if (res.ok) {
        setSelectedOrders([])
        loadOrders()
      } else {
        alert("Fehler beim Aktualisieren")
      }
    } catch {
      alert("Fehler beim Aktualisieren")
    }
  }

  const toggleSelectOrder = (orderId: string) => {
    setSelectedOrders(prev =>
      prev.includes(orderId) ? prev.filter(id => id !== orderId) : [...prev, orderId]
    )
  }

  const toggleSelectAll = () => {
    setSelectedOrders(
      selectedOrders.length === orders.length ? [] : orders.map((o) => o.id)
    )
  }

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(price)

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("de-DE", {
      day: "2-digit", month: "2-digit", year: "numeric",
      hour: "2-digit", minute: "2-digit"
    })

  const getStatusBadge = (status: string) => {
    const config: Record<string, string> = {
      pending: "bg-yellow-100 text-yellow-800",
      processing: "bg-blue-100 text-blue-800",
      paid: "bg-green-100 text-green-800",
      shipped: "bg-purple-100 text-purple-800",
      delivered: "bg-emerald-100 text-emerald-800",
      cancelled: "bg-red-100 text-red-800"
    }
    const labels: Record<string, string> = {
      pending: "Ausstehend", processing: "In Bearbeitung", paid: "Bezahlt",
      shipped: "Versendet", delivered: "Geliefert", cancelled: "Storniert"
    }
    return {
      className: config[status] || config.pending,
      label: labels[status] || status
    }
  }

  // Gesamtanzahl aus statusCounts berechnen
  const totalCount = Object.values(statusCounts).reduce((a, b) => a + b, 0)

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Bestellungen verwalten
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {orders.length} Bestellungen gefunden
          </p>
        </div>
        <button
          onClick={exportCSV}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
        >
          📥 CSV Export
        </button>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => { setStatusFilter("all"); setPage(1) }}
          className={`px-4 py-2 rounded-lg transition ${
            statusFilter === "all" ? "bg-blue-600 text-white" : "bg-gray-200 dark:bg-gray-700 hover:bg-gray-300"
          }`}
        >
          Alle ({totalCount})
        </button>
        {ORDER_STATUSES.map(status => (
          <button
            key={status.value}
            onClick={() => { setStatusFilter(status.value); setPage(1) }}
            className={`px-4 py-2 rounded-lg transition ${
              statusFilter === status.value ? "bg-blue-600 text-white" : "bg-gray-200 dark:bg-gray-700 hover:bg-gray-300"
            }`}
          >
            {status.label} ({statusCounts[status.value] || 0})
          </button>
        ))}
      </div>

      {/* Filter Bereich */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Suchen..." className="px-3 py-2 border rounded-lg dark:bg-gray-700" />
          <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)}
            className="px-3 py-2 border rounded-lg dark:bg-gray-700" />
          <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)}
            className="px-3 py-2 border rounded-lg dark:bg-gray-700" />
          <input type="number" placeholder="Min. Betrag" value={minAmount}
            onChange={(e) => setMinAmount(e.target.value)} className="px-3 py-2 border rounded-lg dark:bg-gray-700" />
          <input type="number" placeholder="Max. Betrag" value={maxAmount}
            onChange={(e) => setMaxAmount(e.target.value)} className="px-3 py-2 border rounded-lg dark:bg-gray-700" />
          <button onClick={() => { setSearchTerm(""); setDateFrom(""); setDateTo(""); setMinAmount(""); setMaxAmount(""); setPage(1) }}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600">
            Zurücksetzen
          </button>
        </div>
      </div>

      {/* Bulk Update Bar */}
      {selectedOrders.length > 0 && (
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-6 flex justify-between items-center">
          <span>{selectedOrders.length} Bestellungen ausgewählt</span>
          <div className="flex gap-2">
            <select onChange={(e) => bulkStatusUpdate(e.target.value)}
              className="px-3 py-1 border rounded-lg dark:bg-gray-700" defaultValue="">
              <option value="" disabled>Status ändern</option>
              {ORDER_STATUSES.map(status => (
                <option key={status.value} value={status.value}>{status.label}</option>
              ))}
            </select>
            <button onClick={() => setSelectedOrders([])}
              className="px-3 py-1 bg-gray-500 text-white rounded-lg">
              Abbrechen
            </button>
          </div>
        </div>
      )}

      {/* Orders Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-4 py-3">
                  <input type="checkbox"
                    checked={selectedOrders.length === orders.length && orders.length > 0}
                    onChange={toggleSelectAll} className="w-4 h-4" />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase">Bestellnummer</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase">Kunde</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase">Datum</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase">Betrag</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase">Aktion</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i}>
                    <td colSpan={7} className="px-6 py-4">
                      <div className="animate-pulse h-4 bg-gray-200 rounded" />
                    </td>
                  </tr>
                ))
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    Keine Bestellungen gefunden
                  </td>
                </tr>
              ) : (
                orders.map((order) => {
                  const badge = getStatusBadge(order.status)
                  return (
                    <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-4 py-4">
                        <input type="checkbox" checked={selectedOrders.includes(order.id)}
                          onChange={() => toggleSelectOrder(order.id)} className="w-4 h-4" />
                      </td>
                      <td className="px-6 py-4 font-mono text-sm">#{order.order_number}</td>
                      <td className="px-6 py-4">
                        <div className="font-medium">{order.users?.name || "—"}</div>
                        <div className="text-sm text-gray-500">{order.users?.email}</div>
                      </td>
                      <td className="px-6 py-4 text-sm">{formatDate(order.created_at)}</td>
                      <td className="px-6 py-4 font-medium">{formatPrice(order.total_amount)}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${badge.className}`}>
                          {badge.label}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <Link href={`/admin/orders/${order.id}`}
                          className="text-blue-600 hover:text-blue-800 text-sm">
                          Details →
                        </Link>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="px-6 py-4 border-t flex justify-between items-center">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
              className="px-4 py-2 border rounded-lg disabled:opacity-50">← Zurück</button>
            <span>Seite {page} von {totalPages}</span>
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
              className="px-4 py-2 border rounded-lg disabled:opacity-50">Weiter →</button>
          </div>
        )}
      </div>
    </div>
  )
}
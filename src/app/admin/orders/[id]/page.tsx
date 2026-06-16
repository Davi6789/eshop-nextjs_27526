//   src/app/admin/orders/[id]/page.tsx 

"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { supabase } from "@/lib/supabase/client"
import { ORDER_STATUSES, OrderStatus } from "@/types/order"

export default function AdminOrderDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [order, setOrder] = useState<any>(null)
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus>("pending")
  const [trackingNumber, setTrackingNumber] = useState("")
  const [trackingUrl, setTrackingUrl] = useState("")
  const [notes, setNotes] = useState("")

  useEffect(() => {
    loadOrder()
  }, [params.id])

  const loadOrder = async () => {
    const { data: orderData } = await supabase
      .from("orders")
      .select(`
        *,
        users (name, email)
      `)
      .eq("id", params.id)
      .single()

    if (orderData) {
      setOrder(orderData)
      setSelectedStatus(orderData.status)
      setTrackingNumber(orderData.tracking_number || "")
      setTrackingUrl(orderData.tracking_url || "")
      setNotes(orderData.notes || "")

      // Order Items laden
      const { data: itemsData } = await supabase
        .from("order_items")
        .select("*")
        .eq("order_id", params.id)

      setItems(itemsData || [])
    }
    setLoading(false)
  }

  const updateOrderStatus = async () => {
    setUpdating(true)
    try {
      const res = await fetch(`/api/admin/orders/${params.id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: selectedStatus,
          tracking_number: trackingNumber,
          tracking_url: trackingUrl,
          notes: notes,
        }),
      })

      if (res.ok) {
        alert("Bestellstatus aktualisiert!")
        loadOrder()
      } else {
        alert("Fehler beim Aktualisieren")
      }
    } catch (error) {
      console.error("Update Error:", error)
      alert("Fehler beim Aktualisieren")
    } finally {
      setUpdating(false)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("de-DE", {
      style: "currency",
      currency: "EUR"
    }).format(price)
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("de-DE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    })
  }

  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="p-8 text-center">
        <p>Bestellung nicht gefunden</p>
        <Link href="/admin/orders" className="text-blue-600 mt-4 inline-block">
          ← Zurück zur Übersicht
        </Link>
      </div>
    )
  }

  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const discount = subtotal - order.total_amount
  const shipping = 0

  return (
    <div className="p-8">
      <div className="mb-8">
        <Link href="/admin/orders" className="text-blue-600 hover:text-blue-800">
          ← Zurück zur Übersicht
        </Link>
        <h1 className="text-2xl font-bold mt-2">Bestellung #{order.order_number}</h1>
        <p className="text-gray-500">Bestellt am {formatDate(order.created_at)}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Hauptbereich */}
        <div className="lg:col-span-2 space-y-6">
          {/* Bestellte Artikel */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Bestellte Artikel</h2>
            <div className="space-y-3">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between items-center py-2 border-b">
                  <div>
                    <p className="font-medium">{item.product_name}</p>
                    <p className="text-sm text-gray-500">{item.quantity} × {formatPrice(item.price)}</p>
                  </div>
                  <p className="font-medium">{formatPrice(item.price * item.quantity)}</p>
                </div>
              ))}
            </div>
            
            <div className="mt-4 pt-4 border-t space-y-2">
              <div className="flex justify-between">
                <span>Zwischensumme:</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Rabatt:</span>
                  <span>-{formatPrice(discount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Versand:</span>
                <span>{shipping > 0 ? formatPrice(shipping) : "Kostenlos"}</span>
              </div>
              <div className="flex justify-between text-lg font-bold pt-2 border-t">
                <span>Gesamt:</span>
                <span>{formatPrice(order.total_amount)}</span>
              </div>
            </div>
          </div>

          {/* Kundeninformationen */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Kundeninformationen</h2>
            <div className="space-y-2">
              <p><strong>Name:</strong> {order.users?.name || "—"}</p>
              <p><strong>Email:</strong> {order.users?.email}</p>
              <p><strong>Lieferadresse:</strong> {order.shipping_address}</p>
              <p><strong>Zahlungsmethode:</strong> {order.payment_method === 'paypal' ? 'PayPal' : 'Banküberweisung'}</p>
            </div>
          </div>
        </div>

        {/* Sidebar - Status Management */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Bestellstatus</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value as OrderStatus)}
                  className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700"
                >
                  {ORDER_STATUSES.map(status => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Sendungsnummer</label>
                <input
                  type="text"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder="z.B. DHL 123456789"
                  className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Tracking URL</label>
                <input
                  type="url"
                  value={trackingUrl}
                  onChange={(e) => setTrackingUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Notizen (intern)</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  placeholder="Interne Notizen zur Bestellung..."
                  className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700"
                />
              </div>

              <button
                onClick={updateOrderStatus}
                disabled={updating}
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {updating ? "Wird gespeichert..." : "Status aktualisieren"}
              </button>
            </div>
          </div>

          {/* Versandinfo (falls vorhanden) */}
          {trackingNumber && (
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
              <p className="font-semibold mb-2">📦 Sendungsverfolgung</p>
              <p className="text-sm">Sendungsnummer: {trackingNumber}</p>
              {trackingUrl && (
                <a
                  href={trackingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 text-sm mt-2 inline-block"
                >
                  Sendung verfolgen →
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
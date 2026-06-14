//    src/app/(shop)/success/[orderId]/page.tsx 

"use client"

import { useEffect, useState } from "react"
import { useParams, useSearchParams } from "next/navigation"
import Link from "next/link"
import { supabase } from "@/lib/supabase/client"

export default function SuccessPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const orderId = params.orderId as string
  const orderNumber = searchParams.get("orderNumber")
  const paymentMethod = searchParams.get("payment")

  useEffect(() => {
    loadOrder()
  }, [orderId])

  const loadOrder = async () => {
    const { data } = await supabase
      .from("orders")
      .select(`
        *,
        order_items (*)
      `)
      .eq("id", orderId)
      .single()

    setOrder(data)
    setLoading(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Vielen Dank für deine Bestellung!
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Deine Bestellung wurde erfolgreich aufgegeben.
          </p>

          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-500 dark:text-gray-400">Bestellnummer</p>
            <p className="text-xl font-mono font-bold text-gray-900 dark:text-white">
              {orderNumber || order?.order_number}
            </p>
            {paymentMethod === "paypal" && (
              <p className="text-sm text-green-600 mt-2">
                ✅ Zahlung mit PayPal erfolgreich
              </p>
            )}
          </div>

          <div className="space-y-4">
            <Link
              href={`/dashboard/orders/${orderId}`}
              className="block w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Zur Bestellübersicht
            </Link>
            <Link
              href="/products"
              className="block w-full text-gray-600 dark:text-gray-400 py-2 hover:text-gray-800"
            >
              Weiter einkaufen →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
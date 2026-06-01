//  src/app/(dashboard)/dashboard/orders/[id]/page.tsx 

import { auth } from "@/lib/auth/config"
import { redirect, notFound } from "next/navigation"
import { supabase } from "@/lib/supabase/server"
import Link from "next/link"
import LoadingSpinner from "@/components/ui/LoadingSpinner"

interface PageProps {
  params: {
    id: string
  }
}

export default async function OrderDetailsPage({ params }: PageProps) {
  const session = await auth()
  
  if (!session) {
    redirect("/login")
  }

  // Hole Bestelldetails mit Items
  const { data: order } = await supabase
    .from("orders")
    .select(`
      *,
      order_items (*)
    `)
    .eq("id", params.id)
    .eq("user_id", session.user.id)
    .single()

  if (!order) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-8">
          <Link href="/dashboard/orders" className="text-blue-600 hover:text-blue-500 mb-4 inline-block">
            ← Zurück zu meinen Bestellungen
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Bestellung #{order.order_number}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Bestellt am {new Date(order.created_at).toLocaleDateString("de-DE")}
          </p>
        </div>

        {/* Order Status */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Bestellstatus
          </h2>
          <div className="flex items-center space-x-4">
            <div className={`flex-1 h-2 rounded-full ${
              order.status === "pending" 
                ? "bg-yellow-400" 
                : order.status === "processing"
                ? "bg-blue-400"
                : "bg-green-400"
            }`} />
            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
              order.status === "delivered"
                ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                : order.status === "processing"
                ? "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
                : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
            }`}>
              {order.status === "delivered" ? "Geliefert" : 
               order.status === "processing" ? "In Bearbeitung" : "Bestätigt"}
            </span>
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden mb-6">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Bestellte Artikel
            </h2>
          </div>
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {order.order_items.map((item: any) => (
              <div key={item.id} className="px-6 py-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {item.product_name}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Menge: {item.quantity} × €{item.price}
                    </p>
                  </div>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    €{(item.quantity * item.price).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Shipping Info */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Lieferadresse
          </h2>
          <div className="text-gray-600 dark:text-gray-400">
            <p>{order.shipping_address}</p>
            <p>{order.shipping_city}, {order.shipping_zip}</p>
            <p>{order.shipping_country}</p>
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Bestellübersicht
          </h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Zwischensumme</span>
              <span className="text-gray-900 dark:text-white">€{order.total_amount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Versand</span>
              <span className="text-gray-900 dark:text-white">Kostenlos</span>
            </div>
            <div className="border-t border-gray-200 dark:border-gray-700 pt-2 mt-2">
              <div className="flex justify-between">
                <span className="text-lg font-semibold text-gray-900 dark:text-white">Gesamt</span>
                <span className="text-lg font-semibold text-gray-900 dark:text-white">
                  €{order.total_amount}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
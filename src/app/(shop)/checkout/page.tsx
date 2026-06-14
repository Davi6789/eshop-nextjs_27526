//  src/app/(shop)/checkout/page.tsx

"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { useCart } from "@/context/CartContext"
import CheckoutForm from "@/components/forms/CheckoutForm"
import Link from "next/link"

export default function CheckoutPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { items, getDiscountedTotal, getTotalPrice, getDiscountAmount, appliedCoupon } = useCart()
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    if (status === "unauthenticated") {
      router.push("/login?redirect=/checkout")
    }
  }, [status, router])

  if (!isClient || status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-2xl font-bold mb-4">Dein Warenkorb ist leer</h1>
          <Link href="/products" className="text-blue-600 hover:underline">
            Produkte entdecken →
          </Link>
        </div>
      </div>
    )
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR'
    }).format(price)
  }

  const handleSuccess = (orderId: string, orderNumber: string) => {
    router.push(`/success/${orderId}?orderNumber=${orderNumber}`)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Zur Kasse
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <CheckoutForm onSubmitSuccess={handleSuccess} />
          </div>

          {/* Bestellübersicht */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 sticky top-24">
              <h2 className="text-xl font-semibold mb-4">Bestellübersicht</h2>
              
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3 text-sm">
                    <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center">
                      {item.image ? "📷" : "🛒"}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium line-clamp-2">{item.title}</p>
                      <p className="text-gray-500">{item.quantity} × {formatPrice(item.price)}</p>
                    </div>
                    <div className="font-medium">{formatPrice(item.price * item.quantity)}</div>
                  </div>
                ))}
              </div>
              
              <div className="border-t pt-4 mt-4 space-y-2">
                <div className="flex justify-between">
                  <span>Zwischensumme:</span>
                  <span>{formatPrice(getTotalPrice())}</span>
                </div>
                
                {appliedCoupon && (
                  <div className="flex justify-between text-green-600">
                    <span>Rabatt ({appliedCoupon.code}):</span>
                    <span>-{formatPrice(getDiscountAmount())}</span>
                  </div>
                )}
                
                <div className="flex justify-between text-lg font-bold pt-2 border-t">
                  <span>Gesamt:</span>
                  <span>{formatPrice(getDiscountedTotal())}</span>
                </div>
              </div>
              
              <div className="mt-4 text-xs text-gray-500 space-y-1">
                <p>✅ Versandkostenfrei</p>
                <p>✅ 30 Tage Rückgaberecht</p>
                <p>🔒 SSL-verschlüsselte Zahlung</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
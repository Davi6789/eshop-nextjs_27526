//  src/app/(shop)/cart/page.tsx 

"use client"

import { useCart } from "@/context/CartContext"
import Link from "next/link"
import Image from "next/image"
import CouponInput from "@/components/ui/CouponInput"

export default function CartPage() {
  const { 
    items, 
    updateQuantity, 
    removeItem, 
    getTotalPrice,
    getDiscountedTotal,
    getDiscountAmount,
    appliedCoupon,
    applyCoupon,
    removeCoupon
  } = useCart()

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR'
    }).format(price)
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="text-6xl mb-4">🛒</div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Dein Warenkorb ist leer
          </h1>
          <Link
            href="/products"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            Produkte entdecken →
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Warenkorb ({items.length} Artikel)
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div key={item.id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex gap-4">
                <div className="relative w-24 h-24 bg-gray-100 rounded-lg overflow-hidden">
                  {item.image ? (
                    <Image src={item.image} alt={item.title} fill className="object-cover" />
                  ) : (
                    <div className="flex items-center justify-center h-full">📷</div>
                  )}
                </div>
                
                <div className="flex-1">
                  <Link href={`/products/${item.id}`} className="font-semibold text-gray-900 dark:text-white hover:text-blue-600">
                    {item.title}
                  </Link>
                  <div className="text-sm text-gray-500 mt-1">{formatPrice(item.price)}</div>
                  
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-8 h-8 rounded border hover:bg-gray-100"
                    >
                      -
                    </button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      disabled={item.quantity >= item.stock}
                      className="w-8 h-8 rounded border hover:bg-gray-100 disabled:opacity-50"
                    >
                      +
                    </button>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="ml-4 text-red-600 hover:text-red-700"
                    >
                      Entfernen
                    </button>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="font-semibold">{formatPrice(item.price * item.quantity)}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 sticky top-24">
              <h2 className="text-xl font-semibold mb-4">Bestellübersicht</h2>
              
              <CouponInput
                onApply={applyCoupon}
                onRemove={removeCoupon}
                cartTotal={getTotalPrice()}
                appliedCoupon={appliedCoupon}
              />
              
              <div className="space-y-2 mt-4 pt-4 border-t">
                <div className="flex justify-between">
                  <span>Zwischensumme:</span>
                  <span>{formatPrice(getTotalPrice())}</span>
                </div>
                
                {appliedCoupon && (
                  <div className="flex justify-between text-green-600">
                    <span>Rabatt:</span>
                    <span>-{formatPrice(getDiscountAmount())}</span>
                  </div>
                )}
                
                <div className="flex justify-between text-lg font-bold pt-2 border-t">
                  <span>Gesamt:</span>
                  <span>{formatPrice(getDiscountedTotal())}</span>
                </div>
              </div>
              
              <Link
                href="/checkout"
                className="block w-full text-center bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 mt-4"
              >
                Zur Kasse →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
//  src/components/ui/ProductCard.tsx

"use client"

import Image from "next/image"
import Link from "next/link"
import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase/client"
import { useSession } from "next-auth/react"
import { useCart } from "@/context/CartContext"
import WishlistButton from "./WishlistButton"
import CountdownTimer from "./CountdownTimer"

interface ProductCardProps {
  product: {
    id: string
    title: string
    slug: string
    price: number
    current_price: number
    has_discount: boolean
    discount_percent: number
    discount_ends_at?: string | null
    image_url: string | null
    images: string[] | null
    stock: number
    rating_avg: number
    rating_count: number
  }
}

export default function ProductCard({ product }: ProductCardProps) {
  const { data: session } = useSession()
  const { addItem } = useCart()
  const [addingToCart, setAddingToCart] = useState(false)

  // Sterne Bewertung anzeigen
  const renderStars = () => {
    const stars = []
    const rating = Math.round(product.rating_avg || 0)
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={i <= rating ? "text-yellow-400" : "text-gray-300 dark:text-gray-600"}>
          ★
        </span>
      )
    }
    return stars
  }

  const addToCart = () => {
    addItem({
      id: product.id,
      title: product.title,
      price: product.current_price,
      image: product.image_url ?? undefined,
      quantity: 1,
      stock: product.stock
    })
    
    setAddingToCart(true)
    setTimeout(() => setAddingToCart(false), 1000)
  }

  return (
    <div className="group relative bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden">
      
      {/* Discount Badge */}
      {product.has_discount && (
        <div className="absolute top-2 left-2 z-10 bg-red-500 text-white px-2 py-1 rounded-md text-sm font-semibold">
          -{product.discount_percent}%
        </div>
      )}

      {/* Countdown Timer bei Rabatt */}
      {product.has_discount && product.discount_ends_at && (
        <div className="absolute bottom-2 left-2 z-10 bg-black/70 dark:bg-black/80 backdrop-blur-sm rounded-md px-2 py-0.5">
          <CountdownTimer targetDate={product.discount_ends_at} size="sm" />
        </div>
      )}

      {/* Wishlist Button */}
      <div className="absolute top-2 right-2 z-10">
        <WishlistButton productId={product.id} size="md" />
      </div>

      {/* Product Image */}
      <Link href={`/products/${product.slug}`}>
        <div className="relative h-48 bg-gray-200 dark:bg-gray-700 overflow-hidden">
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt={product.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = "none";
              }}
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <span className="text-gray-400 dark:text-gray-500 text-4xl">📷</span>
            </div>
          )}
        </div>
      </Link>

      {/* Product Info - ALLE dark: Klassen hier! */}
      <div className="p-4">
        <Link href={`/products/${product.slug}`}>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition line-clamp-2 min-h-[56px]">
            {product.title}
          </h3>
        </Link>

        {/* ⭐ Rating */}
        {product.rating_count > 0 && (
          <div className="flex items-center mt-1">
            <div className="flex text-sm">
              {renderStars()}
            </div>
            <span className="ml-1 text-xs text-gray-500 dark:text-gray-400">
              ({product.rating_count})
            </span>
          </div>
        )}

        {/* Price - dark: Klassen */}
        <div className="mt-2">
          {product.has_discount ? (
            <div className="flex items-center space-x-2">
              <span className="text-xl font-bold text-red-600 dark:text-red-400">
                €{product.current_price.toFixed(2)}
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400 line-through">
                €{product.price.toFixed(2)}
              </span>
            </div>
          ) : (
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              €{product.current_price.toFixed(2)}
            </span>
          )}
        </div>

        {/* Stock Status - dark: Klassen */}
        <div className="mt-2">
          {product.stock > 0 ? (
            <span className="text-xs text-green-600 dark:text-green-400">
              ✅ Auf Lager ({product.stock})
            </span>
          ) : (
            <span className="text-xs text-red-600 dark:text-red-400">
              ❌ Ausverkauft
            </span>
          )}
        </div>

        {/* Add to Cart Button - dark: Klassen */}
        <button
          onClick={addToCart}
          disabled={product.stock === 0 || addingToCart}
          className="mt-4 w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white py-2 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
        >
          {addingToCart ? "✓ Hinzugefügt!" : "🛒 In den Warenkorb"}
        </button>
      </div>
    </div>
  )
}
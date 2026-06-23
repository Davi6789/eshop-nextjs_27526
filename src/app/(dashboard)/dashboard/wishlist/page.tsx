// src/app/(dashboard)/dashboard/wishlist/page.tsx

"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase/client"
import Link from "next/link"
import Image from "next/image"

interface WishlistItem {
  id: string
  product_id: string
  product: {
    id: string
    title: string
    slug: string
    price: number
    current_price: number
    discount_price: number | null
    discount_until: string | null
    image_url: string | null  // ← Kann null sein
  }
}

export default function WishlistPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    }
  }, [status, router])

  useEffect(() => {
    if (status === "authenticated" && session?.user?.id) {
      loadWishlist()
    }
  }, [status, session])

  const loadWishlist = async () => {
    if (!session?.user?.id) return
    
    setLoading(true)
    
    const { data, error } = await supabase
      .from("wishlist")
      .select(`
        id,
        product_id,
        products (
          id,
          title,
          slug,
          price,
          discount_price,
          discount_until,
          image_url
        )
      `)
      .eq("user_id", session.user.id)

    if (!error && data) {
      // Transformiere die Daten richtig
      const transformedData = data.map((item: any) => ({
        id: item.id,
        product_id: item.product_id,
        product: {
          id: item.products.id,
          title: item.products.title,
          slug: item.products.slug,
          price: item.products.price,
          current_price: item.products.discount_price || item.products.price,
          discount_price: item.products.discount_price,
          discount_until: item.products.discount_until,
          image_url: item.products.image_url
        }
      }))
      setWishlistItems(transformedData)
    }
    
    setLoading(false)
  }

  const removeFromWishlist = async (wishlistId: string) => {
    const { error } = await supabase
      .from("wishlist")
      .delete()
      .eq("id", wishlistId)

    if (!error) {
      setWishlistItems(wishlistItems.filter(item => item.id !== wishlistId))
    }
  }

  const addToCart = (product: WishlistItem['product']) => {
    // Hole aktuellen Warenkorb
    const cart = JSON.parse(localStorage.getItem("cart") || "[]")
    
    const existingItem = cart.find((item: any) => item.id === product.id)
    
    if (existingItem) {
      existingItem.quantity += 1
    } else {
      cart.push({
        id: product.id,
        title: product.title,
        price: product.current_price,
        // ✅ FIX: Verwende null coalescing operator
        image: product.image_url ?? undefined,  // ← null wird zu undefined
        quantity: 1,
        stock: 999
      })
    }
    
    localStorage.setItem("cart", JSON.stringify(cart))
    window.dispatchEvent(new Event("cartUpdated"))
    
    // Optional: Feedback anzeigen
    alert(`${product.title} wurde zum Warenkorb hinzugefügt!`)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Meine Wunschliste
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            {wishlistItems.length} Produkte auf deiner Wunschliste
          </p>
        </div>

        {wishlistItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlistItems.map((item) => {
              const product = item.product
              const hasDiscount = product.discount_until && 
                new Date(product.discount_until) > new Date() &&
                product.discount_price
              const currentPrice = hasDiscount ? product.discount_price : product.price

              return (
                <div key={item.id} className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden hover:shadow-lg transition">
                  <Link href={`/products/${product.slug}`}>
                    <div className="relative h-48 bg-gray-200 dark:bg-gray-700">
                      {product.image_url ? (
                        <Image
                          src={product.image_url}
                          alt={product.title}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <span className="text-gray-400 dark:text-gray-500 text-4xl">📷</span>
                        </div>
                      )}
                    </div>
                  </Link>
                  
                  <div className="p-4">
                    <Link href={`/products/${product.slug}`}>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white hover:text-blue-600 transition line-clamp-2">
                        {product.title}
                      </h3>
                    </Link>
                    
                    <div className="mt-2">
                      <span className="text-2xl font-bold text-gray-900 dark:text-white">
                        €{currentPrice?.toFixed(2) || product.price?.toFixed(2)}
                      </span>
                    </div>

                    <div className="mt-4 flex space-x-2">
                      <button
                        onClick={() => addToCart(product)}
                        className="flex-1 bg-blue-600 text-white text-center px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                      >
                        🛒 In den Warenkorb
                      </button>
                      <button
                        onClick={() => removeFromWishlist(item.id)}
                        className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition"
                        aria-label="Von Wunschliste entfernen"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-12 text-center">
            <div className="text-6xl mb-4">💔</div>
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              Deine Wunschliste ist noch leer.
            </p>
            <p className="text-gray-400 dark:text-gray-500 mt-2">
              Speichere Produkte, die dir gefallen, um sie später wiederzufinden.
            </p>
            <Link 
              href="/products"
              className="mt-6 inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Produkte entdecken
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
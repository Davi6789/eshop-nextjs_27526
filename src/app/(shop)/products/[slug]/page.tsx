// src/app/(shop)/products/[slug]/page.tsx

"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import ProductGallery from "@/components/ui/ProductGallery"
import { supabase } from "@/lib/supabase/client"  // ✅ NUR Client importieren
import { useSession } from "next-auth/react"
import ReviewForm from "@/components/forms/ReviewForm"
import ReviewList from "@/components/ui/ReviewList"

interface Product {
  id: string
  title: string
  slug: string
  description: string
  price: number
  current_price: number
  has_discount: boolean
  discount_percent: number
  discount_ends_at: string | null
  stock: number
  images: string[]
  category: string
  rating_avg: number
  rating_count: number
}

export default function ProductDetailPage() {
  const params = useParams()
  const { data: session } = useSession()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [isInWishlist, setIsInWishlist] = useState(false)
  const [addingToCart, setAddingToCart] = useState(false)
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([])
  const [refreshReviews, setRefreshReviews] = useState(0)

  useEffect(() => {
    loadProduct()
  }, [params.slug])

  useEffect(() => {
    if (product && session?.user?.id) {
      checkWishlistStatus()
    }
  }, [product, session])

  const loadProduct = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/products/${params.slug}`)
      if (!res.ok) throw new Error("Produkt nicht gefunden")
      const data = await res.json()
      setProduct(data)
      
      if (data.category) {
        loadRelatedProducts(data.category, data.id)
      }
    } catch (error) {
      console.error("Fehler:", error)
    } finally {
      setLoading(false)
    }
  }

  const loadRelatedProducts = async (category: string, productId: string) => {
    const { data } = await supabase
      .from("products")
      .select("*")
      .eq("category", category)
      .neq("id", productId)
      .limit(4)
    
    if (data) {
      const now = new Date()
      const productsWithPrice = data.map(p => ({
        ...p,
        current_price: p.discount_until && new Date(p.discount_until) > now && p.discount_price
          ? p.discount_price
          : p.price,
        has_discount: p.discount_until && new Date(p.discount_until) > now && p.discount_price
      }))
      setRelatedProducts(productsWithPrice)
    }
  }

  async function checkWishlistStatus() {
    if (!product) return
    const { data } = await supabase
      .from("wishlist")
      .select("id")
      .eq("user_id", session?.user?.id)
      .eq("product_id", product.id)
      .single()
    
    setIsInWishlist(!!data)
  }

  const toggleWishlist = async () => {
    if (!session) {
      window.location.href = "/login"
      return
    }
    if (!product) return

    if (isInWishlist) {
      await supabase
        .from("wishlist")
        .delete()
        .eq("user_id", session.user.id)
        .eq("product_id", product.id)
      setIsInWishlist(false)
    } else {
      await supabase
        .from("wishlist")
        .insert({ user_id: session.user.id, product_id: product.id })
      setIsInWishlist(true)
    }
  }

  const addToCart = () => {
    if (!product) return
    
    const cart = JSON.parse(localStorage.getItem("cart") || "[]")
    const existingItem = cart.find((item: any) => item.id === product.id)
    
    if (existingItem) {
      existingItem.quantity += quantity
    } else {
      cart.push({
        id: product.id,
        title: product.title,
        price: product.current_price,
        image: product.images?.[0],
        quantity: quantity
      })
    }
    
    localStorage.setItem("cart", JSON.stringify(cart))
    window.dispatchEvent(new Event("cartUpdated"))
    
    setAddingToCart(true)
    setTimeout(() => setAddingToCart(false), 1500)
  }

  const updateQuantity = (delta: number) => {
    const newQuantity = quantity + delta
    if (newQuantity >= 1 && newQuantity <= (product?.stock || 10)) {
      setQuantity(newQuantity)
    }
  }

  const handleReviewSubmitted = () => {
    loadProduct()
    setRefreshReviews(prev => prev + 1)
  }

  if (loading) {
    return null // Loading wird von loading.tsx übernommen
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Produkt nicht gefunden
          </h1>
          <Link href="/products" className="text-blue-600 hover:text-blue-500">
            Zurück zur Übersicht →
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <div className="mb-6 text-sm text-gray-500 dark:text-gray-400">
          <Link href="/" className="hover:text-blue-600">Start</Link>
          {" / "}
          <Link href="/products" className="hover:text-blue-600">Produkte</Link>
          {" / "}
          <span className="text-gray-900 dark:text-white">{product.title}</span>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Gallery */}
          <ProductGallery images={product.images || []} title={product.title} />

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {product.title}
              </h1>
              
              {product.rating_count > 0 && (
                <div className="flex items-center mt-2">
                  <div className="flex text-yellow-400">
                    {"★".repeat(Math.round(product.rating_avg))}
                    {"☆".repeat(5 - Math.round(product.rating_avg))}
                  </div>
                  <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                    ({product.rating_count} Bewertungen)
                  </span>
                </div>
              )}

              {product.category && (
                <div className="mt-2">
                  <span className="inline-block bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm px-2 py-1 rounded">
                    {product.category}
                  </span>
                </div>
              )}
            </div>

            {/* Price */}
            <div className="border-t border-b border-gray-200 dark:border-gray-700 py-4">
              {product.has_discount ? (
                <div>
                  <div className="flex items-baseline space-x-3">
                    <span className="text-4xl font-bold text-red-600">
                      €{product.current_price.toFixed(2)}
                    </span>
                    <span className="text-xl text-gray-500 line-through">
                      €{product.price.toFixed(2)}
                    </span>
                    <span className="bg-red-500 text-white px-2 py-1 rounded text-sm font-semibold">
                      -{product.discount_percent}%
                    </span>
                  </div>
                  {product.discount_ends_at && (
                    <p className="text-sm text-green-600 dark:text-green-400 mt-2">
                      ⏰ Angebot gültig bis: {new Date(product.discount_ends_at).toLocaleDateString("de-DE")}
                    </p>
                  )}
                </div>
              ) : (
                <span className="text-4xl font-bold text-gray-900 dark:text-white">
                  €{product.current_price.toFixed(2)}
                </span>
              )}
            </div>

            {/* Stock Status */}
            <div>
              {product.stock > 0 ? (
                <div className="flex items-center text-green-600 dark:text-green-400">
                  <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  Auf Lager ({product.stock} Stück)
                </div>
              ) : (
                <div className="flex items-center text-red-600 dark:text-red-400">
                  <span className="inline-block w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                  Ausverkauft
                </div>
              )}
            </div>

            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Beschreibung
              </h3>
              <p className="text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
                {product.description}
              </p>
            </div>

            {/* Quantity & Actions */}
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <span className="text-gray-700 dark:text-gray-300">Menge:</span>
                <div className="flex items-center border border-gray-300 dark:border-gray-700 rounded-lg">
                  <button
                    onClick={() => updateQuantity(-1)}
                    disabled={quantity <= 1}
                    className="px-3 py-1 text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50"
                  >
                    -
                  </button>
                  <span className="w-12 text-center text-gray-900 dark:text-white">
                    {quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(1)}
                    disabled={quantity >= product.stock}
                    className="px-3 py-1 text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50"
                  >
                    +
                  </button>
                </div>
                <span className="text-sm text-gray-500">
                  max. {product.stock} Stück
                </span>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={addToCart}
                  disabled={product.stock === 0 || addingToCart}
                  className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {addingToCart ? "✓ Zum Warenkorb hinzugefügt!" : "🛒 In den Warenkorb"}
                </button>
                
                <button
                  onClick={toggleWishlist}
                  className="px-6 py-3 border border-gray-300 dark:border-gray-700 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                >
                  {isInWishlist ? "❤️ Auf der Wunschliste" : "🤍 Zur Wunschliste hinzufügen"}
                </button>
              </div>
            </div>

            {/* Shipping Info */}
            <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 space-y-2 text-sm">
              <p className="flex items-center text-gray-600 dark:text-gray-400">
                <span className="mr-2">🚚</span> Kostenloser Versand ab 50€
              </p>
              <p className="flex items-center text-gray-600 dark:text-gray-400">
                <span className="mr-2">🔄</span> 30 Tage Rückgaberecht
              </p>
              <p className="flex items-center text-gray-600 dark:text-gray-400">
                <span className="mr-2">🔒</span> Sichere Zahlung mit PayPal
              </p>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Bewertungen
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <ReviewForm 
                productId={product.id} 
                onReviewSubmitted={handleReviewSubmitted}
              />
            </div>
            <div className="lg:col-span-2">
              <ReviewList 
                productId={product.id} 
                key={refreshReviews}
              />
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Ähnliche Produkte
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <Link
                  key={relatedProduct.id}
                  href={`/products/${relatedProduct.slug}`}
                  className="group bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-xl transition overflow-hidden"
                >
                  <div className="relative h-48 bg-gray-200 dark:bg-gray-700">
                    {relatedProduct.images?.[0] ? (
                      <Image
                        src={relatedProduct.images[0]}
                        alt={relatedProduct.title}
                        fill
                        className="object-cover group-hover:scale-105 transition"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <span className="text-gray-400">Kein Bild</span>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-1">
                      {relatedProduct.title}
                    </h3>
                    <p className="text-lg font-bold text-blue-600 mt-2">
                      €{relatedProduct.current_price.toFixed(2)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
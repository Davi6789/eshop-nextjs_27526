// src/app/(shop)/products/page.tsx

"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { supabase } from "@/lib/supabase/client"
import Image from "next/image"

interface Product {
  id: string
  name: string
  slug: string
  price: number
  image: string
  description?: string
  category?: string
  stock?: number
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true)
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .order("created_at", { ascending: false })

        if (error) {
          console.error("Error fetching products:", error)
          setError("Fehler beim Laden der Produkte")
          return
        }

        setProducts(data || [])
      } catch (err) {
        console.error("Error:", err)
        setError("Ein Fehler ist aufgetreten")
      } finally {
        setIsLoading(false)
      }
    }

    fetchProducts()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Alle Produkte</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Entdecke unser großes Angebot an hochwertigen Produkten
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <p className="text-red-600 dark:text-red-400">{error}</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Keine Produkte verfügbar
            </p>
            <Link
              href="/"
              className="mt-4 inline-block text-blue-600 hover:text-blue-500"
            >
              ← Zur Startseite
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <Link
                key={product.id}
                href={`/products/${product.slug}`}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden"
              >
                {/* Product Image */}
                <div className="relative w-full h-48 bg-gray-200 dark:bg-gray-700">
                  {product.image ? (
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover"
                      priority={false}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      Kein Bild
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {product.name}
                  </h3>

                  {product.category && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                      {product.category}
                    </p>
                  )}

                  {product.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                      {product.description}
                    </p>
                  )}

                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold text-blue-600">
                      €{(product.price / 100).toFixed(2)}
                    </span>
                    {product.stock !== undefined && (
                      <span
                        className={`text-sm font-medium ${
                          product.stock > 0
                            ? "text-green-600 dark:text-green-400"
                            : "text-red-600 dark:text-red-400"
                        }`}
                      >
                        {product.stock > 0 ? `${product.stock} Stk.` : "Ausverkauft"}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
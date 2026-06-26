git //  src/app/page.tsx

"use client"

import { useState, useEffect } from "react"
import ProductGrid from "@/components/ui/ProductGrid"
import Link from "next/link"

export default function HomePage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [latestProducts, setLatestProducts] = useState([])

  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    try {
      // Hauptprodukte laden
      const res = await fetch("/api/products?limit=8")
      const data = await res.json()
      setProducts(data.products)

      // Featured Produkte (mit Rabatt)
      const featuredRes = await fetch("/api/products?has_discount=true&limit=4")
      const featuredData = await featuredRes.json()
      setFeaturedProducts(featuredData.products)

      // Neueste Produkte
      const latestRes = await fetch("/api/products?sort=newest&limit=4")
      const latestData = await latestRes.json()
      setLatestProducts(latestData.products)

    } catch (error) {
      console.error("Fehler beim Laden der Produkte:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Willkommen bei E-Shop
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Entdecke unsere hochwertigen Produkte zu besten Preisen
            </p>
            <Link
              href="/products"
              className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
            >
              Jetzt einkaufen →
            </Link>
          </div>
        </div>
      </div>

      {/* Angebote Section */}
      {featuredProducts.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              🔥 Heiße Angebote
            </h2>
            <Link href="/products?filter=discount" className="text-blue-600 hover:text-blue-500">
              Alle anzeigen →
            </Link>
          </div>
          <ProductGrid products={featuredProducts} loading={loading} />
        </div>
      )}

      {/* Hauptprodukte Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            📦 Beliebte Produkte
          </h2>
          <Link href="/products" className="text-blue-600 hover:text-blue-500">
            Alle anzeigen →
          </Link>
        </div>
        <ProductGrid products={products} loading={loading} />
      </div>

      {/* Neue Produkte Section */}
      {latestProducts.length > 0 && (
        <div className="bg-white dark:bg-gray-800 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                🆕 Neu eingetroffen
              </h2>
              <Link href="/products?sort=newest" className="text-blue-600 hover:text-blue-500">
                Alle anzeigen →
              </Link>
            </div>
            <ProductGrid products={latestProducts} loading={loading} />
          </div>
        </div>
      )}

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="text-4xl mb-3">🚚</div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Kostenloser Versand
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Ab 50€ Bestellwert
            </p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-3">🔄</div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              30 Tage Rückgaberecht
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Einfach und unkompliziert
            </p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-3">🔒</div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Sichere Zahlung
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              SSL-verschlüsselt
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
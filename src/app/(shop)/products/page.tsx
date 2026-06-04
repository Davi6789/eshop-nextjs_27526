// src/app/(shop)/products/page.tsx

"use client"

import { useState, useEffect } from "react"
import ProductGrid from "@/components/ui/ProductGrid"
import { supabase } from "@/lib/supabase/client"

export default function ProductsPage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [categories, setCategories] = useState<string[]>([])
  const [selectedCategory, setSelectedCategory] = useState("alle")
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("newest")
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 })

  useEffect(() => {
    loadCategories()
    loadProducts()
  }, [selectedCategory, searchTerm, sortBy, priceRange])

  const loadCategories = async () => {
    const { data } = await supabase
      .from("products")
      .select("category")
      .not("category", "is", null)
    
    if (data) {
      const unique = [...new Set(data.map(p => p.category))]
      setCategories(unique)
    }
  }

  const loadProducts = async () => {
    setLoading(true)
    try {
      let url = `/api/products?limit=20&sort=${sortBy}`
      if (selectedCategory !== "alle") {
        url += `&category=${selectedCategory}`
      }
      if (searchTerm) {
        url += `&search=${searchTerm}`
      }
      if (priceRange.min > 0) {
        url += `&minPrice=${priceRange.min}`
      }
      if (priceRange.max < 1000) {
        url += `&maxPrice=${priceRange.max}`
      }
      
      const res = await fetch(url)
      const data = await res.json()
      setProducts(data.products)
    } catch (error) {
      console.error("Fehler:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Alle Produkte
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Entdecke unsere vielfältige Produktauswahl
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="🔍 Produkte suchen..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-96 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-8">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg dark:bg-gray-800 dark:text-white"
          >
            <option value="alle">Alle Kategorien</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg dark:bg-gray-800 dark:text-white"
          >
            <option value="newest">Neueste zuerst</option>
            <option value="price_asc">Preis aufsteigend</option>
            <option value="price_desc">Preis absteigend</option>
            <option value="rating">Beste Bewertung</option>
          </select>

          <div className="flex items-center space-x-2">
            <span className="text-gray-600 dark:text-gray-400">Preis:</span>
            <input
              type="number"
              placeholder="Min"
              value={priceRange.min || ""}
              onChange={(e) => setPriceRange({ ...priceRange, min: Number(e.target.value) })}
              className="w-24 px-2 py-1 border rounded dark:bg-gray-800"
            />
            <span>-</span>
            <input
              type="number"
              placeholder="Max"
              value={priceRange.max === 1000 ? "" : priceRange.max}
              onChange={(e) => setPriceRange({ ...priceRange, max: Number(e.target.value) })}
              className="w-24 px-2 py-1 border rounded dark:bg-gray-800"
            />
          </div>
        </div>

        {/* Product Grid */}
        <ProductGrid products={products} loading={loading} />

        {/* Results count */}
        {!loading && (
          <div className="mt-8 text-center text-gray-600 dark:text-gray-400">
            {products.length} Produkte gefunden
          </div>
        )}
      </div>
    </div>
  )
}
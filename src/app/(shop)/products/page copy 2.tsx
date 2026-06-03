// src/app/(shop)/products/page.tsx (Produktliste)

"use client"

import { useEffect, useState, useCallback, useRef } from "react"
import { useSearchParams } from "next/navigation"
//import ProductCard from "@/components/ui/ProductCard"
import ProductGrid from "@/components/ui/ProductGrid"
import SearchBar from "@/components/ui/SearchBar"
import CategoryFilter from "@/components/ui/CategoryFilter"
import PriceFilter from "@/components/ui/PriceFilter"

function ProductsContent() {
  const searchParams = useSearchParams()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)
  const [sortBy, setSortBy] = useState(searchParams.get("sort") || "newest")
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const initialLoadDone = useRef(false)

  // export default function ProductsPage() {
  // const searchParams = useSearchParams()
  // const [products, setProducts] = useState([])
  // const [loading, setLoading] = useState(true)
  // const initialLoadDone = useRef(false) // ← Verhindert doppelte Loads

  const loadProducts = useCallback(async () => {
    setLoading(true)
    const page = searchParams.get("page") || "1"
    const res = await fetch(`/api/products?page=${page}&sort=newest&limit=20`)
    const data = await res.json()
    setProducts(data.products || [])
    setLoading(false)
  }, [searchParams]) // ← Nur wenn searchParams sich ändert

  // Nur einmal beim ersten Mount laden
  useEffect(() => {
    if (!initialLoadDone.current) {
      initialLoadDone.current = true
      loadProducts()
    }
  }, [loadProducts]) // ← Nur einmal beim Mount

  // Bei Änderung von searchParams oder sortBy neu laden
  useEffect(() => {
    loadProducts()
  }, [searchParams, sortBy])

  let globalRequestCount = 0

export default function ProductsPage() {
  useEffect(() => {
    globalRequestCount++
    if (globalRequestCount > 1) {
      console.warn("🚨 Zu viele Requests!", globalRequestCount)
    }
  }, [])
  const loadProducts = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams(searchParams)
      params.set("sort", sortBy)
      params.set("limit", "20")
      
      const res = await fetch(`/api/products?${params.toString()}`)
      const data = await res.json()
      setProducts(data.products)
      setTotal(data.total)
    } catch (error) {
      console.error("Fehler:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSortChange = (value: string) => {
    setSortBy(value)
    const params = new URLSearchParams(searchParams)
    params.set("sort", value)
    window.history.pushState({}, "", `/products?${params.toString()}`)
  }

  const clearFilters = () => {
    window.location.href = "/products"
  }

  const hasActiveFilters = searchParams.toString().length > 0

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Alle Produkte
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            {total} Produkte gefunden
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <SearchBar />
        </div>

        {/* Mobile Filter Button */}
        <button
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className="mb-4 md:hidden w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 py-2 rounded-lg"
        >
          {isFilterOpen ? "▼ Filter schließen" : "▲ Filter öffnen"}
        </button>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className={`${isFilterOpen ? "block" : "hidden"} md:block w-full md:w-64 space-y-6`}>
            <CategoryFilter />
            <PriceFilter />
            
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="w-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition"
              >
                Alle Filter zurücksetzen
              </button>
            )}
          </div>

          {/* Products Area */}
          <div className="flex-1">
            {/* Sortierung */}
            <div className="mb-6 flex justify-end">
              <select
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg dark:bg-gray-800 dark:text-white"
              >
                <option value="newest">Neueste zuerst</option>
                <option value="price_asc">Preis aufsteigend</option>
                <option value="price_desc">Preis absteigend</option>
                <option value="rating">Beste Bewertung</option>
              </select>
            </div>

            {/* Product Grid */}
            <ProductGrid products={products} loading={loading} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="text-center py-12">Laden...</div>}>
      <ProductsContent />
    </Suspense>
  )
}
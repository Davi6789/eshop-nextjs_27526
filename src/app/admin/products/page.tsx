//   src/app/admin/products/page.tsx

"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface Product {
  id: string
  title: string
  slug: string
  price: number
  discount_price: number | null
  stock: number
  category: string
  image_url: string | null
  created_at: string
}

export default function AdminProductsPage() {
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    loadProducts()
  }, [searchTerm, page])

  const loadProducts = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (searchTerm) params.append("search", searchTerm)
      params.append("page", page.toString())
      params.append("limit", "20")

      const res = await fetch(`/api/admin/products?${params.toString()}`)
      const data = await res.json()
      setProducts(data.products)
      setTotalPages(data.totalPages)
    } catch (error) {
      console.error("Fehler beim Laden:", error)
    } finally {
      setLoading(false)
    }
  }

  const deleteProduct = async (id: string, title: string) => {
    if (!confirm(`Produkt "${title}" wirklich löschen?`)) return

    try {
      const res = await fetch(`/api/admin/products?id=${id}`, {
        method: "DELETE",
      })

      if (res.ok) {
        loadProducts()
      } else {
        alert("Fehler beim Löschen")
      }
    } catch (error) {
      console.error("Delete Error:", error)
      alert("Fehler beim Löschen")
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("de-DE", {
      style: "currency",
      currency: "EUR"
    }).format(price)
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("de-DE")
  }

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Produkte verwalten
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {products.length} Produkte insgesamt
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
        >
          <span>➕</span> Neues Produkt
        </Link>
      </div>

      {/* Search */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-6">
        <div className="flex gap-4">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Produkte suchen..."
            className="flex-1 px-3 py-2 border rounded-lg dark:bg-gray-700"
          />
          <button
            onClick={() => {
              setSearchTerm("")
              setPage(1)
            }}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
          >
            Zurücksetzen
          </button>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase">Bild</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase">Kategorie</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase">Preis</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase">Lager</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase">Erstellt</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase">Aktionen</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i}>
                    <td colSpan={7} className="px-6 py-4">
                      <div className="animate-pulse h-4 bg-gray-200 rounded"></div>
                    </td>
                  </tr>
                ))
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    Keine Produkte gefunden
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4">
                      {product.image_url ? (
                        <img
                          src={product.image_url}
                          alt={product.title}
                          className="w-12 h-12 object-cover rounded"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                          📷
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 font-medium">{product.title}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-sm">
                        {product.category || "—"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {product.discount_price ? (
                        <div>
                          <span className="text-red-600 font-medium">
                            {formatPrice(product.discount_price)}
                          </span>
                          <span className="text-gray-400 line-through text-sm ml-2">
                            {formatPrice(product.price)}
                          </span>
                        </div>
                      ) : (
                        <span className="font-medium">{formatPrice(product.price)}</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-sm ${
                        product.stock > 10
                          ? "bg-green-100 text-green-800"
                          : product.stock > 0
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}>
                        {product.stock} Stück
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">{formatDate(product.created_at)}</td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <Link
                          href={`/admin/products/${product.id}`}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          Bearbeiten
                        </Link>
                        <button
                          onClick={() => deleteProduct(product.id, product.title)}
                          className="text-red-600 hover:text-red-800"
                        >
                          Löschen
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t flex justify-between items-center">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 border rounded-lg disabled:opacity-50"
            >
              ← Zurück
            </button>
            <span>
              Seite {page} von {totalPages}
            </span>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-4 py-2 border rounded-lg disabled:opacity-50"
            >
              Weiter →
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
//      src/app/admin/products/[id]/page.tsx

"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import ProductForm from "@/components/admin/ProductForm"

export default function EditProductPage() {
  const params = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadProduct()
  }, [params.id])

  const loadProduct = async () => {
    try {
      const res = await fetch(`/api/products/${params.id}`)
      const data = await res.json()
      setProduct(data)
    } catch (error) {
      console.error("Fehler:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Produkt bearbeiten
      </h1>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <ProductForm product={product} isEditing={true} />
      </div>
    </div>
  )
}
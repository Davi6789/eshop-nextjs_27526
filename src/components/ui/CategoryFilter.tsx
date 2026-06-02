//  src/components/ui/CategoryFilter.tsx

"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { supabase } from "@/lib/supabase/client"

export default function CategoryFilter() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [categories, setCategories] = useState<{ name: string; count: number }[]>([])
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "alle")

  useEffect(() => {
    loadCategoriesWithCount()
  }, [])

  const loadCategoriesWithCount = async () => {
    const { data } = await supabase
      .from("products")
      .select("category")
      .not("category", "is", null)

    if (data) {
      const counts = data.reduce((acc: any, curr) => {
        acc[curr.category] = (acc[curr.category] || 0) + 1
        return acc
      }, {})

      const categoriesList = Object.entries(counts).map(([name, count]) => ({
        name,
        count: count as number
      }))

      setCategories(categoriesList)
    }
  }

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category)
    const params = new URLSearchParams(searchParams)
    
    if (category === "alle") {
      params.delete("category")
    } else {
      params.set("category", category)
    }
    params.set("page", "1")
    
    router.push(`/products?${params.toString()}`)
  }

  const categoriesList = [
    { name: "alle", count: null },
    ...categories
  ]

  return (
    <div className="space-y-2">
      <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
        Kategorien
      </h3>
      <div className="flex flex-wrap gap-2">
        {categoriesList.map((cat) => (
          <button
            key={cat.name}
            onClick={() => handleCategoryChange(cat.name)}
            className={`px-3 py-1 rounded-full text-sm transition ${
              selectedCategory === cat.name
                ? "bg-blue-600 text-white"
                : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
            }`}
          >
            {cat.name === "alle" ? "Alle" : cat.name}
            {cat.count !== null && (
              <span className="ml-1 text-xs opacity-75">({cat.count})</span>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}
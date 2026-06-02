//  src/components/ui/PriceFilter.tsx

"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"

export default function PriceFilter() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [minPrice, setMinPrice] = useState<number>(() => {
    const min = searchParams.get("minPrice")
    return min ? parseInt(min) : 0
  })
  
  const [maxPrice, setMaxPrice] = useState<number>(() => {
    const max = searchParams.get("maxPrice")
    return max ? parseInt(max) : 500
  })
  
  const [tempMax, setTempMax] = useState(maxPrice)

  useEffect(() => {
    const timeout = setTimeout(() => {
      const params = new URLSearchParams(searchParams)
      
      if (minPrice > 0) {
        params.set("minPrice", minPrice.toString())
      } else {
        params.delete("minPrice")
      }
      
      if (maxPrice < 500) {
        params.set("maxPrice", maxPrice.toString())
      } else {
        params.delete("maxPrice")
      }
      
      params.set("page", "1")
      router.push(`/products?${params.toString()}`)
    }, 300)

    return () => clearTimeout(timeout)
  }, [minPrice, maxPrice, router, searchParams])

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value)
    setTempMax(value)
    setMaxPrice(value)
  }

  return (
    <div className="space-y-3">
      <h3 className="font-semibold text-gray-900 dark:text-white">
        Preisbereich
      </h3>
      
      <div className="flex items-center justify-between gap-2">
        <div className="flex-1">
          <label className="text-xs text-gray-500 dark:text-gray-400">Min</label>
          <input
            type="number"
            value={minPrice}
            onChange={(e) => setMinPrice(parseInt(e.target.value) || 0)}
            className="w-full px-2 py-1 border border-gray-300 dark:border-gray-700 rounded dark:bg-gray-800"
            placeholder="0"
          />
        </div>
        <span className="text-gray-500">-</span>
        <div className="flex-1">
          <label className="text-xs text-gray-500 dark:text-gray-400">Max</label>
          <input
            type="number"
            value={maxPrice}
            onChange={(e) => setMaxPrice(parseInt(e.target.value) || 500)}
            className="w-full px-2 py-1 border border-gray-300 dark:border-gray-700 rounded dark:bg-gray-800"
            placeholder="500"
          />
        </div>
      </div>
      
      <input
        type="range"
        min="0"
        max="500"
        value={tempMax}
        onChange={handleMaxChange}
        className="w-full"
      />
      
      <div className="flex justify-between text-xs text-gray-500">
        <span>0€</span>
        <span>100€</span>
        <span>200€</span>
        <span>300€</span>
        <span>400€</span>
        <span>500€+</span>
      </div>
    </div>
  )
}
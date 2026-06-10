//  src/components/ui/SearchBar.tsx (Debounce)

"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"

export default function SearchBar() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [searchTerm, setSearchTerm] = useState(searchParams.get("q") || "")
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Debounced search function
  const debouncedSearch = useCallback((value: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)

    timeoutRef.current = setTimeout(() => {
      const params = new URLSearchParams(searchParams)
      if (value) params.set("q", value)
      else params.delete("q")
      params.set("page", "1")
      router.push(`/products?${params.toString()}`)
    }, 500) // ← 500ms Verzögerung
  }, [router, searchParams])

  // Fetch search suggestions
  const fetchSuggestions = useCallback(async (term: string) => {
    if (term.length < 2) {
      setSuggestions([])
      return
    }

    try {
      const res = await fetch(`/api/products/suggestions?q=${term}`)
      const data = await res.json()
      setSuggestions(data.suggestions || [])
    } catch (error) {
      console.error("Error fetching suggestions:", error)
      setSuggestions([])
    }
  }, [])

  // ✅ NUR EINE handleChange Funktion!
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchTerm(value)
    debouncedSearch(value)
    fetchSuggestions(value)
    setShowSuggestions(true)
  }

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  const handleSuggestionClick = (suggestion: string) => {
    setSearchTerm(suggestion)
    setShowSuggestions(false)
    
    // Suche mit dem ausgewählten Vorschlag durchführen
    const params = new URLSearchParams(searchParams)
    params.set("q", suggestion)
    params.set("page", "1")
    router.push(`/products?${params.toString()}`)
  }

  return (
    <div className="relative">
      <input
        type="text"
        value={searchTerm}
        onChange={handleChange}
        onFocus={() => setShowSuggestions(true)}
        onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
        placeholder="🔍 Produkte suchen..."
        className="w-full md:w-96 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
      />

      {/* Search Suggestions */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10">
          {suggestions.map((suggestion) => (
            <button
              key={suggestion}
              onClick={() => handleSuggestionClick(suggestion)}
              className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
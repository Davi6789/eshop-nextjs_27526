//  src/components/ui/ReviewList.tsx    

"use client"

import { useState, useEffect } from "react"
import StarRating from "./StarRating"

interface Review {
  id: string
  rating: number
  title: string
  comment: string
  verified_purchase: boolean
  created_at: string
  users: {
    name: string
    avatar_url: string | null
  }
}

interface ReviewListProps {
  productId: string
}

export default function ReviewList({ productId }: ReviewListProps) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [sort, setSort] = useState("newest")
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    loadReviews()
  }, [productId, sort, page])

  const loadReviews = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/reviews?productId=${productId}&sort=${sort}&page=${page}&limit=10`)
      const data = await res.json()
      setReviews(data.reviews)
      setTotalPages(data.totalPages)
    } catch (error) {
      console.error("Fehler beim Laden der Bewertungen:", error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("de-DE", {
      year: "numeric",
      month: "long",
      day: "numeric"
    })
  }

  if (loading && reviews.length === 0) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="animate-pulse bg-white dark:bg-gray-800 rounded-lg p-6">
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/4 mb-2"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
            <div className="h-20 bg-gray-300 dark:bg-gray-700 rounded"></div>
          </div>
        ))}
      </div>
    )
  }

  if (reviews.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg p-8 text-center">
        <p className="text-gray-500 dark:text-gray-400">
          Noch keine Bewertungen. Sei der Erste, der dieses Produkt bewertet!
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Sortierung */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {reviews.length} Bewertungen
        </h3>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="px-3 py-1 border border-gray-300 dark:border-gray-700 rounded-lg text-sm dark:bg-gray-800"
        >
          <option value="newest">Neueste zuerst</option>
          <option value="oldest">Älteste zuerst</option>
          <option value="highest">Höchste Bewertung</option>
          <option value="lowest">Niedrigste Bewertung</option>
          <option value="helpful">Hilfreichste</option>
        </select>
      </div>

      {/* Reviews Liste */}
      <div className="space-y-4">
        {reviews.map((review) => (
          <div key={review.id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <StarRating rating={review.rating} readonly size="sm" />
                  {review.verified_purchase && (
                    <span className="text-xs bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 px-2 py-0.5 rounded">
                      Verifizierter Kauf
                    </span>
                  )}
                </div>
                
                <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                  {review.title}
                </h4>
                
                <p className="text-gray-600 dark:text-gray-400 mb-3">
                  {review.comment}
                </p>
                
                <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-500">
                  <span>von {review.users?.name || "Anonymer Benutzer"}</span>
                  <span>•</span>
                  <span>{formatDate(review.created_at)}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Paginierung */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1 border border-gray-300 dark:border-gray-700 rounded disabled:opacity-50"
          >
            ← Zurück
          </button>
          <span className="px-3 py-1 text-gray-700 dark:text-gray-300">
            Seite {page} von {totalPages}
          </span>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-3 py-1 border border-gray-300 dark:border-gray-700 rounded disabled:opacity-50"
          >
            Weiter →
          </button>
        </div>
      )}
    </div>
  )
}
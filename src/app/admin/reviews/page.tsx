//  src/app/admin/reviews/page.tsx 

"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase/client"
import StarRating from "@/components/ui/StarRating"

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("pending")

  useEffect(() => {
    loadReviews()
  }, [filter])

  const loadReviews = async () => {
    setLoading(true)
    const { data } = await supabase
      .from("reviews")
      .select(`
        *,
        users (name, email),
        products (title, slug)
      `)
      .eq("status", filter)
      .order("created_at", { ascending: false })

    if (data) setReviews(data)
    setLoading(false)
  }

  const moderateReview = async (id: string, status: string) => {
    const res = await fetch(`/api/reviews/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status })
    })

    if (res.ok) {
      loadReviews()
    }
  }

  const deleteReview = async (id: string) => {
    if (confirm("Bewertung wirklich löschen?")) {
      const res = await fetch(`/api/reviews/${id}`, {
        method: "DELETE"
      })
      if (res.ok) {
        loadReviews()
      }
    }
  }

  if (loading) {
    return <div className="p-8">Laden...</div>
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Bewertungen moderieren</h1>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6">
        {["pending", "approved", "rejected"].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg ${
              filter === status
                ? "bg-blue-600 text-white"
                : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
            }`}
          >
            {status === "pending" && "⏳ Ausstehend"}
            {status === "approved" && "✅ Genehmigt"}
            {status === "rejected" && "❌ Abgelehnt"}
          </button>
        ))}
      </div>

      {/* Reviews Liste */}
      <div className="space-y-4">
        {reviews.map((review) => (
          <div key={review.id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <StarRating rating={review.rating} readonly size="sm" />
                  <span className="text-sm text-gray-500">
                    von {review.users?.name || review.users?.email}
                  </span>
                </div>
                
                <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                  {review.title}
                </h4>
                
                <p className="text-gray-600 dark:text-gray-400 mb-2">
                  {review.comment}
                </p>
                
                <div className="text-sm text-gray-500">
                  Produkt: {review.products?.title}
                </div>
                
                <div className="text-xs text-gray-400 mt-1">
                  {new Date(review.created_at).toLocaleString("de-DE")}
                </div>
              </div>
              
              <div className="flex gap-2">
                {filter === "pending" && (
                  <>
                    <button
                      onClick={() => moderateReview(review.id, "approved")}
                      className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                    >
                      ✅ Genehmigen
                    </button>
                    <button
                      onClick={() => moderateReview(review.id, "rejected")}
                      className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                      ❌ Ablehnen
                    </button>
                  </>
                )}
                <button
                  onClick={() => deleteReview(review.id)}
                  className="px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700"
                >
                  🗑 Löschen
                </button>
              </div>
            </div>
          </div>
        ))}

        {reviews.length === 0 && (
          <div className="text-center text-gray-500 py-8">
            Keine Bewertungen in dieser Kategorie
          </div>
        )}
      </div>
    </div>
  )
}
//  src/components/forms/ReviewForm.tsx    

"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import StarRating from "@/components/ui/StarRating"

interface ReviewFormProps {
  productId: string
  onReviewSubmitted: () => void
}

export default function ReviewForm({ productId, onReviewSubmitted }: ReviewFormProps) {
  const { data: session } = useSession()
  const [rating, setRating] = useState(0)
  const [title, setTitle] = useState("")
  const [comment, setComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  if (!session) {
    return (
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 text-center">
        <p className="text-gray-600 dark:text-gray-400">
          🔒 Bitte <a href="/login" className="text-blue-600 hover:underline">melde dich an</a>, 
          um eine Bewertung zu schreiben.
        </p>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")
    setSuccess("")

    if (rating === 0) {
      setError("Bitte wähle eine Sternebewertung")
      setIsSubmitting(false)
      return
    }

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId,
          rating,
          title,
          comment
        })
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Fehler beim Speichern")
      }

      setSuccess("Vielen Dank für deine Bewertung! Sie wird nach Prüfung freigeschaltet.")
      setRating(0)
      setTitle("")
      setComment("")
      onReviewSubmitted()
      
      setTimeout(() => setSuccess(""), 5000)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        Schreibe eine Bewertung
      </h3>

      {error && (
        <div className="mb-4 bg-red-50 dark:bg-red-900/20 border border-red-200 rounded-lg p-3">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {success && (
        <div className="mb-4 bg-green-50 dark:bg-green-900/20 border border-green-200 rounded-lg p-3">
          <p className="text-sm text-green-600 dark:text-green-400">{success}</p>
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Deine Bewertung *
          </label>
          <StarRating rating={rating} onRatingChange={setRating} />
        </div>

        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Titel
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            placeholder="Z.B. 'Tolles Produkt!'"
          />
        </div>

        <div>
          <label htmlFor="comment" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Deine Erfahrung *
          </label>
          <textarea
            id="comment"
            rows={4}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            placeholder="Was gefällt dir besonders? Teile deine Erfahrungen..."
            required
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
        >
          {isSubmitting ? "Wird gespeichert..." : "Bewertung abschicken"}
        </button>
      </div>
    </form>
  )
}
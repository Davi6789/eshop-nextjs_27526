//  src/components/ui/StarRating.tsx

"use client"

import { useState } from "react"

interface StarRatingProps {
  rating: number
  onRatingChange?: (rating: number) => void
  readonly?: boolean
  size?: "sm" | "md" | "lg"
}

export default function StarRating({ 
  rating, 
  onRatingChange, 
  readonly = false,
  size = "md" 
}: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState(0)
  
  const sizes = {
    sm: "text-sm",
    md: "text-xl",
    lg: "text-3xl"
  }

  const handleClick = (value: number) => {
    if (!readonly && onRatingChange) {
      onRatingChange(value)
    }
  }

  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => {
        const isFilled = (hoverRating || rating) >= star
        
        return (
          <button
            key={star}
            type="button"
            onClick={() => handleClick(star)}
            onMouseEnter={() => !readonly && setHoverRating(star)}
            onMouseLeave={() => !readonly && setHoverRating(0)}
            className={`${readonly ? "cursor-default" : "cursor-pointer"} transition-colors`}
            disabled={readonly}
          >
            <span className={`${sizes[size]} ${isFilled ? "text-yellow-400" : "text-gray-300"}`}>
              ★
            </span>
          </button>
        )
      })}
    </div>
  )
}
//  src/components/ui/WishlistButton.tsx

"use client"

import { useState, useEffect } from "react"
import { useWishlist } from "@/context/WishlistContext"

interface WishlistButtonProps {
  productId: string
  size?: "sm" | "md" | "lg"
  showText?: boolean
  className?: string
}

export default function WishlistButton({ 
  productId, 
  size = "md",
  showText = false,
  className = ""
}: WishlistButtonProps) {
  const { isInWishlist, toggleWishlist, isLoading } = useWishlist()
  const [isAnimating, setIsAnimating] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  const inWishlist = isInWishlist(productId)

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    setIsAnimating(true)
    await toggleWishlist(productId)
    setTimeout(() => setIsAnimating(false), 300)
  }

  const sizes = {
    sm: "w-6 h-6 text-sm",
    md: "w-8 h-8 text-base",
    lg: "w-10 h-10 text-xl"
  }

  const iconSizes = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-xl"
  }

  return (
    <button
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      disabled={isLoading}
      className={`
        relative flex items-center justify-center rounded-full 
        transition-all duration-300 
        ${sizes[size]}
        ${inWishlist 
          ? "bg-red-500 text-white hover:bg-red-600" 
          : "bg-white dark:bg-gray-800 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
        }
        ${isAnimating ? "scale-125" : "scale-100"}
        ${className}
      `}
    >
      <span className={`${iconSizes[size]} ${isAnimating ? "animate-ping absolute" : ""}`}>
        {inWishlist ? "❤️" : "🤍"}
      </span>
      {showText && (
        <span className="ml-2 text-sm">
          {inWishlist ? "Auf der Wunschliste" : "Zur Wunschliste"}
        </span>
      )}
      
      {/* Tooltip */}
      {isHovered && !showText && (
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
          {inWishlist ? "Entfernen" : "Zur Wunschliste"}
        </div>
      )}
    </button>
  )
}
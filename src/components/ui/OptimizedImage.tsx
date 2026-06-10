 // src/components/ui/OptimizedImage.tsx  (Optimierte Image)

 "use client"

import Image from "next/image"
import { useState } from "react"

interface OptimizedImageProps {
  src: string | null
  alt: string
  fill?: boolean
  className?: string
  sizes?: string
  priority?: boolean
}

export default function OptimizedImage({ 
  src, 
  alt, 
  fill = false, 
  className = "",
  sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
  priority = false
}: OptimizedImageProps) {
  const [error, setError] = useState(false)

  if (!src || error) {
    return (
      <div className={`flex items-center justify-center bg-gray-200 dark:bg-gray-700 ${className}`}>
        <span className="text-gray-400 text-4xl">📷</span>
      </div>
    )
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill={fill}
      className={`object-cover ${className}`}
      sizes={sizes}
      priority={priority}
      loading={priority ? "eager" : "lazy"}
      onError={() => setError(true)}
    />
  )
}
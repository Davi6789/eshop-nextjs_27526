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
  width?: number
  height?: number
}

export default function OptimizedImage({ 
  src, 
  alt, 
  fill = false, 
  className = "",
  sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
  priority = false,
  width,
  height

}: OptimizedImageProps) {
  const [error, setError] = useState(false)
  const [loaded, setLoaded] = useState(false)

  if (!src || error) {
    return (
      <div className={`flex items-center justify-center bg-gray-200 dark:bg-gray-700 ${className}`}>
        <span className="text-gray-400 text-4xl">📷</span>
      </div>
    )
  }

  // Lazy Loading Strategie
  const loadingStrategy = priority ? "eager" : "lazy"

  return (
    <div className="relative w-full h-full">
      {!loaded && (
        <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse" />
      )}
      <Image
        src={src}
        alt={alt}
        fill={fill}
        width={!fill ? width : undefined}
        height={!fill ? height : undefined}
        className={`object-cover transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"} ${className}`}
        sizes={sizes}
        priority={priority}
        loading={loadingStrategy}
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
        quality={80}
    />
    </div>
  )
}
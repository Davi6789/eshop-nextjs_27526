// src/components/ui/ProductGallery.tsx

"use client"

import { useState } from "react"
import Image from "next/image"

interface ProductGalleryProps {
  images: string[]
  title: string
}

export default function ProductGallery({ images, title }: ProductGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0)
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)

  const displayImages = images && images.length > 0 ? images : []
  const mainImage = displayImages[selectedImage] || displayImages[0]
  const hasMultipleImages = displayImages.length > 1

  if (!mainImage) {
    return (
      <div className="w-full aspect-square bg-gray-200 rounded-lg flex items-center justify-center">
        <span className="text-gray-400">Kein Bild</span>
      </div>
    )
  }

  const nextImage = () => setSelectedImage((prev) => (prev + 1) % displayImages.length)
  const prevImage = () => setSelectedImage((prev) => (prev - 1 + displayImages.length) % displayImages.length)

  return (
    <>
      <div className="space-y-4">
        {/* Hauptbild */}
        <div
          className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden cursor-pointer hover:shadow-lg transition"
          onClick={() => setIsLightboxOpen(true)}
        >
          <Image
            src={mainImage}
            alt={title}
            fill
            unoptimized
            priority
            className="object-cover hover:scale-105 transition"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>

        {/* Thumbnails */}
        {hasMultipleImages && (
          <div className="flex gap-2 overflow-x-auto">
            {displayImages.map((img, i) => (
              <button
                key={i}
                onClick={() => setSelectedImage(i)}
                className={`w-20 h-20 rounded border-2 flex-shrink-0 overflow-hidden transition ${
                  selectedImage === i ? "border-blue-500" : "border-gray-300"
                }`}
              >
                <Image
                  src={img}
                  alt=""
                  width={80}
                  height={80}
                  unoptimized
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}

        {/* Info */}
        {hasMultipleImages && (
          <p className="text-sm text-gray-500 text-center">
            Bild {selectedImage + 1} von {displayImages.length}
          </p>
        )}
      </div>

      {/* Lightbox */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4" onClick={() => setIsLightboxOpen(false)}>
          <div className="relative" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setIsLightboxOpen(false)} className="absolute -top-10 right-0 text-white text-3xl">✕</button>
            <Image src={mainImage} alt={title} width={800} height={800} unoptimized className="max-w-full max-h-[80vh]" />
            {hasMultipleImages && (
              <>
                <button onClick={prevImage} className="absolute left-4 top-1/2 -translate-y-1/2 text-white text-3xl bg-black/50 p-2 rounded">◀</button>
                <button onClick={nextImage} className="absolute right-4 top-1/2 -translate-y-1/2 text-white text-3xl bg-black/50 p-2 rounded">▶</button>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-sm bg-black/50 px-3 py-1 rounded">{selectedImage + 1} / {displayImages.length}</div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}
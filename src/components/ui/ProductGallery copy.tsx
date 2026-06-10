//  src/components/ui/ProductGallery.tsx

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

  // Fallback wenn keine Bilder
  const displayImages = images && images.length > 0 ? images : ["/images/placeholder.jpg"]
  const mainImage = images[selectedImage] || displayImages[0]
  const hasMultipleImages = displayImages.length > 1

  const openLightbox = () => setIsLightboxOpen(true)
  const closeLightbox = () => setIsLightboxOpen(false)

  const nextImage = () => {
    setSelectedImage((prev) => (prev + 1) % displayImages.length)
  }

  const prevImage = () => {
    setSelectedImage((prev) => (prev - 1 + displayImages.length) % displayImages.length)
  }

  return (
    <>
      {/* Gallery Container */}
      <div className="space-y-4">
        {/* Hauptbild */}
        <div 
          className="relative aspect-square bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden cursor-pointer group border border-gray-200 dark:border-gray-700"
          onClick={openLightbox}
        >
          {mainImage ? (
            <>
              <Image
                src={mainImage}
                alt={title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
                unoptimized
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all flex items-center justify-center">
                <span className="opacity-0 group-hover:opacity-100 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm transition">
                  🔍 Vergrößern
                </span>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full">
              <span className="text-gray-400">Kein Bild</span>
            </div>
          )}
        </div>

        {/* Thumbnails */}
        {hasMultipleImages && (
          <div className="flex gap-2 overflow-x-auto pb-2">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all ${
                  selectedImage === index
                    ? "border-blue-500 ring-2 ring-blue-200"
                    : "border-gray-200 dark:border-gray-700 hover:border-gray-400"
                }`}
              >
                <Image
                  src={image}
                  alt={`${title} - Bild ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="80px"
                  unoptimized
                />
              </button>
            ))}
          </div>
        )}

        {/* Info */}
        {displayImages.length > 1 && (
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
            Bild {selectedImage + 1} von {displayImages.length}
          </p>
        )}
      </div>

      {/* Lightbox Modal */}
      {isLightboxOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center"
          onClick={closeLightbox}
        >
          <div 
            className="relative max-w-7xl w-full h-full flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Schließen Button */}
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 text-white hover:text-gray-300 text-3xl z-10 bg-black bg-opacity-50 rounded-full w-10 h-10 flex items-center justify-center"
            >
              ✕
            </button>

            {/* Hauptbild in Lightbox */}
            <div className="relative w-full h-full max-h-[80vh]">
              {mainImage && (
                <Image
                  src={mainImage}
                  alt={title}
                  fill
                  className="object-contain"
                  sizes="90vw"
                  unoptimized
                />
              )}
            </div>

            {/* Navigation Pfeile */}
            {hasMultipleImages && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 text-4xl bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-70 transition"
                >
                  ◀
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 text-4xl bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-70 transition"
                >
                  ▶
                </button>
              </>
            )}

            {/* Bildzähler */}
            {hasMultipleImages && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
                {selectedImage + 1} / {displayImages.length}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
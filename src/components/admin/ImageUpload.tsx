//  src/components/admin/ImageUpload.tsx

"use client"

import { useState } from "react"

interface ImageUploadProps {
  onUpload: (url: string) => void
  onRemove: (url: string) => void
  multiple?: boolean
  existingImages?: string[]
}

export default function ImageUpload({ onUpload, onRemove, multiple = false, existingImages = [] }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState("")

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setUploading(true)
    setError("")

    for (const file of Array.from(files)) {
      try {
        const formData = new FormData()
        formData.append("file", file)

        const res = await fetch("/api/admin/upload", {
          method: "POST",
          body: formData,
        })

        const data = await res.json()

        if (!res.ok) throw new Error(data.error || "Upload fehlgeschlagen")

        onUpload(data.url)
      } catch (err: any) {
        setError(err.message)
      }
    }

    setUploading(false)
    e.target.value = ""
  }

  return (
    <div className="space-y-3">
      {/* Vorhandene Bilder */}
      {existingImages.length > 0 && (
        <div className="flex flex-wrap gap-3">
          {existingImages.map((url) => (
            <div key={url} className="relative group">
              <img
                src={url}
                alt="Produktbild"
                className="w-24 h-24 object-cover rounded-lg border"
              />
              <button
                type="button"
                onClick={() => onRemove(url)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 text-xs hover:bg-red-600 flex items-center justify-center"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Upload Button */}
      <label className="flex items-center gap-2 cursor-pointer w-fit px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 transition-colors">
        <span className="text-gray-600 text-sm">
          {uploading ? "Wird hochgeladen..." : "📁 Bild auswählen"}
        </span>
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple={multiple}
          onChange={handleFileChange}
          disabled={uploading}
          className="hidden"
        />
      </label>

      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  )
}
 //    src/components/admin/ProductForm.tsx

 "use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

interface ProductFormProps {
  product?: any
  isEditing?: boolean
}

export default function ProductForm({ product, isEditing = false }: ProductFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  
  const [formData, setFormData] = useState({
    title: product?.title || "",
    slug: product?.slug || "",
    description: product?.description || "",
    price: product?.price || "",
    discount_price: product?.discount_price || "",
    discount_until: product?.discount_until?.split("T")[0] || "",
    category: product?.category || "",
    stock: product?.stock || 0,
    image_url: product?.image_url || "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const generateSlug = () => {
    const slug = formData.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
    setFormData({ ...formData, slug })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const url = isEditing ? `/api/admin/products` : `/api/admin/products`
      const method = isEditing ? "PUT" : "POST"
      
      const payload = {
        ...formData,
        id: product?.id,
        price: parseFloat(formData.price),
        discount_price: formData.discount_price ? parseFloat(formData.discount_price) : null,
        stock: parseInt(formData.stock.toString()),
      }

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Fehler beim Speichern")
      }

      router.push("/admin/products")
      router.refresh()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Title */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">Titel *</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            onBlur={generateSlug}
            required
            className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700"
          />
        </div>

        {/* Slug */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">Slug (URL)</label>
          <div className="flex gap-2">
            <input
              type="text"
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              className="flex-1 px-3 py-2 border rounded-lg dark:bg-gray-700"
            />
            <button
              type="button"
              onClick={generateSlug}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
            >
              Generieren
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-1">z.B. mein-produkt-name</p>
        </div>

        {/* Description */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">Beschreibung</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={5}
            className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700"
          />
        </div>

        {/* Price */}
        <div>
          <label className="block text-sm font-medium mb-1">Preis (€) *</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            step="0.01"
            required
            className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700"
          />
        </div>

        {/* Discount Price */}
        <div>
          <label className="block text-sm font-medium mb-1">Rabattpreis (€)</label>
          <input
            type="number"
            name="discount_price"
            value={formData.discount_price}
            onChange={handleChange}
            step="0.01"
            className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700"
          />
        </div>

        {/* Discount Until */}
        <div>
          <label className="block text-sm font-medium mb-1">Rabatt gültig bis</label>
          <input
            type="date"
            name="discount_until"
            value={formData.discount_until}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium mb-1">Kategorie</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700"
          >
            <option value="">Keine Kategorie</option>
            <option value="Elektronik">Elektronik</option>
            <option value="Computer">Computer</option>
            <option value="Gaming">Gaming</option>
            <option value="Sport">Sport</option>
            <option value="Audio">Audio</option>
            <option value="Zubehör">Zubehör</option>
            <option value="Smart Home">Smart Home</option>
            <option value="Foto">Foto</option>
            <option value="Möbel">Möbel</option>
          </select>
        </div>

        {/* Stock */}
        <div>
          <label className="block text-sm font-medium mb-1">Lagerbestand</label>
          <input
            type="number"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700"
          />
        </div>

        {/* Image URL */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">Bild URL</label>
          <input
            type="url"
            name="image_url"
            value={formData.image_url}
            onChange={handleChange}
            placeholder="https://example.com/image.jpg"
            className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700"
          />
          {formData.image_url && (
            <div className="mt-2">
              <img src={formData.image_url} alt="Vorschau" className="h-20 object-cover rounded" />
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-4">
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Wird gespeichert..." : isEditing ? "Aktualisieren" : "Erstellen"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600"
        >
          Abbrechen
        </button>
      </div>
    </form>
  )
}
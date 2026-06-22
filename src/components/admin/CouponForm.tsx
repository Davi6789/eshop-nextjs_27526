  // src/components/admin/CouponForm.tsx

"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

interface CouponFormProps {
  coupon?: any
  isEditing?: boolean
}

export default function CouponForm({ coupon, isEditing = false }: CouponFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  
  const [formData, setFormData] = useState({
    code: coupon?.code || "",
    discount_type: coupon?.discount_type || "percentage",
    discount_value: coupon?.discount_value || "",
    min_order_amount: coupon?.min_order_amount || "",
    max_discount: coupon?.max_discount || "",
    valid_from: coupon?.valid_from?.split("T")[0] || "",
    valid_until: coupon?.valid_until?.split("T")[0] || "",
    usage_limit: coupon?.usage_limit || "",
    is_active: coupon?.is_active ?? true,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const url = isEditing ? `/api/admin/coupons/${coupon.id}` : "/api/admin/coupons"
      const method = isEditing ? "PUT" : "POST"
      
      const payload = {
        ...formData,
        discount_value: parseFloat(formData.discount_value),
        min_order_amount: formData.min_order_amount ? parseFloat(formData.min_order_amount) : null,
        max_discount: formData.max_discount ? parseFloat(formData.max_discount) : null,
        usage_limit: formData.usage_limit ? parseInt(formData.usage_limit) : null,
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

      router.push("/admin/coupons")
      router.refresh()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Code */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">Gutscheincode *</label>
          <input
            type="text"
            name="code"
            value={formData.code}
            onChange={handleChange}
            required
            placeholder="z.B. WELCOME10"
            className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 uppercase"
          />
        </div>

        {/* Rabattart */}
        <div>
          <label className="block text-sm font-medium mb-1">Rabattart</label>
          <select
            name="discount_type"
            value={formData.discount_type}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700"
          >
            <option value="percentage">Prozent (%)</option>
            <option value="fixed">Fester Betrag (€)</option>
          </select>
        </div>

        {/* Rabattwert */}
        <div>
          <label className="block text-sm font-medium mb-1">Rabattwert *</label>
          <input
            type="number"
            name="discount_value"
            value={formData.discount_value}
            onChange={handleChange}
            required
            step="0.01"
            className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700"
          />
        </div>

        {/* Mindestbestellwert */}
        <div>
          <label className="block text-sm font-medium mb-1">Mindestbestellwert (€)</label>
          <input
            type="number"
            name="min_order_amount"
            value={formData.min_order_amount}
            onChange={handleChange}
            step="0.01"
            className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700"
          />
        </div>

        {/* Maximaler Rabatt */}
        <div>
          <label className="block text-sm font-medium mb-1">Maximaler Rabatt (€)</label>
          <input
            type="number"
            name="max_discount"
            value={formData.max_discount}
            onChange={handleChange}
            step="0.01"
            className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700"
          />
        </div>

        {/* Gültig ab */}
        <div>
          <label className="block text-sm font-medium mb-1">Gültig ab</label>
          <input
            type="date"
            name="valid_from"
            value={formData.valid_from}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700"
          />
        </div>

        {/* Gültig bis */}
        <div>
          <label className="block text-sm font-medium mb-1">Gültig bis</label>
          <input
            type="date"
            name="valid_until"
            value={formData.valid_until}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700"
          />
        </div>

        {/* Verwendungslimit */}
        <div>
          <label className="block text-sm font-medium mb-1">Verwendungslimit</label>
          <input
            type="number"
            name="usage_limit"
            value={formData.usage_limit}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700"
          />
        </div>

        {/* Aktiv */}
        <div className="flex items-center">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="is_active"
              checked={formData.is_active}
              onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
              className="w-4 h-4 text-blue-600 rounded"
            />
            <span className="text-sm font-medium">Aktiv</span>
          </label>
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
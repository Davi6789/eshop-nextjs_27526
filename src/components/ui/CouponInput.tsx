 // src/components/ui/CouponInput.tsx

 "use client"

import { useState } from "react"

interface CouponInputProps {
  onApply: (coupon: any) => void
  onRemove: () => void
  cartTotal: number
  appliedCoupon: any | null
}

export default function CouponInput({ onApply, onRemove, cartTotal, appliedCoupon }: CouponInputProps) {
  const [code, setCode] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const handleApply = async () => {
    if (!code.trim()) {
      setError("Bitte gib einen Gutscheincode ein")
      return
    }

    setIsLoading(true)
    setError("")
    setSuccess("")

    try {
      const res = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: code.toUpperCase(), cartTotal })
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Ungültiger Gutscheincode")
        return
      }

      setSuccess(`Gutschein "${code.toUpperCase()}" wurde angewendet!`)
      onApply(data.coupon)
      setCode("")
      
      setTimeout(() => setSuccess(""), 3000)
    } catch (err) {
      setError("Fehler beim Einlösen des Gutscheins")
    } finally {
      setIsLoading(false)
    }
  }

  if (appliedCoupon) {
    return (
      <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-green-700 dark:text-green-300 font-semibold">
              Gutschein angewendet!
            </p>
            <p className="text-sm text-green-600 dark:text-green-400">
              {appliedCoupon.discount_type === 'percentage' 
                ? `${appliedCoupon.discount_value}% Rabatt`
                : `${appliedCoupon.discount_amount}€ Rabatt`
              }
            </p>
          </div>
          <button
            onClick={onRemove}
            className="text-red-600 hover:text-red-700 text-sm"
          >
            Entfernen
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        Hast du einen Gutscheincode?
      </label>
      
      <div className="flex gap-2">
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          placeholder="z.B. WELCOME10"
          className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white uppercase"
        />
        <button
          onClick={handleApply}
          disabled={isLoading || !code}
          className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition disabled:opacity-50"
        >
          {isLoading ? "..." : "Einlösen"}
        </button>
      </div>
      
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
      
      {success && (
        <p className="text-sm text-green-600 dark:text-green-400">{success}</p>
      )}
      
      <div className="text-xs text-gray-500 dark:text-gray-400">
        <p>Verfügbare Codes: WELCOME10, SUMMER20, FREESHIPPING, BLACKFRIDAY25, SAVE50</p>
      </div>
    </div>
  )
}
 // src/components/ui/CouponInput.tsx

 "use client"

import { useState } from "react"

interface CouponInputProps {
  onApply: (coupon: any) => Promise<boolean> | void
  onRemove: () => void
  cartTotal: number
  appliedCoupon: any | null
  error?: string
}

export default function CouponInput({ 
  onApply, 
  onRemove, 
  cartTotal, 
  appliedCoupon, 
  error: externalError 
}: CouponInputProps) {
  const [code, setCode] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [internalError, setInternalError] = useState("")
  const [success, setSuccess] = useState("")
  
  const error = externalError || internalError

  const handleApply = async () => {
    if (!code.trim()) {
      setInternalError("Bitte gib einen Gutscheincode ein")
      return
    }

    setIsLoading(true)
    setInternalError("")
    setSuccess("")

    try {
      const res = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: code.toUpperCase(), cartTotal })
      })

      const data = await res.json()

      if (!res.ok) {
        setInternalError(data.error || "Ungültiger Gutscheincode")
        return
      }

      // Coupon-Daten an Parent weitergeben
      const couponData = {
        code: data.code,
        discountType: data.discount_type,
        discountValue: data.discount_value,
        discountAmount: data.discount_amount,
        minOrderAmount: data.min_order_amount
      }
      
      setSuccess(`Gutschein "${code.toUpperCase()}" wurde angewendet!`)
      onApply(couponData)
      setCode("")
      
      setTimeout(() => setSuccess(""), 3000)
    } catch (err) {
      setInternalError("Fehler beim Einlösen des Gutscheins")
    } finally {
      setIsLoading(false)
    }
  }

  // Wenn Coupon bereits angewendet wurde
  if (appliedCoupon) {
    return (
      <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-green-700 dark:text-green-300 font-semibold">
              🎉 Gutschein angewendet!
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
            className="text-red-600 hover:text-red-700 text-sm font-medium"
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

              {/* <div className="text-xs text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700 pt-2 mt-2">
        <p className="font-medium mb-1">Verfügbare Codes:</p>
        <ul className="space-y-0.5">
          <li>• <strong>WELCOME10</strong> - 10% Rabatt (kein Mindestbestellwert)</li>
          <li>• <strong>SUMMER20</strong> - 20% Rabatt (kein Mindestbestellwert)</li>
          <li>• <strong>SAVE50</strong> - 50€ Rabatt (Mindestbestellwert: 200€)</li>
          <li>• <strong>FREESHIPPING</strong> - Kostenloser Versand</li>
          <li>• <strong>BLACKFRIDAY25</strong> - 25% Rabatt</li>
        </ul> */}
      </div>
    </div>
  )
}
// src/app/admin/coupons/[id]/page.tsx 

"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import CouponForm from "@/components/admin/CouponForm"

export default function EditCouponPage() {
  const params = useParams()
  const [coupon, setCoupon] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadCoupon()
  }, [params.id])

  const loadCoupon = async () => {
    try {
      const res = await fetch(`/api/admin/coupons?id=${params.id}`)
      const data = await res.json()
      setCoupon(data)
    } catch (error) {
      console.error("Fehler:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Gutschein bearbeiten
      </h1>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <CouponForm coupon={coupon} isEditing={true} />
      </div>
    </div>
  )
}
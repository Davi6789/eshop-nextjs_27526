// src/app/admin/coupons/page.tsx

"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { supabase } from "@/lib/supabase/client"

interface Coupon {
  id: string
  code: string
  discount_type: string
  discount_value: number
  min_order_amount: number | null
  max_discount: number | null
  valid_from: string | null
  valid_until: string | null
  usage_limit: number | null
  used_count: number
  is_active: boolean
}

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadCoupons()
  }, [])

  const loadCoupons = async () => {
    const { data } = await supabase
      .from("coupons")
      .select("*")
      .order("created_at", { ascending: false })

    if (data) {
      setCoupons(data)
    }
    setLoading(false)
  }

  const toggleCouponStatus = async (id: string, isActive: boolean) => {
    const { error } = await supabase
      .from("coupons")
      .update({ is_active: !isActive })
      .eq("id", id)

    if (!error) {
      loadCoupons()
    }
  }

  const deleteCoupon = async (id: string) => {
    if (!confirm("Gutschein wirklich löschen?")) return

    const { error } = await supabase
      .from("coupons")
      .delete()
      .eq("id", id)

    if (!error) {
      loadCoupons()
    }
  }

  const formatDate = (date: string | null) => {
    if (!date) return "Unbegrenzt"
    return new Date(date).toLocaleDateString("de-DE")
  }

  const formatDiscount = (coupon: Coupon) => {
    if (coupon.discount_type === "percentage") {
      return `${coupon.discount_value}%`
    }
    return `${coupon.discount_value}€`
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Gutscheine verwalten
        </h1>
        <Link
          href="/admin/coupons/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          + Neuer Gutschein
        </Link>
      </div>

      {coupons.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-12 text-center">
          <p className="text-gray-500">Keine Gutscheine vorhanden</p>
          <Link
            href="/admin/coupons/new"
            className="text-blue-600 hover:text-blue-700 mt-2 inline-block"
          >
            Erstelle deinen ersten Gutschein →
          </Link>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase">Code</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase">Rabatt</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase">Mindestwert</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase">Gültig bis</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase">Verwendet</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium uppercase">Aktionen</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {coupons.map((coupon) => (
                <tr key={coupon.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 font-mono font-semibold">{coupon.code}</td>
                  <td className="px-6 py-4">{formatDiscount(coupon)}</td>
                  <td className="px-6 py-4">
                    {coupon.min_order_amount ? `${coupon.min_order_amount}€` : "—"}
                  </td>
                  <td className="px-6 py-4">{formatDate(coupon.valid_until)}</td>
                  <td className="px-6 py-4">
                    {coupon.used_count} / {coupon.usage_limit || "∞"}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        coupon.is_active
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {coupon.is_active ? "Aktiv" : "Inaktiv"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <Link
                      href={`/admin/coupons/${coupon.id}`}
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      Bearbeiten
                    </Link>
                    <button
                      onClick={() => toggleCouponStatus(coupon.id, coupon.is_active)}
                      className="text-yellow-600 hover:text-yellow-800 text-sm"
                    >
                      {coupon.is_active ? "Deaktivieren" : "Aktivieren"}
                    </button>
                    <button
                      onClick={() => deleteCoupon(coupon.id)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Löschen
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
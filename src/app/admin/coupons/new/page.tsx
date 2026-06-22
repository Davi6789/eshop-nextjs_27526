// src/app/admin/coupons/new/page.tsx  

import CouponForm from "@/components/admin/CouponForm"

export default function NewCouponPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Neuen Gutschein erstellen
      </h1>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <CouponForm isEditing={false} />
      </div>
    </div>
  )
}


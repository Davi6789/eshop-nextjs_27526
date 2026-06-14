// src/types/coupon.ts

export interface Coupon {
  id: string
  code: string
  discount_type: 'percentage' | 'fixed'
  discount_value: number
  min_order_amount: number
  max_discount?: number | null
  valid_from: string
  valid_until: string | null
  usage_limit: number | null
  used_count: number
  is_active: boolean
}

export interface AppliedCoupon {
  code: string
  discount_type: 'percentage' | 'fixed'
  discount_value: number
  discount_amount: number
  min_order_amount: number
}
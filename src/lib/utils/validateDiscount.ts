export function validateDiscount(discount: {
  discount_price: number | null
  discount_until: string | null
  price: number
}): boolean {
  if (!discount.discount_price || !discount.discount_until) {
    return false
  }
  const now = new Date()
  const discountUntil = new Date(discount.discount_until)
  return discountUntil > now && discount.discount_price < discount.price
}

import { validateDiscount } from '@/lib/utils/validateDiscount'

describe('validateDiscount', () => {
  it('returns true for active discount', () => {
    const futureDate = new Date()
    futureDate.setDate(futureDate.getDate() + 1)
    
    const discount = {
      discount_price: 50,
      discount_until: futureDate.toISOString(),
      price: 100
    }
    
    expect(validateDiscount(discount)).toBe(true)
  })
})

// src/lib/utils/__tests__/formatPrice.test.ts

import { formatPrice } from '@/lib/utils/formatPrice'

describe('formatPrice', () => {
  // it('formats integer price correctly', () => {
  //   // 1999 Cent = 19,99 €
  //   expect(formatPrice(1999)).toEqual('19,99 €')  // ← toEqual statt toBe
  // })
  it('formats integer price correctly', () => {
  const result = formatPrice(1999);
  // Wir ersetzen das NBSP (\u00A0) durch ein normales Leerzeichen
  const normalizedResult = result.replace(/\u00A0/g, ' '); 
  expect(normalizedResult).toBe('19,99 €');
})

  it('formats zero price correctly', () => {
    expect(formatPrice(0)).toEqual('0,00 €')      // ← toEqual statt toBe
  })
  
  it('formats large price correctly', () => {
    expect(formatPrice(123456)).toEqual('1.234,56 €')  // ← toEqual statt toBe
  })
})
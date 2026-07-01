// src/lib/utils/formatPrice.ts

// export function formatPrice(price: number): string {
//   const euroPrice = price / 100
//   return new Intl.NumberFormat('de-DE', {
//     style: 'currency',
//     currency: 'EUR',
//   }).format(euroPrice).replace(/\u202f/g, ' ')  // ← Ersetzt geschützte Leerzeichen
// }
// In src/lib/utils/formatPrice.ts
export const formatPrice = (price: number) => {
  const formatted = new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
  }).format(price / 100); // Falls price in Cent ist

  // Ersetze das unsichtbare Zeichen global durch ein normales Leerzeichen
  return formatted.replace(/\u00A0/g, ' ');
};
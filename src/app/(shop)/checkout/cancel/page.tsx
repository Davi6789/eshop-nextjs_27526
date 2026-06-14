//    src/app/(shop)/checkout/cancel/page.tsx
import Link from "next/link"

export default function CancelPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-md mx-auto px-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center">
          <div className="text-6xl mb-4">😅</div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Zahlung abgebrochen
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Du hast die PayPal-Zahlung abgebrochen. Deine Bestellung wurde nicht abgeschlossen.
          </p>
          <div className="space-y-3">
            <Link
              href="/cart"
              className="block w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Zum Warenkorb zurück
            </Link>
            <Link
              href="/products"
              className="block w-full text-gray-600 dark:text-gray-400 py-2 hover:text-gray-800"
            >
              Weiter einkaufen →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
// src/app/shipping/page.tsx

import { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Versandinformationen | E-Shop",
  description: "Alle Informationen zu Versandkosten, Lieferzeiten und Zahlungsmethoden",
}

export default function ShippingPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            📦 Versandinformationen
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Hier findest du alle wichtigen Informationen zu Versandkosten und Lieferzeiten
          </p>
        </div>

        <div className="space-y-6">
          {/* Versandkosten */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <span className="text-2xl">🚚</span> Versandkosten
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-400">Standardversand (Deutschland)</span>
                <span className="font-semibold text-gray-900 dark:text-white">4,99 €</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-400">Expressversand (Deutschland)</span>
                <span className="font-semibold text-gray-900 dark:text-white">9,99 €</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-400">Versand nach Österreich/Schweiz</span>
                <span className="font-semibold text-gray-900 dark:text-white">12,99 €</span>
              </div>
              <div className="flex justify-between items-center py-2 text-green-600 dark:text-green-400 font-semibold bg-green-50 dark:bg-green-900/20 px-3 rounded-lg mt-2">
                <span>Kostenloser Versand (Deutschland)</span>
                <span>ab 50 € Bestellwert</span>
              </div>
            </div>
          </div>

          {/* Lieferzeiten */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <span className="text-2xl">⏱️</span> Lieferzeiten
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-400">Standardversand (Deutschland)</span>
                <span className="font-semibold text-gray-900 dark:text-white">2-4 Werktage</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-400">Expressversand (Deutschland)</span>
                <span className="font-semibold text-gray-900 dark:text-white">1-2 Werktage</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-400">International (EU)</span>
                <span className="font-semibold text-gray-900 dark:text-white">5-10 Werktage</span>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-4 pt-2 border-t">
                * Die Lieferzeiten gelten ab Zahlungseingang. Bei PayPal und Kreditkarte erfolgt die Zahlung sofort, 
                bei Banküberweisung kann es 1-2 Werktage dauern.
              </p>
            </div>
          </div>

          {/* Versandpartner */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <span className="text-2xl">📦</span> Unsere Versandpartner
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {["DHL", "DPD", "Hermes", "UPS"].map((partner) => (
                <div key={partner} className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <p className="font-semibold text-gray-900 dark:text-white">{partner}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Zahlungsmethoden */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <span className="text-2xl">💳</span> Akzeptierte Zahlungsmethoden
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { name: "PayPal", icon: "💙" },
                { name: "Kreditkarte", icon: "💳" },
                { name: "Banküberweisung", icon: "🏦" },
                { name: "Apple Pay", icon: "📱" }
              ].map((method) => (
                <div key={method.name} className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <span className="text-xl">{method.icon}</span>
                  <span className="text-sm">{method.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Retouren */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <span className="text-2xl">🔄</span> Rückgabe & Umtausch
            </h2>
            <div className="space-y-3">
              <p className="text-gray-600 dark:text-gray-400">
                Du hast <strong className="text-green-600">30 Tage</strong> Zeit, um deine Ware zurückzuschicken. 
                Die Retoure ist für dich <strong>kostenlos</strong>.
              </p>
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                <p className="font-semibold text-green-800 dark:text-green-300 mb-2">📋 So einfach geht's:</p>
                <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600 dark:text-gray-400">
                  <li>Logge dich in dein Konto ein</li>
                  <li>Gehe zu "Meine Bestellungen"</li>
                  <li>Wähle die Bestellung aus und klicke auf "Retoure anmelden"</li>
                  <li>Drucke das kostenlose Retourenlabel aus</li>
                  <li>Verpacke die Ware und klebe das Label auf</li>
                  <li>Gib das Paket bei einem Paketshop ab</li>
                </ol>
              </div>
            </div>
          </div>

          {/* FAQ */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <span className="text-2xl">❓</span> Häufige Fragen
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Kann ich meine Bestellung verfolgen?</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                  Ja, nach dem Versand erhältst du eine E-Mail mit einem Tracking-Link.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Was passiert, wenn ich nicht zu Hause bin?</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                  Der Paketdienst hinterlässt eine Benachrichtigungskarte. Du kannst das Paket bei einem Nachbarn abgeben lassen 
                  oder in eine Paketfiliale umleiten.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Lieferung ins Ausland?</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                  Ja, wir liefern in alle EU-Länder. Die Versandkosten variieren je nach Land.
                </p>
              </div>
            </div>
          </div>

          {/* Kontakt */}
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 text-center">
            <p className="text-gray-700 dark:text-gray-300">
              Hast du weitere Fragen zum Versand?
              <Link href="/contact" className="ml-2 text-blue-600 hover:text-blue-700 font-semibold">
                Kontaktiere uns →
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
// src/app/returns/page.tsx

import { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Rückgaberecht | E-Shop",
  description: "30 Tage Rückgaberecht - So einfach geht die Rücksendung bei E-Shop",
}

export default function ReturnsPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            🔄 Rückgaberecht
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            30 Tage Rückgaberecht – Einfach und unkompliziert
          </p>
        </div>

        <div className="space-y-6">
          {/* 30 Tage Garantie */}
          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg shadow p-6 text-center border border-green-200 dark:border-green-800">
            <div className="text-5xl mb-3">🎉</div>
            <h2 className="text-2xl font-bold text-green-700 dark:text-green-300 mb-2">
              30 Tage Rückgaberecht
            </h2>
            <p className="text-green-600 dark:text-green-400">
              Du hast ab Erhalt der Ware 30 Tage Zeit, deine Bestellung zurückzusenden.
            </p>
          </div>

          {/* So funktioniert die Rückgabe */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <span className="text-2xl">📋</span> So funktioniert die Rückgabe
            </h2>
            <div className="space-y-4">
              {[
                { step: 1, title: "Rückgabe anmelden", desc: "Logge dich in dein Konto ein und gehe zu 'Meine Bestellungen'. Wähle die Bestellung aus und klicke auf 'Retoure anmelden'.", icon: "📝" },
                { step: 2, title: "Retourenlabel erhalten", desc: "Du erhältst von uns ein kostenloses Retourenlabel per E-Mail. Drucke es aus und klebe es auf das Paket.", icon: "🖨️" },
                { step: 3, title: "Paket verpacken", desc: "Verpacke die Ware sicher in der Originalverpackung (falls möglich) und klebe das Retourenlabel gut sichtbar auf.", icon: "📦" },
                { step: 4, title: "Paket abgeben", desc: "Gib das Paket bei einem Paketshop deiner Wahl ab (DHL, DPD, Hermes).", icon: "🏪" },
                { step: 5, title: "Erstattung erhalten", desc: "Sobald die Ware bei uns eingegangen und geprüft wurde, erhältst du dein Geld zurück (innerhalb von 14 Tagen).", icon: "💰" }
              ].map((item) => (
                <div key={item.step} className="flex gap-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-600 font-bold">
                    {item.step}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{item.icon}</span>
                      <h3 className="font-semibold text-gray-900 dark:text-white">{item.title}</h3>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Voraussetzungen */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <span className="text-2xl">✅</span> Voraussetzungen für die Rückgabe
            </h2>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <span className="text-green-500">✓</span>
                <span className="text-gray-600 dark:text-gray-400">Die Ware muss <strong>unbenutzt und originalverpackt</strong> sein.</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-green-500">✓</span>
                <span className="text-gray-600 dark:text-gray-400">Alle <strong>Etiketten und Zubehör</strong> müssen noch vorhanden sein.</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-green-500">✓</span>
                <span className="text-gray-600 dark:text-gray-400">Die Rückgabe muss <strong>innerhalb von 30 Tagen</strong> nach Erhalt angemeldet werden.</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-green-500">✓</span>
                <span className="text-gray-600 dark:text-gray-400">Die Ware wird auf <strong>Vollständigkeit und Beschädigungen</strong> geprüft.</span>
              </div>
            </div>
          </div>

          {/* Von der Rückgabe ausgeschlossen */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <span className="text-2xl">❌</span> Von der Rückgabe ausgeschlossen
            </h2>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <span className="text-red-500">✗</span>
                <span className="text-gray-600 dark:text-gray-400">Geöffnete oder gebrauchte <strong>Hygieneartikel</strong> (z.B. Kopfhörer, Ohrstöpsel)</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-red-500">✗</span>
                <span className="text-gray-600 dark:text-gray-400">Software, CDs, DVDs und Spiele mit <strong>geöffneter Versiegelung</strong></span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-red-500">✗</span>
                <span className="text-gray-600 dark:text-gray-400">Personalisiere oder <strong>kundenspezifische Produkte</strong></span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-red-500">✗</span>
                <span className="text-gray-600 dark:text-gray-400">Gutscheine und <strong>digitale Downloads</strong></span>
              </div>
            </div>
          </div>

          {/* Erstattung */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <span className="text-2xl">💰</span> Erstattung
            </h2>
            <div className="space-y-3">
              <p className="text-gray-600 dark:text-gray-400">
                Nach Eingang und Prüfung der Rücksendung erhältst du dein Geld innerhalb von <strong>14 Tagen</strong> zurück.
              </p>
              <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                <p className="font-semibold mb-2">Die Erstattung erfolgt über:</p>
                <ul className="space-y-1 text-gray-600 dark:text-gray-400">
                  <li>• <strong>PayPal</strong> – Rückerstattung auf dein PayPal-Konto</li>
                  <li>• <strong>Kreditkarte</strong> – Rückerstattung auf deine Kreditkarte</li>
                  <li>• <strong>Banküberweisung</strong> – Rückerstattung auf dein Bankkonto (bei Vorkasse)</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Retourenadresse */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <span className="text-2xl">📍</span> Retourenadresse
            </h2>
            <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg text-center">
              <p className="font-semibold">E-Shop Retouren</p>
              <p>Musterstraße 123</p>
              <p>10115 Berlin</p>
              <p>Deutschland</p>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-3 text-center">
              ⚠️ Bitte verwende für Rücksendungen das von uns bereitgestellte Retourenlabel.
            </p>
          </div>

          {/* Beschädigte Ware */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <span className="text-2xl">⚠️</span> Beschädigte oder falsche Ware
            </h2>
            <div className="space-y-3">
              <p className="text-gray-600 dark:text-gray-400">
                Sollte deine Lieferung beschädigt sein oder den falschen Artikel enthalten, 
                kontaktiere uns bitte sofort unter <strong>support@eshop.com</strong>.
              </p>
              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg">
                <p className="text-sm text-yellow-800 dark:text-yellow-300">
                  💡 Bitte mache Fotos von der beschädigten Ware und sende sie uns an support@eshop.com. 
                  So können wir den Schaden schnell bearbeiten.
                </p>
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
                <h3 className="font-semibold text-gray-900 dark:text-white">Wer trägt die Versandkosten für die Retoure?</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                  Die Retoure ist für dich <strong>kostenlos</strong>. Du erhältst von uns ein kostenloses Retourenlabel.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Wie lange dauert die Rückerstattung?</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                  Nach Eingang der Rücksendung bearbeiten wir deine Retoure innerhalb von 14 Tagen. 
                  Die Gutschrift erfolgt dann auf deine ursprüngliche Zahlungsmethode.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Kann ich die Ware im Laden zurückgeben?</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                  Aktuell haben wir leider keinen physischen Laden. Rücksendungen sind nur per Post möglich.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Kann ich die Ware umtauschen?</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                  Wir bieten keinen direkten Umtausch an. Du kannst die Ware zurücksenden und eine neue Bestellung aufgeben.
                </p>
              </div>
            </div>
          </div>

          {/* Kontakt */}
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 text-center">
            <p className="text-gray-700 dark:text-gray-300">
              Hast du weitere Fragen zum Rückgaberecht?
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
// src/app/about/page.tsx

import { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"

export const metadata: Metadata = {
  title: "Über uns | E-Shop",
  description: "Erfahre mehr über E-Shop - Deinen zuverlässigen Online-Shop für hochwertige Produkte",
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Über uns
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Dein zuverlässiger Partner für hochwertige Produkte und exzellenten Service
          </p>
        </div>

        {/* Unsere Geschichte */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden mb-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Unsere Geschichte
              </h2>
              <div className="space-y-4 text-gray-600 dark:text-gray-400">
                <p>
                  E-Shop wurde 2024 mit einer klaren Vision gegründet: 
                  Menschen hochwertige Produkte zu fairen Preisen anzubieten, 
                  ohne Kompromisse bei Qualität und Service zu machen.
                </p>
                <p>
                  Was als kleiner Online-Shop begann, hat sich schnell zu einer 
                  vertrauenswürdigen Marke entwickelt. Heute sind wir stolz darauf, 
                  Tausende von zufriedenen Kunden in ganz Deutschland und Europa zu bedienen.
                </p>
                <p>
                  Unser Erfolg basiert auf drei Säulen: erstklassige Produkte, 
                  exzellenter Kundenservice und innovative Technologie.
                </p>
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-8 flex items-center justify-center">
              <div className="text-center text-white">
                <div className="text-6xl mb-4">🛍️</div>
                <p className="text-2xl font-bold">Seit 2024</p>
                <p className="mt-2">Dein vertrauenswürdiger Partner</p>
              </div>
            </div>
          </div>
        </div>

        {/* Unsere Werte */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-8">
            Unsere Werte
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 text-center">
              <div className="text-4xl mb-4">⭐</div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                Qualität
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Wir wählen nur die besten Produkte aus und überprüfen sie sorgfältig.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 text-center">
              <div className="text-4xl mb-4">🤝</div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                Vertrauen
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Transparente Prozesse und ehrlicher Kundenservice stehen bei uns an erster Stelle.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 text-center">
              <div className="text-4xl mb-4">🚀</div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                Innovation
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Wir nutzen moderne Technologien für ein optimales Einkaufserlebnis.
              </p>
            </div>
          </div>
        </div>

        {/* Warum E-Shop? */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-8">
            Warum E-Shop?
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-start gap-3">
              <div className="text-green-500 text-xl">✓</div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Schneller Versand</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">2-4 Werktage Lieferzeit mit Sendungsverfolgung</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="text-green-500 text-xl">✓</div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Kostenloser Versand</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Ab 50€ Bestellwert versenden wir kostenlos</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="text-green-500 text-xl">✓</div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">30 Tage Rückgaberecht</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Geld-zurück-Garantie für alle Produkte</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="text-green-500 text-xl">✓</div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Sichere Zahlung</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">SSL-verschlüsselte Zahlungen mit PayPal</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="text-green-500 text-xl">✓</div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">24/7 Kundenservice</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Wir sind immer für dich da</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="text-green-500 text-xl">✓</div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Qualitätsgarantie</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Höchste Qualitätsstandards für alle Produkte</p>
              </div>
            </div>
          </div>
        </div>

        {/* Team Section (optional) */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-8">
            Unser Team
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 text-center">
              <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-4xl">
                👨‍💼
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Antonio Mustermann</h3>
              <p className="text-gray-500 text-sm mb-2">Gründer & Geschäftsführer</p>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Leidenschaft für E-Commerce und Kundenzufriedenheit.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 text-center">
              <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-white text-4xl">
                👩‍💻
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Anna Müller</h3>
              <p className="text-gray-500 text-sm mb-2">Kundenservice</p>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Immer für dich da - bei Fragen und Problemen.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 text-center">
              <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center text-white text-4xl">
                📦
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Logistik-Team</h3>
              <p className="text-gray-500 text-sm mb-2">Schneller & sicherer Versand</p>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Deine Bestellung schnell und sicher zu dir nach Hause.
              </p>
            </div>
          </div>
        </div>

        {/* Zahlen & Fakten */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-8 text-white mb-8">
          <h2 className="text-2xl font-bold text-center mb-8">E-Shop in Zahlen</h2>
          <div className="grid md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-4xl font-bold">10k+</div>
              <p className="mt-2 text-blue-100">Zufriedene Kunden</p>
            </div>
            <div>
              <div className="text-4xl font-bold">50k+</div>
              <p className="mt-2 text-blue-100">Verkaufte Produkte</p>
            </div>
            <div>
              <div className="text-4xl font-bold">100%</div>
              <p className="mt-2 text-blue-100">Kundenzufriedenheit</p>
            </div>
            <div>
              <div className="text-4xl font-bold">24/7</div>
              <p className="mt-2 text-blue-100">Kundenservice</p>
            </div>
          </div>
        </div>

        {/* Kontakt CTA */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Hast du Fragen?
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Wir sind gerne für dich da. Kontaktiere uns bei Fragen oder Anregungen.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/contact"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition"
            >
              Kontakt aufnehmen
            </Link>
            <Link
              href="/products"
              className="bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 px-6 py-3 rounded-lg transition"
            >
              Produkte entdecken
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
// src/app/contact/contact-content.tsx

"use client"

import { useState } from "react"

export default function ContactContent() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error" | null
    message: string
  }>({ type: null, message: "" })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus({ type: null, message: "" })

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      })

      const data = await res.json()

      if (res.ok) {
        setSubmitStatus({
          type: "success",
          message: "Vielen Dank! Wir werden uns schnellstmöglich bei dir melden."
        })
        setFormData({ name: "", email: "", subject: "", message: "" })
      } else {
        setSubmitStatus({
          type: "error",
          message: data.error || "Ein Fehler ist aufgetreten. Bitte versuche es später erneut."
        })
      }
    } catch (error) {
      setSubmitStatus({
        type: "error",
        message: "Ein Fehler ist aufgetreten. Bitte versuche es später erneut."
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Kontakt
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Wir sind gerne für dich da. Stelle deine Frage oder gib uns Feedback.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Linke Spalte - Kontaktinformationen */}
          <div className="lg:col-span-1 space-y-6">
            {/* Adresse */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-600 text-xl">
                  📍
                </div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Unsere Adresse
                </h2>
              </div>
              <div className="text-gray-600 dark:text-gray-400 space-y-1">
                <p>E-Shop GmbH</p>
                <p>Musterstraße 123</p>
                <p>10115 Berlin</p>
                <p>Deutschland</p>
              </div>
            </div>

            {/* Kontakt */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center text-green-600 text-xl">
                  📞
                </div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Kontakt
                </h2>
              </div>
              <div className="text-gray-600 dark:text-gray-400 space-y-2">
                <p>
                  <strong>Telefon:</strong><br />
                  <a href="tel:+493012345678" className="hover:text-blue-600">
                    +49 30 12345678
                  </a>
                </p>
                <p>
                  <strong>Email:</strong><br />
                  <a href="mailto:info@eshop.com" className="hover:text-blue-600">
                    info@eshop.com
                  </a>
                </p>
                <p>
                  <strong>Support:</strong><br />
                  <a href="mailto:support@eshop.com" className="hover:text-blue-600">
                    support@eshop.com
                  </a>
                </p>
              </div>
            </div>

            {/* Öffnungszeiten */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center text-purple-600 text-xl">
                  🕒
                </div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Öffnungszeiten
                </h2>
              </div>
              <div className="space-y-2 text-gray-600 dark:text-gray-400">
                <div className="flex justify-between">
                  <span>Montag - Freitag:</span>
                  <span>09:00 - 18:00 Uhr</span>
                </div>
                <div className="flex justify-between">
                  <span>Samstag:</span>
                  <span>10:00 - 14:00 Uhr</span>
                </div>
                <div className="flex justify-between">
                  <span>Sonntag:</span>
                  <span>Geschlossen</span>
                </div>
              </div>
            </div>

            {/* Social Media */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-pink-100 dark:bg-pink-900/30 rounded-full flex items-center justify-center text-pink-600 text-xl">
                  💬
                </div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Social Media
                </h2>
              </div>
              <div className="flex justify-around">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-blue-600 transition text-2xl">📘</a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-pink-600 transition text-2xl">📷</a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-blue-400 transition text-2xl">🐦</a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-blue-700 transition text-2xl">🔗</a>
              </div>
            </div>
          </div>

          {/* Rechte Spalte - Kontaktformular */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 md:p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Schreib uns eine Nachricht
              </h2>

              {submitStatus.type === "success" && (
                <div className="mb-6 bg-green-50 dark:bg-green-900/20 border border-green-200 rounded-lg p-4">
                  <p className="text-green-600 dark:text-green-400">{submitStatus.message}</p>
                </div>
              )}

              {submitStatus.type === "error" && (
                <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 rounded-lg p-4">
                  <p className="text-red-600 dark:text-red-400">{submitStatus.message}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Dein Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      placeholder="Max Mustermann"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Deine Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      placeholder="name@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Betreff *
                  </label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="">Bitte wählen</option>
                    <option value="Frage zum Produkt">Frage zum Produkt</option>
                    <option value="Bestellstatus">Bestellstatus</option>
                    <option value="Rückgabe / Umtausch">Rückgabe / Umtausch</option>
                    <option value="Rechnung / Zahlung">Rechnung / Zahlung</option>
                    <option value="Feedback">Feedback / Vorschlag</option>
                    <option value="Sonstiges">Sonstiges</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Deine Nachricht *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white resize-none"
                    placeholder="Schreib uns deine Nachricht..."
                  />
                </div>

                <div className="text-sm text-gray-500 dark:text-gray-400">
                  <p>* Pflichtfelder</p>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
                >
                  {isSubmitting ? "Wird gesendet..." : "Nachricht senden"}
                </button>
              </form>
            </div>

            {/* FAQ Hinweis */}
            <div className="mt-6 bg-gray-100 dark:bg-gray-800/50 rounded-lg p-4 text-center">
              <p className="text-gray-600 dark:text-gray-400">
                📖 Schnelle Antworten findest du in unseren{" "}
                <a href="/faq" className="text-blue-600 hover:underline">
                  FAQ
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Karte */}
        <div className="mt-12 bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Anfahrt
            </h2>
            <div className="aspect-video bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
              <p className="text-gray-500 dark:text-gray-400">📍 Google Maps wird hier eingebettet</p>
            </div>
            <p className="mt-4 text-sm text-gray-500 dark:text-gray-400 text-center">
              U-Bahn: U2 (Rosa-Luxemburg-Platz) | Bus: 142, 240 (Mollstraße)
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
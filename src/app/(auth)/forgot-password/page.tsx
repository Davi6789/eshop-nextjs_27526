//  src/app/(auth)/forgot-password/page.tsx

"use client"

import { useState } from "react"
import Link from "next/link"
import { supabase } from "@/lib/supabase/client"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage(null)

    try {
      // Hier generieren wir einen Reset-Token und speichern ihn in der DB
      const resetToken = Math.random().toString(36).substring(2, 15)
      const expiresAt = new Date()
      expiresAt.setHours(expiresAt.getHours() + 1) // Token 1 Stunde gültig

      // Speichere Token in der Datenbank
      const { error: updateError } = await supabase
        .from("users")
        .update({
          reset_token: resetToken,
          reset_token_expires: expiresAt.toISOString(),
        })
        .eq("email", email)

      if (updateError) {
        // Aus Sicherheitsgründen sagen wir nicht, ob die Email existiert
        setMessage({
          type: "success",
          text: "Wenn diese Email existiert, erhältst du in Kürze einen Link zum Zurücksetzen deines Passworts.",
        })
        return
      }

      // Hier müsste eigentlich eine Email gesendet werden
      // Für die Demo zeigen wir den Link an
      const resetLink = `${window.location.origin}/reset-password?token=${resetToken}&email=${email}`
      
      setMessage({
        type: "success",
        text: `Link zum Zurücksetzen: ${resetLink}`,
      })
    } catch (error) {
      setMessage({
        type: "error",
        text: "Ein Fehler ist aufgetreten. Bitte versuche es später erneut.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white">
            Passwort vergessen?
          </h2>
          <p className="mt-2 text-center text-gray-600 dark:text-gray-400">
            Keine Sorge! Gib deine Email ein und wir schicken dir einen Link zum Zurücksetzen.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {message && (
            <div
              className={`rounded-lg p-4 ${
                message.type === "success"
                  ? "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800"
                  : "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
              }`}
            >
              <p
                className={`text-sm ${
                  message.type === "success"
                    ? "text-green-600 dark:text-green-400"
                    : "text-red-600 dark:text-red-400"
                }`}
              >
                {message.text}
              </p>
            </div>
          )}

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Email Adresse
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
              placeholder="name@example.com"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Wird gesendet..." : "Passwort zurücksetzen"}
          </button>

          <div className="text-center">
            <Link
              href="/login"
              className="text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400"
            >
              ← Zurück zum Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
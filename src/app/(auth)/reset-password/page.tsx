// src/app/(auth)/reset-password/page.tsx

"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { supabase } from "@/lib/supabase/client"
import { hash } from "bcryptjs"

export default function ResetPasswordPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get("token")
  const email = searchParams.get("email")

  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [isValidToken, setIsValidToken] = useState(false)

  useEffect(() => {
    // Token validieren
    const validateToken = async () => {
      if (!token || !email) {
        setMessage({
          type: "error",
          text: "Ungültiger oder abgelaufener Link.",
        })
        return
      }

      const { data: user, error } = await supabase
        .from("users")
        .select("reset_token, reset_token_expires")
        .eq("email", email)
        .single()

      if (error || !user) {
        setMessage({
          type: "error",
          text: "Ungültiger oder abgelaufener Link.",
        })
        return
      }

      const tokenExpires = new Date(user.reset_token_expires)
      const now = new Date()

      if (user.reset_token !== token || now > tokenExpires) {
        setMessage({
          type: "error",
          text: "Der Link ist abgelaufen. Bitte fordere einen neuen an.",
        })
        return
      }

      setIsValidToken(true)
    }

    validateToken()
  }, [token, email])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage(null)

    if (password !== confirmPassword) {
      setMessage({
        type: "error",
        text: "Die Passwörter stimmen nicht überein.",
      })
      setIsLoading(false)
      return
    }

    if (password.length < 6) {
      setMessage({
        type: "error",
        text: "Das Passwort muss mindestens 6 Zeichen lang sein.",
      })
      setIsLoading(false)
      return
    }

    try {
      const hashedPassword = await hash(password, 10)

      const { error: updateError } = await supabase
        .from("users")
        .update({
          password_hash: hashedPassword,
          reset_token: null,
          reset_token_expires: null,
        })
        .eq("email", email)

      if (updateError) {
        setMessage({
          type: "error",
          text: "Ein Fehler ist aufgetreten. Bitte versuche es später erneut.",
        })
        return
      }

      setMessage({
        type: "success",
        text: "Passwort erfolgreich zurückgesetzt! Du wirst in 3 Sekunden weitergeleitet.",
      })

      setTimeout(() => {
        router.push("/login")
      }, 3000)
    } catch (error) {
      setMessage({
        type: "error",
        text: "Ein Fehler ist aufgetreten. Bitte versuche es später erneut.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (!isValidToken && message?.type === "error") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4">
        <div className="w-full max-w-md">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 rounded-lg p-4">
            <p className="text-red-600 dark:text-red-400 text-center">{message.text}</p>
            <div className="text-center mt-4">
              <Link
                href="/forgot-password"
                className="text-blue-600 hover:text-blue-500"
              >
                Neuen Link anfordern →
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white">
            Neues Passwort
          </h2>
          <p className="mt-2 text-center text-gray-600 dark:text-gray-400">
            Bitte gib dein neues Passwort ein
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {message && (
            <div
              className={`rounded-lg p-4 ${
                message.type === "success"
                  ? "bg-green-50 dark:bg-green-900/20 border border-green-200"
                  : "bg-red-50 dark:bg-red-900/20 border border-red-200"
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
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Neues Passwort
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
              placeholder="••••••••"
            />
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Passwort bestätigen
            </label>
            <input
              id="confirmPassword"
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Wird gespeichert..." : "Passwort zurücksetzen"}
          </button>
        </form>
      </div>
    </div>
  )
}
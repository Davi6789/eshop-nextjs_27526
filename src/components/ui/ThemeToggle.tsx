// src/components/ui/ThemeToggle.tsx

"use client"

import { useTheme } from "next-themes"
import { useState, useEffect } from "react"

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <button className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 w-9 h-9 animate-pulse" />
  }

  return (
    <button
      //onClick={toggleTheme}
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="relative p-2 rounded-lg transition-all duration-300 hover:bg-gray-100 dark:hover:bg-gray-700"
      aria-label="Dark Mode umschalten"
    >
      <span className="text-xl transition-transform duration-500">
        {theme === "dark" ? "🌙" : "☀️"}
      </span>
    </button>
  )
}
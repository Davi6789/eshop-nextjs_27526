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
    return (
      <button className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 w-9 h-9 animate-pulse" />
    )
  }

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  return (
    <button
      onClick={toggleTheme}
      className="relative p-2 rounded-lg transition-all duration-300 hover:bg-gray-100 dark:hover:bg-gray-700"
      aria-label="Dark Mode umschalten"
    >
      {theme === "dark" ? (
        <span className="text-xl transition-transform duration-500 rotate-0">
          🌙
        </span>
      ) : (
        <span className="text-xl transition-transform duration-500 rotate-0">
          ☀️
        </span>
      )}
      
      {/* Tooltip */}
      <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition">
        {theme === "dark" ? "Light Mode" : "Dark Mode"}
      </span>
    </button>
  )
}
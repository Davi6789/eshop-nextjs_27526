// src/components/providers/ThemeProvider.tsx

"use client"

import { createContext, useContext, useEffect, useState } from "react"

type Theme = "light" | "dark"

interface ThemeContextType {
  theme: Theme
  toggleTheme: () => void
}>({
  theme: "light",
  setTheme: () => {}
})

export function useTheme() {
  return useContext(ThemeContext)
}

// const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light")
  // const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // setMounted(true)
    // const savedTheme = localStorage.getItem("theme") as Theme | null
    // if (savedTheme) {
    //   setTheme(savedTheme)
    //   document.documentElement.classList.toggle("dark", savedTheme === "dark")
    const saved = localStorage.getItem("theme") as Theme
    if (saved) {
      setTheme(saved)
      document.documentElement.classList.toggle("dark", saved === "dark")
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setTheme("dark")
      document.documentElement.classList.add("dark")
    }
  }, [])

  const handleSetTheme = (newTheme: Theme) => {
    setTheme(newTheme)
    localStorage.setItem("theme", newTheme)
    document.documentElement.classList.toggle("dark", newTheme === "dark")
  }


  // const toggleTheme = () => {
  //   const newTheme = theme === "light" ? "dark" : "light"
  //   setTheme(newTheme)
  //   localStorage.setItem("theme", newTheme)
  //   document.documentElement.classList.toggle("dark", newTheme === "dark")
  // }

  // // Vermeidet Hydration-Fehler
  // if (!mounted) {
  //   return <>{children}</>
  // }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

// ✅ WICHTIG: useTheme Hook exportieren!
export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}
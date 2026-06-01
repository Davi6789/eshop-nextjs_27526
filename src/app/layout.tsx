import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import NextAuthSessionProvider from "@/components/providers/SessionProvider"
import Navbar from "@/components/ui/Navbar"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "E-Shop | Moderner Online Shop",
  description: "Entdecke unsere Produkte - Qualität und Style vereint",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="de" suppressHydrationWarning>
      <body className={inter.className}>
        <NextAuthSessionProvider>
          <Navbar />
          <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {children}
          </main>
        </NextAuthSessionProvider>
      </body>
    </html>
  )
}
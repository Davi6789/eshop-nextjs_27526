//  src/app/(shop)/layout.tsx

import Navbar from "@/components/ui/Navbar"
import MobileBottomNav from "@/components/ui/MobileBottomNav"

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <main className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-16 md:pb-0">
        {children}
      </main>
      <MobileBottomNav />
    </>
  )
}
//  src/app/(shop)/layout.tsx

import MobileBottomNav from "@/components/ui/MobileBottomNav"

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (

    <>
      <div className="pb-16 md:pb-0">{children}</div>
      <MobileBottomNav />
    </>
  )
}
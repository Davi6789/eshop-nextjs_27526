//  src/components/ui/MobileBottomNav.tsx

"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useCart } from "@/context/CartContext"
import { useWishlist } from "@/context/WishlistContext"

export default function MobileBottomNav() {
  const pathname = usePathname()
  const { getTotalItems } = useCart()
  const { getWishlistCount } = useWishlist()

  const isActive = (path: string) => {
    return pathname === path || pathname.startsWith(path + "/")
  }

  const navItems = [
    { href: "/", label: "Start", icon: "🏠", activeIcon: "🏠" },
    { href: "/products", label: "Shop", icon: "🛍️", activeIcon: "🛍️" },
    { href: "/dashboard/wishlist", label: "Wunschliste", icon: "🤍", activeIcon: "❤️", badge: getWishlistCount() },
    { href: "/cart", label: "Warenkorb", icon: "🛒", activeIcon: "🛒", badge: getTotalItems() },
    { href: "/dashboard", label: "Profil", icon: "👤", activeIcon: "👤" },
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden">
      <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-md border-t border-gray-200 dark:border-gray-700">
        <div className="flex justify-around items-center py-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`relative flex flex-col items-center gap-1 px-3 py-1 rounded-lg transition ${
                isActive(item.href)
                  ? "text-blue-600 dark:text-blue-400"
                  : "text-gray-500 dark:text-gray-400"
              }`}
            >
              <span className="text-2xl">
                {isActive(item.href) ? item.activeIcon : item.icon}
              </span>
              <span className="text-xs">{item.label}</span>
              
              {item.badge && item.badge > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
                  {item.badge > 99 ? "99+" : item.badge}
                </span>
              )}
            </Link>
          ))}
        </div>
      </div>
      
      {/* Safe Area für Notch/Homescreen Indicator */}
      <div className="h-safe-bottom bg-white/95 dark:bg-gray-800/95" />
    </div>
  )
}
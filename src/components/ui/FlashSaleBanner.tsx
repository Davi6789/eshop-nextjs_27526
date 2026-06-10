 //   src/components/ui/FlashSaleBanner.tsx  

 "use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import CountdownTimer from "./CountdownTimer"

interface FlashSaleProps {
  endDate: string
  discountPercent: number
}

export default function FlashSaleBanner({ endDate, discountPercent }: FlashSaleProps) {
  const [isVisible, setIsVisible] = useState(true)

  if (!isVisible) return null

  return (
    <div className="relative bg-gradient-to-r from-red-600 to-orange-500 text-white overflow-hidden">
      {/* Animierte Hintergrund-Streifen */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-repeat-x animate-[slide_20s_linear_infinite]" 
             style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg...')" }} />
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="text-2xl animate-pulse">🔥</span>
            <span className="font-bold">FLASH SALE!</span>
            <span className="hidden sm:inline">-{discountPercent}% auf ausgewählte Produkte</span>
          </div>
          
          <div className="flex items-center gap-4">
            <CountdownTimer targetDate={endDate} size="md" />
            <Link 
              href="/products?filter=discount"
              className="bg-white text-red-600 px-4 py-1 rounded-full text-sm font-semibold hover:bg-gray-100 transition"
            >
              Jetzt shoppen →
            </Link>
          </div>
          
          <button 
            onClick={() => setIsVisible(false)}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-white/70 hover:text-white sm:static sm:translate-y-0"
          >
            ✕
          </button>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes slide {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  )
}
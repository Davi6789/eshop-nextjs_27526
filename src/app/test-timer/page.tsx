// src/app/test-timer/page.tsx  Countdown Timer Test

"use client"

import { useState } from "react"
import CountdownTimer from "@/components/ui/CountdownTimer"
import FlashSaleBanner from "@/components/ui/FlashSaleBanner"

export default function TestTimerPage() {
  const futureDate = new Date()
  futureDate.setHours(futureDate.getHours() + 2) // 2 Stunden in der Zukunft
  
  const [showBanner, setShowBanner] = useState(true)

  return (
    <div className="max-w-2xl mx-auto p-8 space-y-8">
      <h1 className="text-2xl font-bold">Countdown Timer Test</h1>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 space-y-4">
        <h2 className="text-lg font-semibold">Timer Größen:</h2>
        <div className="space-y-2">
          <div>Small: <CountdownTimer targetDate={futureDate} size="sm" /></div>
          <div>Medium: <CountdownTimer targetDate={futureDate} size="md" /></div>
          <div>Large: <CountdownTimer targetDate={futureDate} size="lg" /></div>
          <div>Mit Tagen: <CountdownTimer targetDate={futureDate} showDays /></div>
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Flash Sale Banner:</h2>
        {showBanner && (
          <FlashSaleBanner 
            endDate={futureDate.toISOString()} 
            discountPercent={30} 
          />
        )}
        <button 
          onClick={() => setShowBanner(false)}
          className="mt-4 px-4 py-2 bg-gray-500 text-white rounded"
        >
          Banner ausblenden
        </button>
      </div>
      
      <div className="bg-yellow-100 p-4 rounded">
        <p>⏰ Timer endet um: {futureDate.toLocaleTimeString()}</p>
        <p className="text-sm mt-2">Nach Ablauf verschwindet der Timer automatisch!</p>
      </div>
    </div>
  )
}
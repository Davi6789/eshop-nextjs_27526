//  src/components/ui/CountdownTimer.tsx 

"use client"

import { useState, useEffect } from "react"

interface CountdownTimerProps {
  targetDate: string | Date
  onExpire?: () => void
}

export default function CountdownTimer({ targetDate, onExpire }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  })
  const [isExpired, setIsExpired] = useState(false)

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime()
      const target = new Date(targetDate).getTime()
      const difference = target - now

      if (difference <= 0) {
        setIsExpired(true)
        onExpire?.()
        return
      }

      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((difference % (1000 * 60)) / 1000)
      })
    }

    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 1000)

    return () => clearInterval(timer)
  }, [targetDate, onExpire])

  if (isExpired) {
    return null
  }

  return (
    <div className="inline-flex items-center gap-2 bg-red-50 dark:bg-red-900/20 px-3 py-1 rounded-lg">
      <span className="text-xs font-semibold text-red-600 dark:text-red-400">
        ⏰ Angebot endet:
      </span>
      <div className="flex gap-1 text-sm font-mono font-bold text-red-600 dark:text-red-400">
        {timeLeft.hours > 0 && (
          <span>{String(timeLeft.hours).padStart(2, "0")}:</span>
        )}
        <span>{String(timeLeft.minutes).padStart(2, "0")}</span>
        <span>:</span>
        <span>{String(timeLeft.seconds).padStart(2, "0")}</span>
      </div>
    </div>
  )
}
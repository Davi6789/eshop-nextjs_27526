 //   src/components/admin/RevenueChart.tsx 

 "use client"

import { useEffect, useRef } from "react"

interface RevenueChartProps {
  data: { date: string; revenue: number }[]
}

export default function RevenueChart({ data }: RevenueChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current || data.length === 0) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height
    const padding = 40

    // Clear canvas
    ctx.clearRect(0, 0, width, height)

    // Find max revenue
    const maxRevenue = Math.max(...data.map(d => d.revenue), 1)
    
    // Draw axes
    ctx.beginPath()
    ctx.strokeStyle = "#9ca3af"
    ctx.lineWidth = 1
    ctx.moveTo(padding, padding)
    ctx.lineTo(padding, height - padding)
    ctx.lineTo(width - padding, height - padding)
    ctx.stroke()

    // Draw line chart
    const stepX = (width - 2 * padding) / (data.length - 1)
    
    ctx.beginPath()
    ctx.strokeStyle = "#3b82f6"
    ctx.lineWidth = 2
    
    data.forEach((point, i) => {
      const x = padding + i * stepX
      const y = height - padding - (point.revenue / maxRevenue) * (height - 2 * padding)
      
      if (i === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    })
    ctx.stroke()

    // Draw points
    data.forEach((point, i) => {
      const x = padding + i * stepX
      const y = height - padding - (point.revenue / maxRevenue) * (height - 2 * padding)
      
      ctx.beginPath()
      ctx.fillStyle = "#3b82f6"
      ctx.arc(x, y, 4, 0, 2 * Math.PI)
      ctx.fill()
      
      // Labels
      ctx.fillStyle = "#6b7280"
      ctx.font = "10px Arial"
      ctx.fillText(point.date, x - 15, height - padding + 15)
    })

    // Y-axis labels
    ctx.fillStyle = "#6b7280"
    ctx.font = "10px Arial"
    for (let i = 0; i <= 4; i++) {
      const value = (maxRevenue / 4) * i
      const y = height - padding - (value / maxRevenue) * (height - 2 * padding)
      ctx.fillText(`${Math.round(value)}€`, 5, y)
    }
  }, [data])

  return (
    <canvas
      ref={canvasRef}
      width={800}
      height={400}
      className="w-full h-auto bg-white dark:bg-gray-800 rounded-lg"
    />
  )
}
 //  src/components/admin/Charts.tsx 

 "use client"

import { useEffect, useRef } from "react"

interface BarChartProps {
  data: { label: string; value: number; color?: string }[]
  title: string
  type?: "bar" | "line"
}

export function SimpleBarChart({ data, title, type = "bar" }: BarChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current || data.length === 0) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height
    const padding = 40
    const maxValue = Math.max(...data.map(d => d.value), 1)

    // Clear
    ctx.clearRect(0, 0, width, height)

    // Draw bars
    const barWidth = (width - 2 * padding) / data.length * 0.7
    const barSpacing = (width - 2 * padding) / data.length * 0.3

    data.forEach((item, i) => {
      const x = padding + i * (barWidth + barSpacing)
      const barHeight = (item.value / maxValue) * (height - 2 * padding)
      const y = height - padding - barHeight

      // Bar
      ctx.fillStyle = item.color || "#3b82f6"
      ctx.fillRect(x, y, barWidth, barHeight)

      // Label
      ctx.fillStyle = "#6b7280"
      ctx.font = "10px Arial"
      ctx.fillText(item.label, x, height - padding + 15)

      // Value on top
      ctx.fillStyle = "#1f2937"
      ctx.fillText(`${Math.round(item.value)}€`, x, y - 5)
    })

    // Y-axis
    ctx.beginPath()
    ctx.strokeStyle = "#9ca3af"
    ctx.moveTo(padding, padding)
    ctx.lineTo(padding, height - padding)
    ctx.stroke()

  }, [data])

  return (
    <div>
      <h3 className="text-md font-semibold mb-4">{title}</h3>
      <canvas
        ref={canvasRef}
        width={600}
        height={300}
        className="w-full h-auto"
      />
    </div>
  )
}

export function PieChart({ data, title }: { data: { label: string; value: number }[]; title: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current || data.length === 0) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height
    const centerX = width / 2
    const centerY = height / 2
    const radius = Math.min(width, height) / 2 - 20

    const total = data.reduce((sum, d) => sum + d.value, 0)
    let startAngle = -Math.PI / 2

    const colors = ["#3b82f6", "#ef4444", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899"]

    ctx.clearRect(0, 0, width, height)

    data.forEach((item, i) => {
      const angle = (item.value / total) * 2 * Math.PI
      const endAngle = startAngle + angle

      ctx.beginPath()
      ctx.fillStyle = colors[i % colors.length]
      ctx.moveTo(centerX, centerY)
      ctx.arc(centerX, centerY, radius, startAngle, endAngle)
      ctx.fill()

      startAngle = endAngle
    })

    // Legend
    let legendY = 20
    data.forEach((item, i) => {
      ctx.fillStyle = colors[i % colors.length]
      ctx.fillRect(width - 100, legendY, 12, 12)
      ctx.fillStyle = "#374151"
      ctx.font = "10px Arial"
      ctx.fillText(`${item.label} (${Math.round((item.value / total) * 100)}%)`, width - 84, legendY + 10)
      legendY += 20
    })

  }, [data])

  return (
    <div>
      <h3 className="text-md font-semibold mb-4">{title}</h3>
      <canvas
        ref={canvasRef}
        width={400}
        height={300}
        className="w-full h-auto"
      />
    </div>
  )
}

export function LineChart({ data, title }: { data: { label: string; revenue: number; orders: number }[]; title: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current || data.length === 0) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height
    const padding = 50

    const maxRevenue = Math.max(...data.map(d => d.revenue), 1)

    // Clear
    ctx.clearRect(0, 0, width, height)

    // Draw axes
    ctx.beginPath()
    ctx.strokeStyle = "#9ca3af"
    ctx.moveTo(padding, padding)
    ctx.lineTo(padding, height - padding)
    ctx.lineTo(width - padding, height - padding)
    ctx.stroke()

    // Draw line
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
      
      ctx.fillStyle = "#6b7280"
      ctx.font = "10px Arial"
      ctx.fillText(point.label, x - 20, height - padding + 20)
    })

  }, [data])

  return (
    <div>
      <h3 className="text-md font-semibold mb-4">{title}</h3>
      <canvas
        ref={canvasRef}
        width={800}
        height={300}
        className="w-full h-auto"
      />
    </div>
  )
}
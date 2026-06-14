// src/components/ui/PayPalButton.tsx  

 "use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

interface PayPalButtonProps {
  amount: number
  orderId: string
  orderNumber: string
  onSuccess: () => void
  onError: (error: string) => void
}

declare global {
  interface Window {
    paypal: any
  }
}

export default function PayPalButton({ 
  amount, 
  orderId, 
  orderNumber, 
  onSuccess, 
  onError 
}: PayPalButtonProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // PayPal SDK laden
    const script = document.createElement("script")
    script.src = `https://www.paypal.com/sdk/js?client-id=${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}&currency=EUR&intent=capture`
    script.async = true
    script.onload = () => setIsLoaded(true)
    document.body.appendChild(script)

    return () => {
      document.body.removeChild(script)
    }
  }, [])

  useEffect(() => {
    if (isLoaded && window.paypal) {
      window.paypal
        .Buttons({
          createOrder: async () => {
            try {
              const response = await fetch("/api/paypal/create-order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ amount, orderId, orderNumber }),
              })

              const orderData = await response.json()
              if (orderData.id) {
                return orderData.id
              } else {
                const errorDetail = orderData?.details?.[0]
                const errorMessage = errorDetail
                  ? `${errorDetail.issue} ${errorDetail.description}`
                  : JSON.stringify(orderData)
                throw new Error(errorMessage)
              }
            } catch (error) {
              console.error("Create Order Error:", error)
              onError("Fehler beim Erstellen der PayPal-Zahlung")
              return ""
            }
          },
          onApprove: async (data: any, actions: any) => {
            try {
              const response = await fetch("/api/paypal/capture-order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ orderId, paypalOrderId: data.orderID }),
              })

              const captureData = await response.json()
              if (captureData.success) {
                onSuccess()
                router.push(`/success/${orderId}?orderNumber=${orderNumber}&payment=paypal`)
              } else {
                onError(captureData.error || "Zahlung fehlgeschlagen")
              }
            } catch (error) {
              console.error("Capture Error:", error)
              onError("Fehler bei der Zahlungsbestätigung")
            }
          },
          onError: (err: any) => {
            console.error("PayPal Error:", err)
            onError("Ein Fehler ist bei PayPal aufgetreten")
          },
        })
        .render("#paypal-button-container")
    }
  }, [isLoaded, amount, orderId, orderNumber, onSuccess, onError, router])

  return (
    <div className="w-full">
      <div id="paypal-button-container" className="min-h-[150px]" />
      {!isLoaded && (
        <div className="text-center py-4">
          <div className="animate-pulse text-gray-500">Lade PayPal...</div>
        </div>
      )}
    </div>
  )
}
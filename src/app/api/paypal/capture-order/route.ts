// src/app/api/paypal/create-order/route.ts

import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth/config"

export async function POST(request: NextRequest) {
  const session = await auth()
  
  if (!session) {
    return NextResponse.json({ error: "Nicht autorisiert" }, { status: 401 })
  }

  try {
    const { amount, orderId, orderNumber } = await request.json()

    // PayPal API Anfrage
    const authResponse = await fetch(
      `https://api-m.sandbox.paypal.com/v1/oauth2/token`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${Buffer.from(
            `${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`
          ).toString("base64")}`,
        },
        body: "grant_type=client_credentials",
      }
    )

    const authData = await authResponse.json()
    const accessToken = authData.access_token

    // PayPal Order erstellen
    const orderResponse = await fetch(
      `https://api-m.sandbox.paypal.com/v2/checkout/orders`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          intent: "CAPTURE",
          purchase_units: [
            {
              reference_id: orderId,
              custom_id: orderNumber,
              amount: {
                currency_code: "EUR",
                value: amount.toFixed(2),
                breakdown: {
                  item_total: {
                    currency_code: "EUR",
                    value: amount.toFixed(2),
                  },
                },
              },
            },
          ],
          application_context: {
            brand_name: "E-Shop",
            landing_page: "NO_PREFERENCE",
            user_action: "PAY_NOW",
            return_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success`,
            cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/cancel`,
          },
        }),
      }
    )

    const orderData = await orderResponse.json()

    return NextResponse.json({ id: orderData.id })
  } catch (error) {
    console.error("PayPal Create Order Error:", error)
    return NextResponse.json({ error: "Fehler beim Erstellen der PayPal-Order" }, { status: 500 })
  }
}
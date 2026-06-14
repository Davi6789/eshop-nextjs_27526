 // src/app/api/coupons/validate/route.ts 

 import { supabase } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { code, cartTotal } = await request.json()

    if (!code) {
      return NextResponse.json({ error: "Code ist erforderlich" }, { status: 400 })
    }

    // Coupon aus Datenbank holen
    const { data: coupon, error } = await supabase
      .from("coupons")
      .select("*")
      .eq("code", code.toUpperCase())
      .eq("is_active", true)
      .single()

    if (error || !coupon) {
      return NextResponse.json({ error: "Ungültiger Gutscheincode" }, { status: 404 })
    }

    // Prüfen ob Coupon noch gültig ist
    const now = new Date()
    const validFrom = new Date(coupon.valid_from)
    const validUntil = coupon.valid_until ? new Date(coupon.valid_until) : null

    if (now < validFrom) {
      return NextResponse.json({ error: "Gutschein ist noch nicht gültig" }, { status: 400 })
    }

    if (validUntil && now > validUntil) {
      return NextResponse.json({ error: "Gutschein ist abgelaufen" }, { status: 400 })
    }

    // Prüfen ob Usage Limit erreicht
    if (coupon.usage_limit && coupon.used_count >= coupon.usage_limit) {
      return NextResponse.json({ error: "Gutschein wurde bereits zu oft verwendet" }, { status: 400 })
    }

    // Prüfen Mindestbestellwert
    if (cartTotal < coupon.min_order_amount) {
      const difference = coupon.min_order_amount - cartTotal
      return NextResponse.json({ 
        error: `Mindestbestellwert von ${coupon.min_order_amount}€ nicht erreicht. Noch ${difference.toFixed(2)}€ fehlen.` 
      }, { status: 400 })
    }

    // Rabatt berechnen
    let discountAmount = 0
    if (coupon.discount_type === 'percentage') {
      discountAmount = (cartTotal * coupon.discount_value) / 100
      // Maximalrabatt begrenzen
      if (coupon.max_discount && discountAmount > coupon.max_discount) {
        discountAmount = coupon.max_discount
      }
    } else {
      // Fixed discount
      discountAmount = coupon.discount_value
      // Nicht unter 0
      if (discountAmount > cartTotal) {
        discountAmount = cartTotal
      }
    }

    return NextResponse.json({
      valid: true,
      coupon: {
        code: coupon.code,
        discount_type: coupon.discount_type,
        discount_value: coupon.discount_value,
        discount_amount: discountAmount,
        min_order_amount: coupon.min_order_amount,
        max_discount: coupon.max_discount
      }
    })
  } catch (error) {
    console.error("Coupon validation error:", error)
    return NextResponse.json({ error: "Interner Serverfehler" }, { status: 500 })
  }
}
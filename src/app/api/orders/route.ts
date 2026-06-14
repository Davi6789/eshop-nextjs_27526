//  src/app/api/orders/route.ts 

import { supabase } from "@/lib/supabase/server"
import { auth } from "@/lib/auth/config"
import { NextRequest, NextResponse } from "next/server"

// Bestellung erstellen
export async function POST(request: NextRequest) {
  const session = await auth()
  
  if (!session) {
    return NextResponse.json({ error: "Nicht autorisiert" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { 
      orderData, 
      items, 
      totalAmount, 
      discountAmount,
      appliedCoupon,
      paymentMethod 
    } = body

    // Bestellnummer generieren (z.B. INV-20241212-00123)
    const orderNumber = `INV-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}${String(new Date().getDate()).padStart(2, '0')}-${Math.floor(Math.random() * 10000)}`

    // Vollständige Adresse zusammensetzen
    const fullAddress = `${orderData.street} ${orderData.houseNumber}, ${orderData.zipCode} ${orderData.city}, ${orderData.country}`

    // Bestellung in Datenbank speichern
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        user_id: session.user.id,
        order_number: orderNumber,
        total_amount: totalAmount,
        status: "pending",
        payment_method: paymentMethod,
        payment_status: "pending",
        shipping_address: fullAddress,
        shipping_city: orderData.city,
        shipping_zip: orderData.zipCode,
        shipping_country: orderData.country,
      })
      .select()
      .single()

    if (orderError) {
      console.error("Order Error:", orderError)
      return NextResponse.json({ error: "Fehler beim Erstellen der Bestellung" }, { status: 500 })
    }

    // Order Items speichern
    const orderItems = items.map((item: any) => ({
      order_id: order.id,
      product_id: item.id,
      product_name: item.title,
      quantity: item.quantity,
      price: item.price,
    }))

    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(orderItems)

    if (itemsError) {
      console.error("Order Items Error:", itemsError)
      return NextResponse.json({ error: "Fehler beim Speichern der Artikel" }, { status: 500 })
    }

    // Wenn Coupon verwendet wurde, used_count erhöhen
    if (appliedCoupon) {
      await supabase
        .from("coupons")
        .update({ used_count: supabase.rpc('increment', { row_id: appliedCoupon.id }) })
        .eq("code", appliedCoupon.code)
    }

    // Produkt Lagerbestand reduzieren
    for (const item of items) {
      await supabase
        .from("products")
        .update({ stock: supabase.rpc('decrement', { row_id: item.id, amount: item.quantity }) })
        .eq("id", item.id)
    }

    // Warenkorb leeren
    // (Client-seitig)

    return NextResponse.json({ 
      success: true, 
      orderId: order.id,
      orderNumber: orderNumber,
      totalAmount: totalAmount
    })
  } catch (error) {
    console.error("Checkout Error:", error)
    return NextResponse.json({ error: "Interner Serverfehler" }, { status: 500 })
  }
}
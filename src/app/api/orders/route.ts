//  src/app/api/orders/route.ts

import { supabase } from "@/lib/supabase/server";
import { auth } from "@/lib/auth/config";
import { NextRequest, NextResponse } from "next/server";
import { sendOrderConfirmationEmail } from "@/lib/email/send-email";

// Bestellung erstellen
export async function POST(request: NextRequest) {
  const session = await auth();

  if (!session) {
    return NextResponse.json({ error: "Nicht autorisiert" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const {
      orderData,
      items,
      totalAmount,
      discountAmount,
      appliedCoupon,
      paymentMethod,
    } = body;

    // Validierung
    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: "Keine Artikel im Warenkorb" },
        { status: 400 }
      );
    }
    
    // Vollständiger Name
    const fullName = `${orderData.firstName} ${orderData.lastName}`;

    // Bestellnummer generieren (z.B. INV-20241212-00123)
    const orderNumber = `INV-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, "0")}${String(new Date().getDate()).padStart(2, "0")}-${Math.floor(Math.random() * 10000)}`;

    // Vollständige Adresse zusammensetzen
    const fullAddress = `${orderData.street} ${orderData.houseNumber}, ${orderData.zipCode} ${orderData.city}, ${orderData.country}`;

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
      .single();

    if (orderError) {
      console.error("Order Error:", orderError);
      return NextResponse.json(
        { error: "Fehler beim Erstellen der Bestellung" },
        { status: 500 },
      );
    }

    // Order Items speichern
    const orderItems = items.map((item: any) => ({
      order_id: order.id,
      product_id: item.id,
      product_name: item.title,
      quantity: item.quantity,
      price: item.price,
    }));

    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(orderItems);

    if (itemsError) {
      console.error("Order Items Error:", itemsError);
      return NextResponse.json(
        { error: "Fehler beim Speichern der Artikel" },
        { status: 500 },
      );
    }

    // Produkt Lagerbestand reduzieren (korrigierte RPC Syntax)
    for (const item of items) {
      // Hole aktuellen Bestand
      const { data: product } = await supabase
        .from("products")
        .select("stock")
        .eq("id", item.id)
        .single();

      if (product) {
        const newStock = Math.max(0, product.stock - item.quantity);
        await supabase
          .from("products")
          .update({ stock: newStock })
          .eq("id", item.id);
      }
    }

    // Wenn Coupon verwendet wurde, used_count erhöhen
    if (appliedCoupon && appliedCoupon.code) {
      // Hole aktuellen used_count
      const { data: coupon } = await supabase
        .from("coupons")
        .select("used_count")
        .eq("code", appliedCoupon.code)
        .single();

      if (coupon) {
        const newUsedCount = (coupon.used_count || 0) + 1;
        await supabase
          .from("coupons")
          .update({ used_count: newUsedCount })
          .eq("code", appliedCoupon.code);
      }
    }

    // Customer Daten holen
    const { data: customer } = await supabase
      .from("users")
      .select("name, email")
      .eq("id", session.user.id)
      .single();

    const customerEmail = customer?.email || orderData.email;
    const customerName = customer?.name || fullName;

    // Email mit PDF-Rechnung senden (optional, nicht kritisch für Bestellung)
     try {
    await sendOrderConfirmationEmail({

        order: {
          id: order.id,
          order_number: orderNumber,
          total_amount: totalAmount,
          created_at: new Date().toISOString(),
          status: "pending",
          payment_method: paymentMethod,
          payment_status: "pending",
          shipping_address: fullAddress,
          shipping_city: orderData.city,
          shipping_zip: orderData.zipCode,
          shipping_country: orderData.country,
        },
        orderItems: orderItems.map((item: any) => ({
          product_name: item.product_name,
          quantity: item.quantity,
          price: item.price,
        })),
        customer: {
          name: customerName,
          email: customerEmail,
        },
        discountAmount: discountAmount || 0,
        appliedCoupon: appliedCoupon?.code || null,
      });
      console.log(`Bestätigungs-E-Mail an ${customerEmail} gesendet`);
    } catch (emailError) {
      // Email Fehler loggen, aber Bestellung nicht abbrechen
      console.error("Email sending failed:", emailError);
    }

    // Warenkorb leeren
    // (Client-seitig)
    return NextResponse.json({
      success: true,
      orderId: order.id,
      orderNumber: orderNumber,
      totalAmount: totalAmount,
    });
  } catch (error) {
    console.error("Checkout Error:", error);
    return NextResponse.json(
      { error: "Interner Serverfehler" },
      { status: 500 }
    );
  }
}
// Optional: Admin Benachrichtigung (kann später hinzugefügt werden)

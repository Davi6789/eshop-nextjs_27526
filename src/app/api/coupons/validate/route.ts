// src/app/api/coupons/validate/route.ts

import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { code, cartTotal } = body;
    
    // Prüfe ob code existiert und ist ein String
    if (!code || typeof code !== 'string') {
      return NextResponse.json(
        { error: "Bitte gib einen gültigen Gutscheincode ein" },
        { status: 400 }
      );
    }
    
    // Code in Großbuchstaben umwandeln für Vergleich
    const normalizedCode = code.toUpperCase().trim();
    
    console.log("Suche Coupon:", normalizedCode);
    
    // Coupon aus Datenbank suchen
    const { data: coupon, error } = await supabase
      .from("coupons")
      .select("*")
      .eq("code", normalizedCode)
      .single();
    
    if (error || !coupon) {
      console.log("Coupon nicht gefunden:", normalizedCode);
      return NextResponse.json(
        { error: "Ungültiger Gutscheincode" },
        { status: 404 }
      );
    }
    
    console.log("Coupon gefunden:", coupon);
    
    // Prüfe ob Coupon aktiv ist
    if (!coupon.is_active) {
      return NextResponse.json(
        { error: "Dieser Gutschein ist nicht mehr gültig" },
        { status: 400 }
      );
    }
    
    // Prüfe Gültigkeitszeitraum
    const now = new Date();
    const validFrom = coupon.valid_from ? new Date(coupon.valid_from) : null;
    const validUntil = coupon.valid_until ? new Date(coupon.valid_until) : null;
    
    if (validFrom && now < validFrom) {
      return NextResponse.json(
        { error: `Gutschein gültig ab ${validFrom.toLocaleDateString("de-DE")}` },
        { status: 400 }
      );
    }
    
    if (validUntil && now > validUntil) {
      return NextResponse.json(
        { error: "Dieser Gutschein ist abgelaufen" },
        { status: 400 }
      );
    }
    
    // Prüfe Mindestbestellwert
    if (coupon.min_order_amount && cartTotal < coupon.min_order_amount) {
      return NextResponse.json(
        { error: `Mindestbestellwert von ${coupon.min_order_amount}€ nicht erreicht (aktuell: ${cartTotal.toFixed(2)}€)` },
        { status: 400 }
      );
    }
    
    // Prüfe Verwendungslimit
    if (coupon.usage_limit && coupon.used_count >= coupon.usage_limit) {
      return NextResponse.json(
        { error: "Dieser Gutschein wurde bereits maximal oft verwendet" },
        { status: 400 }
      );
    }
    
    // Rabatt berechnen
    let discountAmount = 0;
    if (coupon.discount_type === "percentage") {
      discountAmount = (cartTotal * coupon.discount_value) / 100;
      if (coupon.max_discount && discountAmount > coupon.max_discount) {
        discountAmount = coupon.max_discount;
      }
    } else {
      discountAmount = Math.min(coupon.discount_value, cartTotal);
    }
    
    // Erfolgreiche Antwort
    return NextResponse.json({
      valid: true,
      code: coupon.code,
      discount_type: coupon.discount_type,
      discount_value: coupon.discount_value,
      discount_amount: discountAmount,
      min_order_amount: coupon.min_order_amount
    });
    
  } catch (error) {
    console.error("Coupon validation error:", error);
    return NextResponse.json(
      { error: "Fehler bei der Gutscheinprüfung" },
      { status: 500 }
    );
  }
}
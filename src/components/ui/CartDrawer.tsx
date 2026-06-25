// src/components/ui/CartDrawer.tsx

"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import CouponInput from "./CouponInput";

interface CartItem {
  id: string;
  title: string;
  price: number;
  image?: string;
  quantity: number;
}

interface AppliedCoupon {
  code: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  minOrderAmount: number;
}

interface CartDrawerProps {
  onClose: () => void;
}

export default function CartDrawer({ onClose }: CartDrawerProps) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | null>(null);
  const [couponError, setCouponError] = useState<string>("");
  const drawerRef = useRef<HTMLDivElement>(null)
  const [startX, setStartX] = useState(0)
  const [isDragging, setIsDragging] = useState(false);
  const [offsetX, setOffsetX] = useState(0);

  // Gesamtpreis ohne Rabatt
  const getTotalPrice = () => {
    return items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  };

  // Rabattbetrag berechnen
  const getDiscountAmount = () => {
    if (!appliedCoupon) return 0;
    
    const subtotal = getTotalPrice();
    
    if (appliedCoupon.discountType === "percentage") {
      return (subtotal * appliedCoupon.discountValue) / 100;
    } else {
      return Math.min(appliedCoupon.discountValue, subtotal);
    }
  };

  // Endpreis mit Rabatt
  const getDiscountedTotal = () => {
    return getTotalPrice() - getDiscountAmount();
  };

  // Währung formatieren
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("de-DE", {
      style: "currency",
      currency: "EUR",
    }).format(price);
  };

  useEffect(() => {
    loadCart();
    window.addEventListener("cartUpdated", loadCart);
    return () => window.removeEventListener("cartUpdated", loadCart);
  }, []);

  const loadCart = () => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    setItems(cart);
  };

  const removeItem = (id: string) => {
    const updated = items.filter((item) => item.id !== id);
    setItems(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    const updated = items.map((item) =>
      item.id === id ? { ...item, quantity: newQuantity } : item
    );
    setItems(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
    window.dispatchEvent(new Event("cartUpdated"));
  };

  // Coupon anwenden
  const applyCoupon = async (code: string) => {
    setCouponError("");
    
    try {
      const response = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, cartTotal: getTotalPrice() }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        setCouponError(data.error || "Ungültiger Coupon");
        return false;
      }
      
      setAppliedCoupon({
        code: data.code,
        discountType: data.discount_type,
        discountValue: data.discount_value,
        minOrderAmount: data.min_order_amount || 0,
      });
      
      return true;
    } catch (error) {
      setCouponError("Fehler beim Einlösen des Coupons");
      return false;
    }
  };

  // Coupon entfernen
  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponError("");
  };

  // ✅ Swipe to Close - Touch Events
  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      setStartX(touch.clientX);
      setIsDragging(false);
      setOffsetX(0);
    };

    const handleTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0];
      const diff = startX - touch.clientX;
      
      // Nur wenn nach links gewischt wird (diff > 0)
      if (diff > 0) {
        setIsDragging(true);
        setOffsetX(Math.min(diff, 200)); // Max 200px Offset
      }
    };

    const handleTouchEnd = () => {
      // Wenn mehr als 80px gewischt wurde, Drawer schließen
      if (offsetX > 80) {
        onClose();
      }
      
      // Reset
      setIsDragging(false);
      setOffsetX(0);
    };

    const drawerElement = drawerRef.current;
    if (drawerElement) {
      drawerElement.addEventListener("touchstart", handleTouchStart);
      drawerElement.addEventListener("touchmove", handleTouchMove);
      drawerElement.addEventListener("touchend", handleTouchEnd);
    }

    return () => {
      if (drawerElement) {
        drawerElement.removeEventListener("touchstart", handleTouchStart);
        drawerElement.removeEventListener("touchmove", handleTouchMove);
        drawerElement.removeEventListener("touchend", handleTouchEnd);
      }
    };
  }, [startX, offsetX, onClose]);

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose}></div>

      {/* Drawer - mit Swipe-Animation */}
      <div 
        ref={drawerRef}
        className="relative h-full w-full sm:w-96 bg-white dark:bg-gray-800 shadow-xl overflow-y-auto transition-transform duration-300"
        style={{
          transform: isDragging ? `translateX(${offsetX}px)` : "translateX(0)",
          transition: isDragging ? "none" : "transform 0.3s ease-out"
        }}
      >

        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 z-10">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              🛒 Warenkorb ({items.length})
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 text-2xl"
            >
              ✕
            </button>
          </div>
          {/* Swipe-Hinweis */}
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 text-center sm:hidden">
            👈 Zum Schließen nach links wischen
          </p>
        </div>

        {/* Items */}
        {items.length > 0 ? (
          <>
            <div className="p-4 space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 border border-gray-200 dark:border-gray-700 rounded-lg p-4"
                >
                  {/* Image */}
                  <div className="relative w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded overflow-hidden flex-shrink-0">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-2xl">
                        📦
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-2">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                      {formatPrice(item.price)}
                    </p>

                    {/* Quantity */}
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                      >
                        -
                      </button>
                      <span className="w-8 text-center text-gray-900 dark:text-white">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Preis & Remove */}
                  <div className="text-right">
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="mt-2 text-red-600 hover:text-red-700 text-xl"
                      aria-label="Entfernen"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4 space-y-4">
              {/* Coupon Bereich */}
              <CouponInput
                onApply={applyCoupon}
                onRemove={removeCoupon}
                cartTotal={getTotalPrice()}
                appliedCoupon={appliedCoupon}
                error={couponError}
              />

              {/* Preisübersicht */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                  <span>Zwischensumme:</span>
                  <span>{formatPrice(getTotalPrice())}</span>
                </div>

                {appliedCoupon && (
                  <div className="flex justify-between text-sm text-green-600 dark:text-green-400">
                    <span>
                      Rabatt ({appliedCoupon.discountType === "percentage" 
                        ? `${appliedCoupon.discountValue}%` 
                        : `€${appliedCoupon.discountValue}`}):
                    </span>
                    <span>-{formatPrice(getDiscountAmount())}</span>
                  </div>
                )}

                <div className="flex justify-between text-lg font-bold text-gray-900 dark:text-white pt-2 border-t border-gray-200 dark:border-gray-700">
                  <span>Gesamt:</span>
                  <span>{formatPrice(getDiscountedTotal())}</span>
                </div>

                {/* Versandinfo */}
                {getDiscountedTotal() < 50 && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                    🚚 Kostenloser Versand ab 50€ (noch {formatPrice(50 - getDiscountedTotal())} fehlen)
                  </p>
                )}
              </div>

              {/* Buttons */}
              <Link
                href="/checkout"
                className="block w-full bg-blue-600 text-white text-center py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
                onClick={onClose}
              >
                Zur Kasse
              </Link>

              <button
                onClick={onClose}
                className="w-full bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white py-3 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition font-semibold"
              >
                Weiter einkaufen
              </button>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-96 text-center p-4">
            <p className="text-6xl mb-4">🛒</p>
            <p className="text-gray-600 dark:text-gray-400 mb-2">
              Dein Warenkorb ist leer
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500 mb-6">
              Entdecke unsere Produkte und finde deine Favoriten
            </p>
            <Link
              href="/products"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
              onClick={onClose}
            >
              Zum Einkaufen
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
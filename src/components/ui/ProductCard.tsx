// src/components/ui/ProductCard.tsx

"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import { useSession } from "next-auth/react";
import CountdownTimer from "./CountdownTimer";

interface ProductCardProps {
  product: {
    id: string;
    title: string;
    slug: string;
    description: string;
    price: number;
    current_price: number;
    has_discount: boolean;
    discount_percent: number;
    image_url: string | null;
    images: string[] | null;
    stock: number;
    rating_avg: number;
    rating_count: number;
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const { data: session } = useSession();
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  // Prüfen ob Produkt in Wunschliste ist
  useEffect(() => {
    if (session?.user?.id) {
      checkWishlistStatus();
    }
  }, [session]);

  const checkWishlistStatus = async () => {
    const { data, error } = await supabase
      .from("wishlist")
      .select("id")
      .eq("user_id", session?.user?.id)
      .eq("product_id", product.id)
      .single();

    if (!error && data) {
      setIsInWishlist(true);
    }
  };

  const toggleWishlist = async () => {
    if (!session) {
      window.location.href = "/login";
      return;
    }

    if (isInWishlist) {
      // Aus Wunschliste entfernen
      const { error } = await supabase
        .from("wishlist")
        .delete()
        .eq("user_id", session.user.id)
        .eq("product_id", product.id);

      if (!error) {
        setIsInWishlist(false);
      }
    } else {
      // Zur Wunschliste hinzufügen
      const { error } = await supabase.from("wishlist").insert({
        user_id: session.user.id,
        product_id: product.id,
      });

      if (!error) {
        setIsInWishlist(true);
      }
    }
  };

  const addToCart = () => {
    // Temporärer Cart - später mit Context
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const existingItem = cart.find((item: any) => item.id === product.id);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({
        id: product.id,
        title: product.title,
        price: product.current_price,
        image: product.image_url,
        quantity: 1,
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));

    // Event für Cart Update auslösen
    window.dispatchEvent(new Event("cartUpdated"));

    setIsAddingToCart(true);
    setTimeout(() => setIsAddingToCart(false), 1000);
  };

  // Sterne Bewertung anzeigen
  const renderStars = () => {
    const stars = [];
    const rating = Math.round(product.rating_avg);
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span
          key={i}
          className={i <= rating ? "text-yellow-400" : "text-gray-300"}
        >
          ★
        </span>,
      );
    }
    return stars;
  };

  // HIER GEÄNDERT: Fallback für die kaputten lokalen Bilder
  const displayImageUrl = product.image_url?.startsWith("/images/")
    ? `https://picsum.photos/seed/${product.slug}/400/300`
    : product.image_url || `https://picsum.photos/seed/${product.slug}/400/300`;

  return (
    <div className="group relative bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden">
      {/* Discount Badge */}
      {product.has_discount && (
        <div className="absolute top-2 left-2 z-10 bg-red-500 text-white px-2 py-1 rounded-md text-sm font-semibold">
          -{product.discount_percent}%
        </div>
      )}

      {product.has_discount && product.discount_ends_at && (
        <div className="absolute bottom-2 left-2 z-10">
          <CountdownTimer targetDate={product.discount_ends_at} />
        </div>
      )}

      {/* Wishlist Button */}
      <button
        onClick={toggleWishlist}
        className="absolute top-2 right-2 z-10 bg-white dark:bg-gray-800 rounded-full p-2 shadow-md hover:scale-110 transition"
      >
        <span className="text-xl">{isInWishlist ? "❤️" : "🤍"}</span>
      </button>

      {/* Product Image */}
      <Link href={`/products/${product.slug}`} className="block relative z-0">
        <div className="relative h-64 bg-gray-200 dark:bg-gray-700 overflow-hidden">
          {/* {product.image_url ? ( */}
          <Image
            // src={product.image_url}
            src={displayImageUrl}
            alt={product.title}
            fill
            unoptimized // WICHTIG: Stoppt die Next.js Bildprüfung für leere Dateien
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      </Link>

      {/* Product Info */}
      <div className="p-4">
        <Link href={`/products/${product.slug}`}>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white hover:text-blue-600 transition line-clamp-2 min-h-[56px]">
            {product.title}
          </h3>
        </Link>

        {/* Rating */}
        {product.rating_count > 0 && (
          <div className="flex items-center mt-1">
            <div className="flex text-sm">{renderStars()}</div>
            <span className="ml-1 text-xs text-gray-500 dark:text-gray-400">
              ({product.rating_count})
            </span>
          </div>
        )}

        {/* Price */}
        <div className="mt-2">
          {product.has_discount ? (
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-red-600">
                €{product.current_price.toFixed(2)}
              </span>
              <span className="text-sm text-gray-500 line-through">
                €{product.price.toFixed(2)}
              </span>
            </div>
          ) : (
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              €{product.current_price.toFixed(2)}
            </span>
          )}
        </div>

        {/* Stock Status */}
        <div className="mt-2">
          {product.stock > 0 ? (
            <span className="text-xs text-green-600 dark:text-green-400">
              ✅ Auf Lager ({product.stock})
            </span>
          ) : (
            <span className="text-xs text-red-600 dark:text-red-400">
              ❌ Ausverkauft
            </span>
          )}
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={addToCart}
          disabled={product.stock === 0 || isAddingToCart}
          className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isAddingToCart ? "✓ Hinzugefügt!" : "🛒 In den Warenkorb"}
        </button>
      </div>
    </div>
  );
}

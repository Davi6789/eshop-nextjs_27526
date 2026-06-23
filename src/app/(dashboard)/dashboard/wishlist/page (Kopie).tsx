//  src/app/(dashboard)/dashboard/wishlist/page.tsx

"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import Link from "next/link";
import Image from "next/image";
import { useWishlist } from "@/context/WishlistContext"
import { useCart } from "@/context/CartContext"
import WishlistButton from "@/components/ui/WishlistButton"
import LoadingSpinner from "@/components/ui/LoadingSpinner";

interface WishlistItem {
  id: string;
  product_id: string;
  products: {
    id: string;
    title: string;
    slug: string;
    price: number;
    discount_price: number | null;
    discount_until: string | null;
    image_url: string;
  };
}

export default function WishlistPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Redirect wenn nicht eingeloggt
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  // Wunschliste laden wenn eingeloggt
  useEffect(() => {
    if (status === "authenticated" && session?.user?.id) {
      loadWishlist();
    }
  }, [session, status]);

  const loadWishlist = async () => {
    if (!session?.user?.id) return;

    setIsLoading(true);

    // console.log("Loading wishlist for user:", session?.user?.id); // ← DEBUG!

    // const { data, error } = await supabase
    //   .from("wishlist")
    //   .select(
    //     `
    //     id,
    //     product_id,
    //     products (*)
    //   `,
    //   )
    //   .eq("user_id", session?.user?.id);

    // console.log("Wishlist data:", data); // ← DEBUG!
    // console.log("Wishlist error:", error); // ← DEBUG!

    // if (!error && data) {
    //   setWishlistItems(data as any);
    // } else if (error) {
    //   console.error("Error loading wishlist:", error);
    // }
    
try {
    // Schritt 1: Lade nur die Wishlist-Items
    const { data: wishlistData, error: wishlistError } = await supabase
      .from("wishlist")
      .select("id, product_id")
      .eq("user_id", session.user.id);

    if (wishlistError) {
      console.error("Wishlist error:", wishlistError);
      setIsLoading(false);
      return;
    }

    console.log("Wishlist items:", wishlistData);

    // Schritt 2: Lade die Produkte separat
    if (wishlistData && wishlistData.length > 0) {
      const productIds = wishlistData.map((item: any) => item.product_id);
      
      const { data: productsData, error: productsError } = await supabase
        .from("products")
        .select("*")
        .in("id", productIds);

      if (!productsError && productsData) {
        // Merge die Daten
        const merged = wishlistData.map((item: any) => ({
          id: item.id,
          product_id: item.product_id,
          products: productsData.find((p: any) => p.id === item.product_id),
        }));
        
        setWishlistItems(merged);
        console.log("Final items:", merged);
      }
    }
  } catch (error) {
    console.error("Error:", error);
  }
    setIsLoading(false);
  };

  const removeFromWishlist = async (wishlistId: string) => {
    const { error } = await supabase
      .from("wishlist")
      .delete()
      .eq("id", wishlistId);

    if (!error) {
      setWishlistItems(wishlistItems.filter((item) => item.id !== wishlistId));
    } else {
      console.error("Error removing from wishlist:", error);
    }
  };

  // Loading State
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <LoadingSpinner />
      </div>
      // return (
      //   <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      //     <div className="max-w-7xl mx-auto px-4">
      //       <div className="text-center">Laden...</div>
      //     </div>
      //   </div>
      // if (isLoading) return <LoadingSpinner />;
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Meine Wunschliste
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Produkte, die dir gefallen haben
          </p>
        </div>

        {wishlistItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlistItems.map((item) => {
              const product = item.products;
              const hasDiscount =
                product.discount_until &&
                new Date(product.discount_until) > new Date() &&
                product.discount_price;
              const currentPrice = hasDiscount
                ? product.discount_price
                : product.price;

              return (
                <div
                  key={item.id}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden"
                >
                  <Link href={`/products/${product.slug}`}>
                    <div className="relative h-48 bg-gray-200 dark:bg-gray-700">
                      {product.image_url ? (
                        <Image
                          src={product.image_url} // z.B. https://ymnzxbapwbaetecxutbi.supabase.co/storage/v1/object/public/images/headphones-1.jpg
                          alt={product.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <span className="text-gray-400">Kein Bild</span>
                        </div>
                      )}
                    </div>
                  </Link>

                  <div className="p-4">
                    <Link href={`/products/${product.slug}`}>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors line-clamp-2">
                        {product.title}
                      </h3>
                    </Link>

                    <div className="mt-2">
                      {hasDiscount ? (
                        <div className="flex items-center space-x-2">
                          <span className="text-2xl font-bold text-red-600 dark:text-red-400">
                            €{(currentPrice ?? 0).toFixed(2)}
                          </span>
                          <span className="text-sm text-gray-500 line-through">
                            €{product.price.toFixed(2)}
                          </span>
                        </div>
                      ) : (
                        <span className="text-2xl font-bold text-gray-900 dark:text-white">
                          €{(currentPrice ?? 0).toFixed(2)}
                        </span>
                      )}
                    </div>

                    <div className="mt-4 flex space-x-2">
                      <Link
                        href={`/products/${product.slug}`}
                        className="flex-1 bg-blue-600 text-white text-center px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                      >
                        Ansehen
                      </Link>
                      <button
                        onClick={() => removeFromWishlist(item.id)}
                        className="px-4 py-2 border border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                        aria-label="Von Wunschliste entfernen"
                      >
                        🗑️ ❌
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-12 text-center">
            <div className="text-6xl mb-4">💔</div>
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              Deine Wunschliste ist noch leer.
            </p>
            <p className="text-gray-400 dark:text-gray-500 mt-2">
              Speichere Produkte, die dir gefallen, um sie später
              wiederzufinden.
            </p>
            <Link
              href="/products"
              className="mt-6 inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Produkte entdecken
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

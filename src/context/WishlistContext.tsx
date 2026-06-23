//  src/context/WishlistContext.tsx

"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { useSession } from "next-auth/react"
import { supabase } from "@/lib/supabase/client"

interface WishlistItem {
  id: string
  product_id: string
  product: {
    id: string
    title: string
    slug: string
    price: number
    current_price: number
    image_url: string | null
    has_discount: boolean
    discount_percent: number
  }
}

interface WishlistContextType {
  items: WishlistItem[]
  isLoading: boolean
  addToWishlist: (productId: string) => Promise<void>
  removeFromWishlist: (productId: string) => Promise<void>
  isInWishlist: (productId: string) => boolean
  getWishlistCount: () => number
  toggleWishlist: (productId: string) => Promise<void>
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined)

export function WishlistProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession()
  const [items, setItems] = useState<WishlistItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Wishlist laden wenn eingeloggt
  useEffect(() => {
    if (status === "authenticated") {
      loadWishlist()
    } else {
      setItems([])
      setIsLoading(false)
    }
  }, [status, session])

  const loadWishlist = async () => {
    if (!session?.user?.id) return
    
    setIsLoading(true)
    try {
      const { data, error } = await supabase
        .from("wishlist")
        .select(`
          id,
          product_id,
          products (
            id,
            title,
            slug,
            price,
            discount_price,
            discount_until,
            image_url
          )
        `)
        .eq("user_id", session.user.id)

      if (!error && data) {
        // Dynamische Rabattberechnung für jedes Produkt
        const now = new Date()
        const itemsWithPrice = data.map((item: any) => {
          const product = item.products
          const hasDiscount = product.discount_until && 
            new Date(product.discount_until) > now && 
            product.discount_price
          
          return {
            ...item,
            product: {
              ...product,
              current_price: hasDiscount ? product.discount_price : product.price,
              has_discount: hasDiscount,
              discount_percent: hasDiscount ? 
                Math.round(((product.price - product.discount_price) / product.price) * 100) : 0
            }
          }
        })
        setItems(itemsWithPrice)
      }
    } catch (error) {
      console.error("Fehler beim Laden der Wunschliste:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const addToWishlist = async (productId: string) => {
    if (!session?.user?.id) {
      // Nicht eingeloggt -> zum Login weiterleiten
      window.location.href = "/login?redirect=" + window.location.pathname
      return
    }

    try {
      const { error } = await supabase
        .from("wishlist")
        .insert({
          user_id: session.user.id,
          product_id: productId
        })

      if (!error) {
        await loadWishlist()
      }
    } catch (error) {
      console.error("Fehler beim Hinzufügen:", error)
    }
  }

  const removeFromWishlist = async (productId: string) => {
    if (!session?.user?.id) return

    try {
      const { error } = await supabase
        .from("wishlist")
        .delete()
        .eq("user_id", session.user.id)
        .eq("product_id", productId)

      if (!error) {
        setItems(prev => prev.filter(item => item.product_id !== productId))
      }
    } catch (error) {
      console.error("Fehler beim Entfernen:", error)
    }
  }

  const isInWishlist = (productId: string) => {
    return items.some(item => item.product_id === productId)
  }

  const getWishlistCount = () => {
    return items.length
  }

  const toggleWishlist = async (productId: string) => {
    if (isInWishlist(productId)) {
      await removeFromWishlist(productId)
    } else {
      await addToWishlist(productId)
    }
  }

  return (
    <WishlistContext.Provider
      value={{
        items,
        isLoading,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        getWishlistCount,
        toggleWishlist
      }}
    >
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  const context = useContext(WishlistContext)
  if (context === undefined) {
    throw new Error("useWishlist must be used within a WishlistProvider")
  }
  return context
}
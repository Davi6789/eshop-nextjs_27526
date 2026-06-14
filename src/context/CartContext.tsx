//  src/context/CartContext.tsx
// 
"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"

interface CartItem {
  id: string
  title: string
  price: number
  image?: string
  quantity: number
  stock?: number
}

interface AppliedCoupon {
  code: string
  discountType: "percentage" | "fixed"
  discountValue: number
}

interface CartContextType {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  getTotalPrice: () => number
  getTotalItems: () => number
  getDiscountedTotal: () => number
  getDiscountAmount: () => number
  isOpen: boolean
  openCart: () => void
  closeCart: () => void
  toggleCart: () => void
  appliedCoupon: AppliedCoupon | null
  applyCoupon: (coupon: AppliedCoupon) => void
  removeCoupon: () => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | null>(null)

  // Load from localStorage ONCE on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedCart = localStorage.getItem("cart")
      if (savedCart) {
        try {
          setItems(JSON.parse(savedCart))
        } catch (e) {
          console.error("Fehler beim Laden des Warenkorbs:", e)
        }
      }
    }
  }, [])

  // Save to localStorage whenever items change
  useEffect(() => {
    if (typeof window !== "undefined" && items.length >= 0) {
      localStorage.setItem("cart", JSON.stringify(items))
    }
  }, [items])

  const addItem = (newItem: CartItem) => {
    setItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === newItem.id)
      if (existingItem) {
        return prevItems.map(item =>
          item.id === newItem.id
            ? { ...item, quantity: item.quantity + (newItem.quantity || 1) }
            : item
        )
      }
      return [...prevItems, newItem]
    })
  }

  const removeItem = (id: string) => {
    setItems(prevItems => prevItems.filter(item => item.id !== id))
  }

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id)
      return
    }
    setItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, quantity } : item
      )
    )
  }

  const clearCart = () => setItems([])

  const getTotalPrice = () => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0)
  }

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0)
  }

  const getDiscountAmount = () => {
    if (!appliedCoupon) return 0
    const subtotal = getTotalPrice()
    if (appliedCoupon.discountType === "percentage") {
      return (subtotal * appliedCoupon.discountValue) / 100
    }
    return appliedCoupon.discountValue
  }

  const getDiscountedTotal = () => {
    return getTotalPrice() - getDiscountAmount()
  }

  const applyCoupon = (coupon: AppliedCoupon) => {
    setAppliedCoupon(coupon)
  }

  const removeCoupon = () => {
    setAppliedCoupon(null)
  }

  const openCart = () => setIsOpen(true)
  const closeCart = () => setIsOpen(false)
  const toggleCart = () => setIsOpen(prev => !prev)

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        getTotalPrice,
        getTotalItems,
        getDiscountedTotal,
        getDiscountAmount,
        isOpen,
        openCart,
        closeCart,
        toggleCart,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
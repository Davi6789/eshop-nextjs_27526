//  src/types/cart.ts

export interface CartItem {
  id: string
  title: string
  price: number
  image: string | null
  quantity: number
  stock: number
}

export interface CartContextType {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  getTotalPrice: () => number
  getTotalItems: () => number
  isOpen: boolean
  openCart: () => void
  closeCart: () => void
  toggleCart: () => void
}
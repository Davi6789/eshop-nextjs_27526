// src/types/email.ts

export interface OrderEmailData {
  orderNumber: string
  customerName: string
  customerEmail: string
  orderDate: string
  items: {
    name: string
    quantity: number
    price: number
    total: number
  }[]
  subtotal: number
  discount: number
  shipping: number
  total: number
  shippingAddress: string
  paymentMethod: string
  orderId: string
}